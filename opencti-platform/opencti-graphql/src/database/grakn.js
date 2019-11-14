import uuid from 'uuid/v4';
import {
  __,
  append,
  assoc,
  chain,
  concat,
  dissoc,
  equals,
  filter,
  flatten,
  fromPairs,
  groupBy,
  head,
  includes,
  isEmpty,
  isNil,
  join,
  last,
  map,
  mapObjIndexed,
  mergeAll,
  mergeRight,
  pipe,
  pluck,
  sort,
  tail,
  toPairs,
  uniq,
  uniqBy,
  uniqWith
} from 'ramda';
import moment from 'moment';
import { cursorToOffset } from 'graphql-relay/lib/connection/arrayconnection';
import Grakn from 'grakn-client';
import conf, { logger } from '../config/conf';
import { buildPagination, fillTimeSeries, randomKey } from './utils';
import { isInversed } from './graknRoles';
import {
  elDeleteInstanceIds,
  elIndex,
  elLoadByGraknId,
  elLoadById,
  elLoadByStixId,
  elPaginate,
  elUpdate,
  elUpdateAddInnerRelation,
  elUpdateRemoveInnerRelation,
  INDEX_STIX_ENTITIES,
  INDEX_STIX_OBSERVABLE,
  INDEX_STIX_RELATIONS
} from './elasticSearch';

// region global variables
const dateFormat = 'YYYY-MM-DDTHH:mm:ss';
const GraknString = 'String';
const GraknDate = 'Date';

// region deprecated
export const now = () =>
  moment()
    .utc()
    .toISOString();
export const graknNow = () =>
  moment()
    .utc()
    .format(dateFormat); // Format that accept grakn
export const prepareDate = date =>
  moment(date)
    .utc()
    .format(dateFormat);
// endregion

export const sinceNowInMinutes = lastModified => {
  const utc = moment().utc();
  const diff = utc.diff(moment(lastModified));
  const duration = moment.duration(diff);
  return Math.floor(duration.asMinutes());
};

export const yearFormat = date => moment(date).format('YYYY');
export const monthFormat = date => moment(date).format('YYYY-MM');
export const dayFormat = date => moment(date).format('YYYY-MM-DD');
export const escape = s =>
  s && typeof s === 'string'
    ? s
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
    : s;
export const escapeString = s => (s ? s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : '');

// Attributes key that can contains multiple values.
export const multipleAttributes = ['stix_label', 'alias', 'grant', 'platform', 'required_permission'];
export const statsDateAttributes = [
  'first_seen', // Standard
  'last_seen', // Standard
  'published', // Standard
  'expiration' // Standard
];
// endregion

// region client
const client = new Grakn(`${conf.get('grakn:hostname')}:${conf.get('grakn:port')}`);
let session = null;
// endregion

// region basic commands
const closeTx = async gTx => {
  try {
    if (gTx.tx.isOpen()) {
      await gTx.tx.close();
    }
  } catch (err) {
    logger.error('[GRAKN] CloseReadTx error > ', err);
  }
};
const takeReadTx = async (retry = false) => {
  if (session === null) {
    session = await client.session('grakn');
  }
  try {
    const tx = await session.transaction().read();
    return { session, tx };
  } catch (err) {
    logger.error('[GRAKN] TakeReadTx error > ', err);
    await session.close();
    if (retry === false) {
      session = null;
      return takeReadTx(true);
    }
    return null;
  }
};
const executeRead = async executeFunction => {
  const rTx = await takeReadTx();
  try {
    const result = await executeFunction(rTx);
    await closeTx(rTx);
    return result;
  } catch (err) {
    await closeTx(rTx);
    logger.error('[GRAKN] executeRead error > ', err);
    throw err;
  }
};

const takeWriteTx = async (retry = false) => {
  if (session === null) {
    session = await client.session('grakn');
  }
  try {
    const tx = await session.transaction().write();
    return { session, tx };
  } catch (err) {
    logger.error('[GRAKN] TakeWriteTx error > ', err);
    if (retry === false) {
      session = null;
      return takeWriteTx(true);
    }
    return null;
  }
};
const commitWriteTx = async wTx => {
  try {
    await wTx.tx.commit();
  } catch (err) {
    logger.error('[GRAKN] CommitWriteTx error > ', err);
  }
};
export const executeWrite = async executeFunction => {
  const wTx = await takeWriteTx();
  try {
    const result = await executeFunction(wTx);
    await commitWriteTx(wTx);
    return result;
  } catch (err) {
    await closeTx(wTx);
    logger.error('[GRAKN] executeWrite error > ', err);
    throw err;
  }
};
export const write = async query => {
  const wTx = await takeWriteTx();
  try {
    await wTx.tx.query(query);
    await commitWriteTx(wTx);
  } catch (err) {
    logger.error('[GRAKN] Write error > ', err);
  } finally {
    await closeTx(wTx);
  }
};

export const graknIsAlive = async () => {
  try {
    // Just try to take a read transaction
    await executeRead(() => {});
  } catch (e) {
    logger.error(`[GRAKN] Seems down`);
    throw new Error('Grakn seems down');
  }
};
export const getGraknVersion = async () => {
  // It seems that Grakn server does not expose its version yet:
  // https://github.com/graknlabs/client-nodejs/issues/47
  return '1.5.9';
};

/**
 * Recursive fetch of every types of a concept
 * @param concept the element
 * @param currentType the current type
 * @param acc the recursive accumulator
 * @returns {Promise<Array>}
 */
export const conceptTypes = async (concept, currentType = null, acc = []) => {
  if (currentType === null) {
    const conceptType = await concept.type();
    const conceptLabel = await conceptType.label();
    acc.push(conceptLabel);
    return conceptTypes(concept, conceptType, acc);
  }
  const parentType = await currentType.sup();
  if (parentType === null) return acc;
  const conceptLabel = await parentType.label();
  if (conceptLabel === 'entity' || conceptLabel === 'relation') return acc;
  acc.push(conceptLabel);
  return conceptTypes(concept, parentType, acc);
};

/**
 * Extract all vars from a grakn query
 * @param query
 */
const extractQueryVars = query => {
  return uniq(map(m => m.replace('$', ''), query.match(/\$[a-z]+/gi)));
};
// endregion

// region stable functions
/**
 * Query and get attribute values
 * @param type
 * @returns {{edges: *}}
 */
export const queryAttributeValues = async type => {
  return executeRead(async rTx => {
    const query = `match $x isa ${escape(type)}; get;`;
    logger.debug(`[GRAKN - infer: false] queryAttributeValues > ${query}`);
    const iterator = await rTx.tx.query(query);
    const answers = await iterator.collect();
    const result = await Promise.all(
      answers.map(async answer => {
        const attribute = answer.map().get('x');
        const attributeType = await attribute.type();
        const value = await attribute.value();
        const attributeTypeLabel = await attributeType.label();
        const replacedValue = value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        return {
          node: {
            id: attribute.id,
            type: attributeTypeLabel,
            value: replacedValue
          }
        };
      })
    );
    return buildPagination(5000, 0, result, 5000);
  });
};

export const attributeExists = async attributeLabel => {
  return executeRead(async rTx => {
    const checkQuery = `match $x sub ${attributeLabel}; get;`;
    logger.debug(`[GRAKN - infer: false] attributeExists > ${checkQuery}`);
    await rTx.tx.query(checkQuery);
    return true;
  }).catch(() => false);
};

/**
 * Query and get attribute values
 * @param id
 * @returns {{edges: *}}
 */
export const queryAttributeValueById = async id => {
  return executeRead(async rTx => {
    const query = `match $x id ${escape(id)}; get;`;
    logger.debug(`[GRAKN - infer: false] queryAttributeValueById > ${query}`);
    const iterator = await rTx.tx.query(query);
    const answer = await iterator.next();
    const attribute = answer.map().get('x');
    const attributeType = await attribute.type();
    const value = await attribute.value();
    const attributeTypeLabel = await attributeType.label();
    const replacedValue = value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    return {
      id: attribute.id,
      type: attributeTypeLabel,
      value: replacedValue
    };
  });
};

/**
 * Grakn generic function to delete an instance (and orphan relationships)
 * @param id
 * @returns {Promise<any[] | never>}
 */
export const deleteAttributeById = async id => {
  return executeWrite(async wTx => {
    const query = `match $x id ${escape(id)}; delete $x;`;
    logger.debug(`[GRAKN - infer: false] deleteAttributeById > ${query}`);
    await wTx.tx.query(query, { infer: false });
    return id;
  });
};

/**
 * Get relations to index
 * @param type
 * @param id
 * @returns {Promise<{}>}
 */
// const getRelationsValuesToIndex = async (type, id) => {
//   return executeRead(async rTx => {
//     let result = {};
//     if (relationsToIndex[type]) {
//       result = await Promise.all(
//         relationsToIndex[type].map(async relationToIndex => {
//           const query = `${
//             relationToIndex.query
//           } $x has internal_id_key "${escapeString(id)}"; get $value;`;
//           logger.debug(
//             `[GRAKN - infer: false] getRelationsValuesToIndex > ${query}`
//           );
//           const iterator = await rTx.tx.query(query);
//           const answers = await iterator.collect();
//           const test = await Promise.all(
//             answers.map(async answer => {
//               const attribute = answer.map().get('value');
//               return attribute.value();
//             })
//           ).then(data => {
//             return { [relationToIndex.key]: data };
//           });
//           const comp = await elFindRelationAndTarget(id, relationToIndex.type);
//           const test2 = {
//             [relationToIndex.key]: map(c => c.node.internal_id_key, comp.edges)
//           };
//           return test;
//         })
//       ).then(data => {
//         return mergeAll(data);
//       });
//     }
//     return result;
//   });
// };

/**
 * Compute the index related to concept types
 * @param types
 * @returns {String}
 */
export const TYPE_OPENCTI_INTERNAL = 'Internal';
export const TYPE_STIX_DOMAIN = 'Stix-Domain';
export const TYPE_STIX_DOMAIN_ENTITY = 'Stix-Domain-Entity';
export const TYPE_STIX_OBSERVABLE = 'Stix-Observable';
export const TYPE_STIX_OBSERVABLE_DATA = 'Stix-Observable-Data';
export const TYPE_STIX_RELATION = 'stix_relation';
export const TYPE_RELATION_EMBEDDED = 'relation_embedded';
export const TYPE_STIX_RELATION_EMBEDDED = 'stix_relation_embedded';
export const inferIndexFromConceptTypes = types => {
  // Observable index
  if (includes(TYPE_STIX_OBSERVABLE, types)) return INDEX_STIX_OBSERVABLE;
  if (includes(TYPE_STIX_OBSERVABLE_DATA, types)) return INDEX_STIX_OBSERVABLE;
  // Relation index
  if (includes(TYPE_STIX_RELATION, types)) return INDEX_STIX_RELATIONS;
  if (includes(TYPE_STIX_RELATION_EMBEDDED, types)) return INDEX_STIX_RELATIONS;
  if (includes(TYPE_RELATION_EMBEDDED, types)) return INDEX_STIX_RELATIONS;
  // Everything else in entities index
  return INDEX_STIX_ENTITIES;
};

const conceptOpts = { relationsMap: new Map() };
/**
 * Load any grakn instance with internal grakn ID.
 * @param concept the concept to get attributes from
 * @param relationsMap
 * @returns {Promise}
 */
const loadConcept = async (concept, { relationsMap } = conceptOpts) => {
  const { id } = concept;
  const conceptType = concept.baseType;
  const types = await conceptTypes(concept);
  // 01. If not found continue the process.
  const parentType = last(types);
  logger.debug(`[GRAKN - infer: false] getAttributes > ${head(types)} ${id}`);
  const attributesIterator = await concept.attributes();
  const attributes = await attributesIterator.collect();
  const attributesPromises = attributes.map(async attribute => {
    const attributeType = await attribute.type();
    const attributeLabel = await attributeType.label();
    return {
      dataType: await attributeType.dataType(),
      label: attributeLabel,
      value: await attribute.value()
    };
  });
  return Promise.all(attributesPromises)
    .then(attributesData => {
      const transform = pipe(
        map(attribute => {
          let transformedVal = attribute.value;
          const { dataType, label } = attribute;
          if (dataType === GraknDate) {
            transformedVal = moment(attribute.value)
              .utc()
              .toISOString();
          } else if (dataType === GraknString) {
            transformedVal = attribute.value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          }
          return { [label]: transformedVal };
        }), // Extract values
        chain(toPairs), // Convert to pairs for grouping
        groupBy(head), // Group by key
        map(pluck(1)), // Remove grouping boilerplate
        mapObjIndexed((num, key, obj) =>
          // eslint-disable-next-line no-nested-ternary
          Array.isArray(obj[key]) && !includes(key, multipleAttributes)
            ? head(obj[key])
            : head(obj[key]) && head(obj[key]) !== ''
            ? obj[key]
            : []
        ) // Remove extra list then contains only 1 element
      )(attributesData);
      return pipe(
        assoc('id', transform.internal_id_key),
        assoc('grakn_id', concept.id),
        assoc('parent_type', parentType),
        assoc('index_version', '1.0')
      )(transform);
    })
    .then(async entityData => {
      if (conceptType !== 'RELATION') return entityData;
      const isInferredPromise = concept.isInferred();
      const rolePlayers = await concept.rolePlayersMap();
      const roleEntries = Array.from(rolePlayers.entries()); // Array.from(rolePlayers.entries()).flat();
      const rolesPromises = Promise.all(
        map(async roleItem => {
          // eslint-disable-next-line prettier/prettier
          const roleId = last(roleItem).values().next().value.id;
          const conceptFromMap = relationsMap.get(roleId);
          return conceptFromMap
            ? head(roleItem)
                .label()
                .then(roleLabel => {
                  return {
                    [`${conceptFromMap.entity}Id`]: roleId,
                    [`${conceptFromMap.entity}Role`]: roleLabel,
                    [conceptFromMap.entity]: null // With be use lazily
                  };
                })
            : {};
        }, roleEntries)
      );
      // Wait for all promises before building the result
      return Promise.all([isInferredPromise, rolesPromises]).then(([isInferred, roles]) => {
        return pipe(
          assoc('id', isInferred ? uuid() : entityData.id),
          assoc('inferred', isInferred),
          assoc('entity_type', entityData.entity_type || 'relation-embedded'),
          assoc('relationship_type', head(types)),
          mergeRight(mergeAll(roles))
        )(entityData);
      });
    })
    .then(globalObject => {
      // 01. First fix the direction of the relation
      // When fetching the info, we cant know the source access
      const isInv = isInversed(globalObject.relationship_type, globalObject.fromRole);
      const fixedRel = pipe(
        assoc('fromId', isInv ? globalObject.toId : globalObject.fromId),
        assoc('fromRole', isInv ? globalObject.toRole : globalObject.fromRole),
        assoc('toId', isInv ? globalObject.fromId : globalObject.toId),
        assoc('toRole', isInv ? globalObject.fromRole : globalObject.toRole)
      )(globalObject);
      // 02. Then change the id if relation is inferred
      if (globalObject.inferred) {
        const { fromId, fromRole, toId, toRole } = fixedRel;
        const type = globalObject.relationship_type;
        const pattern = `{ $rel(${fromRole}: $from, ${toRole}: $to) isa ${type}; $from id ${fromId}; $to id ${toId}; };`;
        return assoc('id', Buffer.from(pattern).toString('base64'), globalObject);
      }
      return globalObject;
    });
};

const findOpts = { infer: false };
/**
 * Query and get entities or relations
 * @param query
 * @param entities
 * @param infer
 * @returns {Promise}
 */
export const find = async (query, entities, { infer } = findOpts) => {
  // Remove empty values from entities
  const plainEntities = filter(e => !isEmpty(e) && !isNil(e), entities);
  return executeRead(async rTx => {
    const conceptQueryVars = extractQueryVars(query);
    logger.debug(`[GRAKN - infer: ${infer}] Find > ${query}`);
    const iterator = await rTx.tx.query(query, { infer });
    // 01. Get every concepts to fetch (unique)
    const answers = await iterator.collect();
    if (answers.length === 0) return [];
    const uniqConcepts = pipe(
      map(answer => {
        return conceptQueryVars.map(entity => {
          const concept = answer.map().get(entity);
          if (!concept) return undefined; // If specific attributes are used for filtering, ordering, ...
          return { id: concept.id, data: { concept, entity } };
        });
      }),
      flatten,
      filter(e => e !== undefined),
      uniqWith((x, y) => x.id === y.id)
    )(answers);
    const fetchingConceptsPairs = map(x => [x.id, x.data], uniqConcepts);
    const relationsMap = new Map(fetchingConceptsPairs);
    // 02. Filter concepts to create a unique list
    const fetchingConcepts = filter(u => includes(u.data.entity, plainEntities), uniqConcepts);
    // 03. Query concepts and rebind the data
    const queryConcepts = map(item => {
      const { concept } = item.data;
      return loadConcept(concept, { relationsMap });
    }, fetchingConcepts);
    const resolvedConcepts = await Promise.all(queryConcepts);
    // 04. Create map from concepts
    const conceptCache = new Map(map(c => [c.grakn_id, c], resolvedConcepts));
    // 05. Bind all row to data entities
    const result = answers.map(answer => {
      const dataPerEntities = plainEntities.map(entity => {
        const concept = answer.map().get(entity);
        const conceptData = conceptCache.get(concept.id);
        return [entity, conceptData];
      });
      return fromPairs(dataPerEntities);
    });
    // 06. Filter every relation not in "openCTI path"
    // Grakn can respond with twice the relations (browse in 2 directions)
    return uniqBy(u => {
      return pipe(
        map(i => i.grakn_id),
        sort((a, b) => a.localeCompare(b))
      )(Object.values(u));
    }, result);
    // It's a special tricks for from/to relations
    // return fixReverseConceptRelations(uniqResult);
  });
};
/**
 * Query and get entities of the first row
 * @param query
 * @param entities
 * @param infer
 * @returns {Promise<any[] | never>}
 */
export const load = async (query, entities, { infer } = findOpts) => {
  const data = await find(query, entities, { infer });
  return head(data);
};

// Reindex functions
export const reindexByAttribute = async (type, value) => {
  const eType = escape(type);
  const eVal = escapeString(value);
  const readQuery = `match $x isa entity, has ${eType} $a; $a "${eVal}"; get;`;
  logger.debug(`[GRAKN - infer: false] attributeUpdate > ${readQuery}`);
  await find(readQuery, ['x']);
  // TODO JRI ADD REINDEX
};
export const reindexByQuery = async (query, entities) => {
  const data = await find(query, entities);
  // TODO JRI ADD REINDEX
  return data.length;
};

/**
 * Load any grakn instance with OpenCTI internal ID.
 * @param id element id to get
 * @returns {Promise}
 */
// ENTITIES
export const loadEntityById = async id => {
  // [ELASTIC] From cache
  const fromCache = await elLoadById(id);
  if (fromCache) return fromCache;
  // Standard Grakn
  const query = `match $x has internal_id_key "${escapeString(id)}"; get;`;
  const element = await load(query, ['x']);
  return element ? element.x : null;
};
export const loadEntityByStixId = async id => {
  // [ELASTIC] From cache
  const fromCache = await elLoadByStixId(id);
  if (fromCache) return fromCache;
  // Standard Grakn
  const query = `match $x has stix_id_key "${escapeString(id)}"; get;`;
  const element = await load(query, ['x']);
  return element ? element.x : null;
};
export const loadEntityByGraknId = async graknId => {
  // [ELASTIC] From cache
  const fromCache = await elLoadByGraknId(graknId);
  if (fromCache) return fromCache;
  // Standard Grakn
  const query = `match $x id ${escapeString(graknId)}; get;`;
  const element = await load(query, ['x']);
  return element.x;
};
// OBSERVABLES
export const loadObservableById = async id => {
  // [ELASTIC] From cache
  const fromCache = await elLoadById(id, [INDEX_STIX_OBSERVABLE]);
  if (fromCache) return fromCache;
  // Standard Grakn
  const query = `match $x has internal_id_key "${escapeString(id)}"; get;`;
  const element = await load(query, ['x']);
  return element ? element.x : null;
};
export const loadObservableByStixId = async id => {
  // [ELASTIC] From cache
  const fromCache = await elLoadByStixId(id, [INDEX_STIX_OBSERVABLE]);
  if (fromCache) return fromCache;
  // Standard Grakn
  const query = `match $x has stix_id_key "${escapeString(id)}"; get;`;
  const element = await load(query, ['x']);
  return element ? element.x : null;
};
// RELATIONS
export const loadRelationById = async id => {
  // [ELASTIC] From cache
  const fromCache = await elLoadById(id);
  if (fromCache) return fromCache;
  // Standard Grakn
  const eid = escapeString(id);
  const query = `match $rel($from, $to) isa relation; $rel has internal_id_key "${eid}"; get;`;
  const element = await load(query, ['rel']);
  return element ? element.rel : null;
};
export const loadRelationByStixId = async id => {
  // [ELASTIC] From cache
  const fromCache = await elLoadByStixId(id);
  if (fromCache) return fromCache;
  // Standard Grakn
  const eid = escapeString(id);
  const query = `match $rel($from, $to) isa relation; $rel has stix_id_key "${eid}"; get;`;
  const element = await load(query, ['rel']);
  return element ? element.rel : null;
};

/**
 * Get a single value from a Grakn query
 * @param query
 * @param infer
 * @returns {Promise<any[] | never>}
 */
export const getSingleValue = async (query, infer = false) => {
  return executeRead(async rTx => {
    logger.debug(`[GRAKN - infer: ${infer}] getSingleValue > ${query}`);
    logger.debug(`[GRAKN - infer: false] getById > ${query}`);
    const iterator = await rTx.tx.query(query, { infer });
    return iterator.next();
  });
};

export const getSingleValueNumber = async (query, infer = false) => {
  return getSingleValue(query, infer).then(data => data.number());
};

/**
 * Edit an attribute value.
 * @param id
 * @param input
 * @param wTx
 * @returns the complete instance
 */
export const updateAttribute = async (id, input, wTx) => {
  const { key, value } = input; // value can be multi valued
  // --- 00 Need update?
  const val = includes(key, multipleAttributes) ? value : head(value);
  const currentInstanceData = await loadEntityById(id);
  if (equals(currentInstanceData[key], val)) {
    return id;
  }
  // --- 01 Get the current attribute types
  const escapedKey = escape(key);
  const labelTypeQuery = `match $x type ${escapedKey}; get;`;
  const labelIterator = await wTx.tx.query(labelTypeQuery);
  const labelAnswer = await labelIterator.next();
  // eslint-disable-next-line prettier/prettier
  const attrType = await labelAnswer.map().get('x').dataType();
  const typedValues = map(v => {
    if (attrType === GraknString) return `"${escapeString(v)}"`;
    if (attrType === GraknDate) return prepareDate(v);
    return escape(v);
  }, value);
  // --- Delete the old attribute
  const entityId = `${escapeString(id)}`;
  const deleteQuery = `match $x has internal_id_key "${entityId}", has ${escapedKey} $del via $d; delete $d;`;
  // eslint-disable-next-line prettier/prettier
  logger.debug(`[GRAKN - infer: false] updateAttribute - delete > ${deleteQuery}`);
  await wTx.tx.query(deleteQuery);
  if (typedValues.length > 0) {
    let graknValues;
    if (typedValues.length === 1) {
      graknValues = `has ${escapedKey} ${head(typedValues)}`;
    } else {
      graknValues = `${join(
        ' ',
        map(gVal => `has ${escapedKey} ${gVal},`, tail(typedValues))
      )} has ${escapedKey} ${head(typedValues)}`;
    }
    const createQuery = `match $m has internal_id_key "${escapeString(id)}"; insert $m ${graknValues};`;
    logger.debug(`[GRAKN - infer: false] updateAttribute - insert > ${createQuery}`);
    await wTx.tx.query(createQuery);
  }
  // Adding dates elements
  if (includes(key, statsDateAttributes)) {
    const dayValue = dayFormat(head(value));
    const monthValue = monthFormat(head(value));
    const yearValue = yearFormat(head(value));
    const dayInput = { key: `${key}_day`, value: [dayValue] };
    await updateAttribute(id, dayInput, wTx);
    const monthInput = { key: `${key}_month`, value: [monthValue] };
    await updateAttribute(id, monthInput, wTx);
    const yearInput = { key: `${key}_year`, value: [yearValue] };
    await updateAttribute(id, yearInput, wTx);
  }
  // Update elasticsearch
  const currentIndex = inferIndexFromConceptTypes(currentInstanceData.parent_type);
  const updateValueField = { [key]: val };
  await elUpdate(currentIndex, currentInstanceData.grakn_id, { doc: updateValueField });
  return id;
};

export const deleteEntityById = async id => {
  // 00. Load everything we need to remove in elastic
  const eid = escapeString(id);
  const read = `match $x has internal_id_key "${eid}"; $y isa entity; $rel($x, $y); get;`;
  const relationsToDeIndex = await find(read, ['rel']);
  const relationsIds = map(r => r.rel.id, relationsToDeIndex);
  return executeWrite(async wTx => {
    const query = `match $x has internal_id_key "${eid}"; $z($x, $y); delete $z, $x;`;
    logger.debug(`[GRAKN - infer: false] deleteEntityById > ${query}`);
    await wTx.tx.query(query, { infer: false });
    await elDeleteInstanceIds(append(id, relationsIds));
    return id;
  });
};

export const deleteRelationById = async (entityId, relationId) => {
  const eid = escapeString(relationId);
  await executeWrite(async wTx => {
    const query = `match $x has internal_id_key "${eid}"; delete $x;`;
    logger.debug(`[GRAKN - infer: false] deleteRelationById > ${query}`);
    await wTx.tx.query(query, { infer: false });
    // Delete the inner indexed relations in entities
    const previousRelation = await loadEntityById(eid);
    const targetEntity = await loadEntityByGraknId(previousRelation.toId);
    // [ELASTIC] Update
    await elUpdateRemoveInnerRelation(entityId, previousRelation.relationship_type, targetEntity.id);
    await elUpdateRemoveInnerRelation(targetEntity.id, previousRelation.relationship_type, entityId);
    await elDeleteInstanceIds([eid]);
  });
  // Return the updated source
  return loadEntityById(entityId);
};

export const timeSeries = async (query, options) => {
  return executeRead(async rTx => {
    const { startDate, endDate, operation, field, interval, inferred = true } = options;
    const finalQuery = `${query}; $x has ${field}_${interval} $g; get; group $g; ${operation};`;
    logger.debug(`[GRAKN - infer: ${inferred}] timeSeries > ${finalQuery}`);
    const iterator = await rTx.tx.query(finalQuery, { infer: inferred });
    const answer = await iterator.collect();
    return Promise.all(
      answer.map(async n => {
        const date = await n.owner().value();
        const number = await n.answers()[0].number();
        return { date, value: number };
      })
    ).then(data => fillTimeSeries(startDate, endDate, interval, data));
  });
};

export const distribution = async (query, options) => {
  return executeRead(async rTx => {
    const { startDate, endDate, operation, field, inferred = false } = options;
    const finalQuery = `${query}; ${
      startDate && endDate
        ? `$rel has first_seen $fs; $fs > ${prepareDate(startDate)}; $fs < ${prepareDate(endDate)};`
        : ''
    } $x has ${field} $g; get; group $g; ${operation};`;
    logger.debug(`[GRAKN - infer: ${inferred}] distribution > ${finalQuery}`);
    const iterator = await rTx.tx.query(finalQuery, { infer: inferred });
    const answer = await iterator.collect();
    return Promise.all(
      answer.map(async n => {
        const label = await n.owner().value();
        const number = await n.answers()[0].number();
        return { label, value: number };
      })
    );
  });
};

/**
 * Grakn query that generate json objects for relations
 * @param query the query to process
 * @param key the instance key to get id from.
 * @param extraRelKey the key of the relation pointing the relation
 * @param infer (get inferred relationships)
 * @returns {Promise<any[] | never>}
 */
export const findWithConnectedRelations = async (query, key, extraRelKey = null, infer = false) => {
  const dataFind = await find(query, [key, extraRelKey], { infer });
  return map(t => ({ node: t[key], relation: t[extraRelKey] }), dataFind);
};

// If first specified in args, the result will be paginated
export const listEntities = async (searchFields, args) => {
  // filters contains potential relations like, mitigates, tagged ...
  const { first = 200, after, types, search, filters, orderBy, orderMode = 'asc' } = args;
  // const listWithPagination = 'first' in args;
  // const first = listWithPagination ? args.first || 200 : undefined;
  const offset = after ? cursorToOffset(after) : 0;
  const queryOrderBy = orderBy || 'internal_id_key';
  const isRelationOrderBy = includes('.', queryOrderBy);
  // 01. Define if Elastic can support this query.
  let supportedByCache = true;
  // 01-1 Check the ordering
  if (isRelationOrderBy) {
    const [, field] = queryOrderBy.split('.');
    if (field !== 'internal_id_key') supportedByCache = false;
  }
  // 01-2 Check the filters
  const relationFilters = filters
    ? filter(k => {
        const isRelationFilter = includes('.', k.key);
        if (isRelationFilter) {
          const [, field] = queryOrderBy.split('.');
          if (field !== 'internal_id_key') return false;
        }
        return true;
      }, filters)
    : [];
  supportedByCache = supportedByCache && relationFilters.length === 0;
  // 02. If not go with standard Grakn
  const relationsFields = [];
  const attributesFields = [];
  const attributesFilters = [];
  // Handle order by field
  if (isRelationOrderBy) {
    const [relation, field] = queryOrderBy.split('.');
    relationsFields.push(`($elem, $${relation}) isa ${relation}; $${relation} has ${field} $order;`);
  } else {
    attributesFields.push(`$elem has ${queryOrderBy} $order;`);
  }
  // Handle filters
  const relationFiltersIds = [];
  if (filters && filters.length > 0) {
    for (let index = 0; index < filters.length; index += 1) {
      const filterKey = filters[index].key;
      const filterValues = filters[index].values;
      const isRelationFilter = includes('.', filterKey);
      // TODO Support more than only String filters
      if (isRelationFilter) {
        const [relation, field] = filterKey.split('.');
        const relId = `rel${relation}`;
        relationsFields.push(`$${relId} ($elem, $${relation}) isa ${relation};`);
        for (let valueIndex = 0; valueIndex < filterValues.length; valueIndex += 1) {
          const val = filterValues[valueIndex];
          attributesFields.push(`$${relation} has ${field} "${val}";`);
          relationFiltersIds.push({ id: relId, key: `${filterKey}.${val}` });
        }
      } else {
        for (let valueIndex = 0; valueIndex < filterValues.length; valueIndex += 1) {
          const val = filterValues[valueIndex];
          attributesFields.push(`$elem has ${filterKey} "${val}";`);
        }
      }
    }
  }
  // Handle special case of search
  if (search) {
    for (let searchIndex = 0; searchIndex < searchFields.length; searchIndex += 1) {
      const searchFieldName = searchFields[searchIndex];
      attributesFields.push(`$elem has ${searchFieldName} $${searchFieldName};`);
    }
    const searchFilter = pipe(
      map(e => `{ $${e} contains "${escapeString(search)}"; }`),
      join(' or ')
    )(searchFields);
    attributesFilters.push(`${searchFilter};`);
  }
  // build the final query
  const queryAttributesFields = join(' ', attributesFields);
  const queryAttributesFilters = join(' ', attributesFilters);
  const queryRelationsFields = join(' ', relationsFields);
  const headType = types.length === 1 ? head(types) : 'entity';
  const extraTypes =
    types.length > 1
      ? pipe(
          map(e => `{ $elem isa ${e}; }`),
          join(' or '),
          concat(__, ';')
        )(types)
      : '';
  const baseQuery = `match $elem isa ${headType}; ${extraTypes} ${queryRelationsFields} 
                      ${queryAttributesFields} ${queryAttributesFilters} get;`;
  const countQuery = `${baseQuery} count;`;
  const paginateQuery = `offset ${offset}; limit ${first};`;
  const query = `${baseQuery} sort $order ${orderMode}; ${paginateQuery}`;
  // In case of only one relation filters, we can specify the relation extra key
  if (relationFiltersIds.length > 1) {
    logger.warn('[GRAKN] List entities through multiple relations, selecting first one...');
  }
  const relationToGet = head(relationFiltersIds);
  // [ELASTIC] From cache
  if (supportedByCache) {
    console.log('LIST FETCH FROM ELASTIC');
    const paginateResult = await elPaginate(INDEX_STIX_ENTITIES, args);
    if (relationToGet) {
      // A relation is require, reconstruct the result with it.
      const test = {
        pageInfo: paginateResult.pageInfo,
        edges: map(
          e => ({
            node: e.node,
            relation: { id: e.node[relationToGet.key] },
            cursor: e.cursor
          }),
          paginateResult.edges
        )
      };
      // return test;
    }
    // return paginateResult;
  }
  console.log('LIST FETCH FROM GRAKN');
  // noinspection ES6MissingAwait
  const countPromise = getSingleValueNumber(countQuery);
  const extraRelation = relationToGet ? relationToGet.id : undefined;
  const instancesPromise = await findWithConnectedRelations(query, 'elem', extraRelation);
  return Promise.all([instancesPromise, countPromise]).then(([instances, globalCount]) => {
    return buildPagination(first, offset, instances, globalCount);
  });
};

/**
 * Grakn query that generate a json object for GraphQL
 * @param query the query to process
 * @param key the instance key to get id from.
 * @param relationKey the key to bind relation result.
 * @param infer
 * @returns {Promise<any[] | never>}
 */
export const loadWithConnectedRelations = (query, key, relationKey = null, infer = false) => {
  return findWithConnectedRelations(query, key, relationKey, infer).then(result => head(result));
};
// endregion

// region please refactor to use stable commands
/**
 * Load any grakn relation with base64 id containing the query pattern.
 * @param id
 * @returns {Promise}
 */
export const getRelationInferredById = async id => {
  return executeRead(async rTx => {
    const decodedQuery = Buffer.from(id, 'base64').toString('ascii');
    const query = `match ${decodedQuery} get;`;
    const queryRegex = /\$([a-z_\d]+)\s?[([a-z_]+:\s\$(\w+),\s[a-z_]+:\s\$(\w+)\)\s[a-z_]+\s([\w-]+);/i.exec(query);
    if (queryRegex === null) return {};
    const relKey = queryRegex[1];
    logger.debug(`[GRAKN - infer: true] getRelationInferredById > ${query}`);
    const answerIterator = await rTx.tx.query(query);
    const answer = await answerIterator.next();
    const rel = answer.map().get(relKey);
    const relationType = await rel.type();
    const relationTypeValue = await relationType.label();
    const rolePlayersMap = await rel.rolePlayersMap();
    const roles = rolePlayersMap.keys();
    const fromRole = roles.next().value;
    // eslint-disable-next-line prettier/prettier
    const fromObject = rolePlayersMap.get(fromRole).values().next().value;
    const fromRoleLabel = await fromRole.label();
    const toRole = roles.next().value;
    // eslint-disable-next-line prettier/prettier
    const toObject = rolePlayersMap.get(toRole).values().next().value;
    const toRoleLabel = await toRole.label();
    const relation = {
      id,
      entity_type: TYPE_STIX_RELATION,
      relationship_type: relationTypeValue,
      inferred: true
    };
    const fromPromise = loadConcept(fromObject);
    const toPromise = loadConcept(toObject);
    const explanation = answer.explanation();
    const explanationAnswers = explanation.answers();
    const inferences = explanationAnswers.map(explanationAnswer => {
      const explanationAnswerExplanation = explanationAnswer.explanation();
      let inferenceQuery = explanationAnswerExplanation.queryPattern();
      const inferenceQueryRegex = /(\$(\d+|rel)\s)?\([a-z_]+:\s\$(\w+),\s[a-z_]+:\s\$(\w+)\)\sisa\s([\w-]+);/i.exec(
        inferenceQuery
      );
      let relationKey;
      const [, , inferReferenceRelationKey] = inferenceQueryRegex;
      if (inferReferenceRelationKey !== undefined) {
        relationKey = inferReferenceRelationKey;
      } else {
        relationKey = randomKey(5);
        inferenceQuery = inferenceQuery.replace('(', `$${relationKey} (`);
      }
      return {
        inferenceQuery,
        relationKey,
        fromKey: inferenceQueryRegex[3],
        toKey: inferenceQueryRegex[4],
        relationType: inferenceQueryRegex[5]
      };
    });
    const inferencesQueries = pluck('inferenceQuery', inferences);
    const inferencesQuery = `match {${join(' ', inferencesQueries)} }; get;`;
    logger.debug(`[GRAKN - infer: true] getRelationInferredById - getInferences > ${inferencesQuery}`);
    const inferencesAnswerIterator = await rTx.tx.query(inferencesQuery);
    const inferencesAnswer = await inferencesAnswerIterator.next();
    const inferencesPromises = Promise.all(
      inferences.map(async inference => {
        const inferred = await inferencesAnswer
          .map()
          .get(inference.relationKey)
          .isInferred();
        const inferenceFrom = inferencesAnswer.map().get(inference.fromKey);
        const inferenceTo = inferencesAnswer.map().get(inference.toKey);
        let inferenceId;
        if (inferred) {
          const inferenceQueryRegex = /\$([a-z_\d]+)\s\([a-z_:]+\s\$([a-z_]+),\s[a-z_:]+\s\$([a-z_]+)\)/i.exec(
            inference.inferenceQuery
          );
          const entityFromKey = inferenceQueryRegex[2];
          const entityToKey = inferenceQueryRegex[3];
          const regexFromString = `\\$${entityFromKey}\\sid\\s(V\\d+);`;
          const regexFrom = new RegExp(regexFromString, 'i');
          const inferenceQueryRegexFrom = inference.inferenceQuery.match(regexFrom);
          const regexToString = `\\$${entityToKey}\\sid\\s(V\\d+);`;
          const regexTo = new RegExp(regexToString, 'i');
          const inferenceQueryRegexTo = inference.inferenceQuery.match(regexTo);

          const regexFromTypeString = `\\$${entityFromKey}\\sisa\\s[\\w-_]+;`;
          const regexFromType = new RegExp(regexFromTypeString, 'ig');
          const regexToTypeString = `\\$${entityToKey}\\sisa\\s[\\w-_]+;`;
          const regexToType = new RegExp(regexToTypeString, 'ig');

          let extractedInferenceQuery;
          if (inferenceQueryRegexFrom && inferenceQueryRegexTo) {
            extractedInferenceQuery = inference.inferenceQuery;
          } else if (inferenceQueryRegexFrom) {
            const existingId = inferenceQueryRegexFrom[1];
            extractedInferenceQuery = inference.inferenceQuery.replace(
              `$${entityFromKey} id ${existingId};`,
              `$${entityFromKey} id ${existingId}; $${entityToKey} id ${
                existingId === inferenceFrom.id ? inferenceTo.id : inferenceFrom.id
              };`
            );
          } else if (inferenceQueryRegexTo) {
            const existingId = inferenceQueryRegexTo[1];
            extractedInferenceQuery = inference.inferenceQuery.replace(
              `$${entityToKey} id ${existingId};`,
              `$${entityToKey} id ${existingId}; $${entityFromKey} id ${
                existingId === inferenceFrom.id ? inferenceTo.id : inferenceFrom.id
              };`
            );
          } else {
            extractedInferenceQuery = inference.inferenceQuery;
          }
          const finalInferenceQuery = extractedInferenceQuery.replace(regexFromType, '').replace(regexToType, '');
          inferenceId = Buffer.from(finalInferenceQuery).toString('base64');
        } else {
          const inferenceAttributes = await loadConcept(inferencesAnswer.map().get(inference.relationKey));
          inferenceId = inferenceAttributes.internal_id_key;
        }
        const fromAttributes = await loadConcept(inferenceFrom);
        const toAttributes = await loadConcept(inferenceTo);
        return {
          node: {
            id: inferenceId,
            inferred,
            relationship_type: inference.relationType,
            from: fromAttributes,
            to: toAttributes
          }
        };
      })
    );
    return Promise.all([fromPromise, toPromise, inferencesPromises]).then(
      ([fromResult, toResult, relationInferences]) => {
        if (isInversed(relation.relationship_type, fromRoleLabel)) {
          return pipe(
            assoc('from', toResult),
            assoc('fromRole', toRoleLabel),
            assoc('to', fromResult),
            assoc('toRole', fromRoleLabel),
            assoc('inferences', { edges: relationInferences })
          )(relation);
        }
        return pipe(
          assoc('from', fromResult),
          assoc('fromRole', fromRoleLabel),
          assoc('to', toResult),
          assoc('toRole', toRoleLabel),
          assoc('inferences', { edges: relationInferences })
        )(relation);
      }
    );
  });
};

/**
 * Grakn generic pagination query.
 * @param query
 * @param options
 * @param ordered
 * @param relationOrderingKey
 * @param infer
 * @param computeCount
 * @returns {Promise<any[] | never>}
 */
// eslint-disable-next-line prettier/prettier
export const paginate = (query, options, ordered = true, relationOrderingKey = null, infer = false, computeCount = true) => {
  try {
    const { first = 200, after, orderBy = null, orderMode = 'asc' } = options;
    const offset = after ? cursorToOffset(after) : 0;
    const instanceKey = /match\s(?:\$|{\s\$)(\w+)[\s]/i.exec(query)[1]; // We need to resolve the key instance used in query.
    const findRelationVariable = /\$(\w+)\((\w+):\$(\w+),[\s\w:$]+\)/i.exec(query);
    const relationKey = findRelationVariable && findRelationVariable[1]; // Could be setup to get relation info
    const orderingKey = relationOrderingKey
      ? `$${relationOrderingKey} has ${orderBy} $o;`
      : `$${instanceKey} has ${orderBy} $o;`;

    let count = first;
    if (computeCount === true) {
      count = getSingleValueNumber(`${query}; ${ordered && orderBy ? orderingKey : ''} get; count;`, infer);
    }
    const elements = findWithConnectedRelations(
      `${query}; ${ordered && orderBy ? orderingKey : ''} get; ${
        ordered && orderBy ? `sort $o ${orderMode};` : ''
      } offset ${offset}; limit ${first};`,
      instanceKey,
      relationKey,
      infer
    );
    return Promise.all([count, elements]).then(data => {
      const globalCount = data ? head(data) : 0;
      const instances = data ? last(data) : [];
      return buildPagination(first, offset, instances, globalCount);
    });
  } catch (err) {
    logger.error('[GRAKN] elPaginate error > ', err);
    return Promise.resolve(null);
  }
};

/**
 * Grakn generic pagination query
 * @param query
 * @param options
 * @param extraRel
 * @param pagination
 * @returns Promise
 */
// eslint-disable-next-line prettier/prettier
export const paginateRelationships = (query, options, extraRel = null, pagination = true) => {
  try {
    const {
      fromId,
      toId,
      fromTypes,
      toTypes,
      firstSeenStart,
      firstSeenStop,
      lastSeenStart,
      lastSeenStop,
      weights,
      inferred,
      first = 200,
      after,
      orderBy,
      orderMode = 'asc'
    } = options;
    const offset = after ? cursorToOffset(after) : 0;
    const finalQuery = `
  ${query};
  ${fromId ? `$from has internal_id_key "${escapeString(fromId)}";` : ''}
  ${toId ? `$to has internal_id_key "${escapeString(toId)}";` : ''} ${
      fromTypes && fromTypes.length > 0
        ? `${join(' ', map(fromType => `{ $from isa ${fromType}; } or`, tail(fromTypes)))} { $from isa ${head(
            fromTypes
          )}; };`
        : ''
    } ${
      toTypes && toTypes.length > 0
        ? `${join(' ', map(toType => `{ $to isa ${toType}; } or`, tail(toTypes)))} { $to isa ${head(toTypes)}; };`
        : ''
    } 
    ${firstSeenStart || firstSeenStop ? `$rel has first_seen $fs; ` : ''} 
    ${firstSeenStart ? `$fs > ${prepareDate(firstSeenStart)}; ` : ''} 
    ${firstSeenStop ? `$fs < ${prepareDate(firstSeenStop)}; ` : ''} 
    ${lastSeenStart || lastSeenStop ? `$rel has last_seen $ls; ` : ''} 
    ${lastSeenStart ? `$ls > ${prepareDate(lastSeenStart)}; ` : ''} 
    ${lastSeenStop ? `$ls < ${prepareDate(lastSeenStop)}; ` : ''} 
    ${
      weights
        ? `$rel has weight $weight; ${join(
            ' ',
            map(weight => `{ $weight == ${weight}; } or`, tail(weights))
          )} { $weight == ${head(weights)}; };`
        : ''
    }`;
    const orderingKey = orderBy ? `$rel has ${orderBy} $o;` : '';
    const count = getSingleValueNumber(
      `${finalQuery} ${orderingKey} get $rel, $from, $to ${extraRel ? `, $${extraRel}` : ''}${
        orderBy ? ', $o' : ''
      }; count;`,
      inferred
    );
    const elements = findWithConnectedRelations(
      `${finalQuery} ${orderingKey} get $rel, $from, $to${extraRel ? `, $${extraRel}` : ''}${orderBy ? ', $o' : ''}; ${
        orderBy ? `sort $o ${orderMode};` : ''
      } offset ${offset}; limit ${first};`,
      'rel',
      extraRel,
      inferred
    );
    if (pagination) {
      return Promise.all([count, elements]).then(data => {
        const globalCount = data ? head(data) : 0;
        const instances = data ? last(data) : [];
        return buildPagination(first, offset, instances, globalCount);
      });
    }
    return Promise.all([count, elements]).then(data => {
      const globalCount = data ? head(data) : 0;
      const instances = data ? last(data) : [];
      return { globalCount, instances };
    });
  } catch (err) {
    logger.error('[GRAKN] paginateRelationships error > ', err);
    return null;
  }
};
// endregion

const prepareAttribute = value => {
  if (value instanceof Date) return prepareDate(value);
  if (Date.parse(value) > 0 && new Date(value).toISOString() === value) return prepareDate(value);
  if (typeof value === 'string') return `"${escapeString(value)}"`;
  return escape(value);
};

const flatAttributesForObject = data => {
  const elements = Object.entries(data);
  return pipe(
    map(elem => {
      const key = head(elem);
      const value = last(elem);
      if (Array.isArray(value)) {
        return map(iter => ({ key, value: iter }), value);
      }
      // Some dates needs to detailed for search
      if (value && includes(key, statsDateAttributes)) {
        return [
          { key, value },
          { key: `${key}_day`, value: dayFormat(value) },
          { key: `${key}_month`, value: monthFormat(value) },
          { key: `${key}_year`, value: yearFormat(value) }
        ];
      }
      return { key, value };
    }),
    flatten,
    filter(f => f.value !== undefined)
  )(elements);
};

const createRelationRaw = async (fromInternalId, input) => {
  const relationId = uuid();
  // 01. First fix the direction of the relation
  const isStixRelation = includes('stix_id_key', Object.keys(input)) || input.relationship_type;
  const relationshipType = input.relationship_type || input.through;
  const entityType = isStixRelation ? TYPE_STIX_RELATION : TYPE_RELATION_EMBEDDED;
  const isInv = isInversed(relationshipType, input.fromRole);
  if (isInv) logger.warn('[GRAKN] You try to create a relation in incorrect order, reversing...', input);
  const data = pipe(
    assoc('fromId', isInv ? input.toId : fromInternalId),
    assoc('fromRole', isInv ? input.toRole : input.fromRole),
    assoc('toId', isInv ? fromInternalId : input.toId),
    assoc('toRole', isInv ? input.fromRole : input.toRole)
  )(input);
  // 02. Prepare the data to create or index
  const relationAttributes = { internal_id_key: relationId };
  if (isStixRelation) {
    const currentDate = now();
    const toCreate = data.stix_id_key === undefined || data.stix_id_key === 'create';
    relationAttributes.stix_id_key = toCreate ? `relationship--${uuid()}` : data.stix_id_key;
    relationAttributes.revoked = false;
    relationAttributes.name = data.name;
    relationAttributes.description = data.description;
    relationAttributes.role_played = data.role_played ? data.role_played : 'Unknown';
    relationAttributes.score = data.score ? data.score : 50;
    relationAttributes.weight = data.weight;
    relationAttributes.expiration = data.expiration;
    relationAttributes.entity_type = entityType;
    relationAttributes.relationship_type = relationshipType;
    relationAttributes.updated_at = currentDate;
    relationAttributes.created = input.created;
    relationAttributes.modified = input.modified;
    relationAttributes.created_at = currentDate;
    relationAttributes.first_seen = input.first_seen;
    relationAttributes.last_seen = input.last_seen;
    relationAttributes.expiration = input.expiration;
  }
  // 02. Create the relation
  const graknRelation = await executeWrite(async wTx => {
    let query = `match $from has internal_id_key "${data.fromId}";
      $to has internal_id_key "${data.toId}";
      insert $rel(${data.fromRole}: $from, ${data.toRole}: $to) isa ${relationshipType},`;
    const queryElements = flatAttributesForObject(relationAttributes);
    const nbElements = queryElements.length;
    for (let index = 0; index < nbElements; index += 1) {
      const { key, value } = queryElements[index];
      const insert = prepareAttribute(value);
      const separator = index + 1 === nbElements ? ';' : ',';
      query += `has ${key} ${insert}${separator} `;
    }
    logger.debug(`[GRAKN - infer: false] createRelation > ${query}`);
    const iterator = await wTx.tx.query(query);
    const txRelation = await iterator.next();
    const graknRelationId = txRelation.map().get('rel').id;
    const graknFromId = txRelation.map().get('from').id;
    const graknToId = txRelation.map().get('to').id;
    return { graknRelationId, graknFromId, graknToId };
  });
  // 03. Prepare the final data with grakn IDS
  const createdRelation = pipe(
    assoc('id', relationId),
    // Grakn identifiers
    assoc('grakn_id', graknRelation.graknRelationId),
    assoc('fromId', graknRelation.graknFromId),
    assoc('toId', graknRelation.graknToId),
    // Relation specific
    assoc('inferred', false),
    // Types
    assoc('entity_type', entityType),
    assoc('relationship_type', relationshipType),
    assoc('parent_type', relationshipType)
  )(relationAttributes);
  // 04. Index the relation and the modification in the base entity
  await elIndex(inferIndexFromConceptTypes([entityType]), createdRelation);
  await elUpdateAddInnerRelation(data.fromId, relationshipType, data.toId, relationId);
  await elUpdateAddInnerRelation(data.toId, relationshipType, data.fromId, relationId);
  // 06. Return result
  return createdRelation;
};

// region business relations
const addOwner = async (fromInternalId, createdByOwnerId) => {
  if (!createdByOwnerId) return undefined;
  const input = { fromRole: 'to', toId: createdByOwnerId, toRole: 'owner', through: 'owned_by' };
  return createRelationRaw(fromInternalId, input);
};
const addCreatedByRef = async (fromInternalId, createdByRefId) => {
  if (!createdByRefId) return undefined;
  const input = { fromRole: 'so', toId: createdByRefId, toRole: 'creator', through: 'created_by_ref' };
  return createRelationRaw(fromInternalId, input);
};
const addMarkingDef = async (fromInternalId, markingDefId) => {
  if (!markingDefId) return undefined;
  const input = { fromRole: 'so', toId: markingDefId, toRole: 'marking', through: 'object_marking_refs' };
  return createRelationRaw(fromInternalId, input);
};
const addMarkingDefs = async (internalId, markingDefIds) => {
  if (!markingDefIds || isEmpty(markingDefIds)) return undefined;
  const markings = [];
  // Relations cannot be created in parallel.
  for (let i = 0; i < markingDefIds.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const marking = await addMarkingDef(internalId, markingDefIds[i]);
    markings.push(marking);
  }
  return markings;
};
const addKillChain = async (fromInternalId, killChainId) => {
  if (!killChainId) return undefined;
  const input = {
    fromRole: 'phase_belonging',
    toId: killChainId,
    toRole: 'kill_chain_phase',
    through: 'kill_chain_phases'
  };
  return createRelationRaw(fromInternalId, input);
};
const addKillChains = async (internalId, killChainIds) => {
  if (!killChainIds || isEmpty(killChainIds)) return undefined;
  const killChains = [];
  // Relations cannot be created in parallel.
  for (let i = 0; i < killChainIds.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const killChain = await addKillChain(internalId, killChainIds[i]);
    killChains.push(killChain);
  }
  return killChains;
};
// endregion

export const createRelation = async (fromInternalId, input) => {
  const created = await createRelationRaw(fromInternalId, input);
  // 05. Complete with eventual relations (will eventually update the index)
  await addOwner(created.id, input.createdByOwner);
  await addCreatedByRef(created.id, input.createdByRef);
  await addMarkingDefs(created.id, input.markingDefinitions);
  await addKillChains(created.id, input.killChainPhases);
  return created;
};

export const createRelations = async (fromInternalId, inputs, stixRelation = false) => {
  const createdRelations = [];
  // Relations cannot be created in parallel. (Concurrent indexing on same key)
  // Could be improve by grouping and indexing in one shot.
  for (let i = 0; i < inputs.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const relation = await createRelation(fromInternalId, inputs[i], stixRelation);
    createdRelations.push(relation);
  }
  return createdRelations;
};

export const createEntity = async (entity, innerType, modelType = TYPE_STIX_DOMAIN_ENTITY, stixIdType = undefined) => {
  const internalId = entity.internal_id_key ? escapeString(entity.internal_id_key) : uuid();
  const stixType = stixIdType || innerType.toLowerCase();
  const stixId = entity.stix_id_key ? escapeString(entity.stix_id_key) : `${stixType}--${uuid()}`;
  // Complete with identifiers
  let data = pipe(
    assoc('internal_id_key', internalId),
    assoc('entity_type', innerType.toLowerCase()),
    dissoc('createdByOwner'),
    dissoc('createdByRef'),
    dissoc('markingDefinitions'),
    dissoc('killChainPhases')
  )(entity);
  // Complete with dates if needed
  const today = now();
  // For stix domain entity, force the initialization of the alias list.
  if (modelType === TYPE_STIX_DOMAIN_ENTITY) {
    data = pipe(assoc('alias', data.alias ? data.alias : ['']))(data);
  }
  // For stix domain, initialize the stix key and the default dates.
  if (modelType === TYPE_STIX_DOMAIN || modelType === TYPE_STIX_DOMAIN_ENTITY) {
    data = pipe(
      assoc('stix_id_key', stixId),
      assoc('created', entity.created ? entity.created : today),
      assoc('modified', entity.modified ? entity.modified : today),
      assoc('created_at', today),
      assoc('updated_at', today),
      assoc('revoked', false)
    )(data);
  } else {
    // TYPE_STIX_OBSERVABLE or TYPE_OPENCTI_INTERNAL
    data = pipe(
      assoc('created_at', today),
      assoc('updated_at', today)
    )(data);
  }
  // Generate fields for query and build the query
  const queryElements = flatAttributesForObject(data);
  const nbElements = queryElements.length;
  let query = `insert $entity isa ${innerType}, `;
  for (let index = 0; index < nbElements; index += 1) {
    const { key, value } = queryElements[index];
    const insert = prepareAttribute(value);
    const separator = index + 1 === nbElements ? ';' : ',';
    query += `has ${key} ${insert}${separator} `;
  }
  const entityCreatedId = await executeWrite(async wTx => {
    const iterator = await wTx.tx.query(query);
    const txEntity = await iterator.next();
    return txEntity.map().get('entity').id;
  });
  // Transaction succeed, complete the result to send it back
  const completedData = pipe(
    assoc('id', internalId),
    // Grakn identifiers
    assoc('grakn_id', entityCreatedId),
    // Types (entity type directly saved)
    assoc('parent_type', modelType)
  )(data);
  // Transaction succeed, index the result
  await elIndex(inferIndexFromConceptTypes([modelType]), completedData);
  // Complete with eventual relations (will eventually update the index)
  await addOwner(internalId.id, entity.createdByOwner);
  await addCreatedByRef(internalId, entity.createdByRef);
  await addMarkingDefs(internalId, entity.markingDefinitions);
  await addKillChains(internalId, entity.killChainPhases);
  // Else simply return the data
  return completedData;
};
