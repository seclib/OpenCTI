import { UserInputError } from 'apollo-server-express';
<<<<<<< HEAD
import {
  validateEnumValue,
  compareValues,
  filterValues,
  updateQuery,
  checkIfValidUUID,
  CyioError,
} from '../../utils.js';
=======
import { compareValues, filterValues, updateQuery, checkIfValidUUID, validateEnumValue, CyioError } from '../../utils.js';
>>>>>>> origin/develop
import conf from '../../../../config/conf';
import {
  getReducer,
  dataSourcePredicateMap,
  singularizeSchema,
  deleteDataSourceQuery,
  // deleteDataSourceByIriQuery,
  // deleteMultipleDataSourcesQuery,
  insertDataSourceQuery,
  selectAllDataSourcesQuery,
  selectDataSourceQuery,
  // selectDataSourceByIriQuery,
  deleteFrequencyTimingQuery,
  deleteFrequencyTimingByIriQuery,
  attachToDataSourceQuery,
  detachFromDataSourceQuery,
  insertFrequencyTimingQuery,
  selectFrequencyTimingByIriQuery,
} from '../schema/sparql/dataSource.js';
import {
  deleteConnectionInformationQuery,
  deleteConnectionInformationByIriQuery,
  insertConnectionInformationQuery,
  // selectConnectionInformationByIriQuery,
} from '../schema/sparql/connectionInformation.js';
<<<<<<< HEAD
import { selectDataMarkingByIriQuery } from '../../data-markings/schema/sparql/dataMarkings.js';
=======
import { selectObjectIriByIdQuery } from '../../global/global-utils.js';

>>>>>>> origin/develop

export const findDataSourceById = async (id, dbName, dataSources, selectMap) => {
  // ensure the id is a valid UUID
  if (!checkIfValidUUID(id)) throw new CyioError(`Invalid identifier: ${id}`);

  const sparqlQuery = selectDataSourceQuery(id, selectMap.getNode('dataSource'));
  let response;
  try {
    response = await dataSources.Stardog.queryById({
      dbName: 'cyio-config',
      sparqlQuery,
      queryId: 'Select Data Source',
      singularizeSchema,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  if (response === undefined) return null;
  if (typeof response === 'object' && 'body' in response) {
    throw new UserInputError(response.statusText, {
      error_details: response.body.message ? response.body.message : response.body,
      error_code: response.body.code ? response.body.code : 'N/A',
    });
  }

  // TODO: WORKAROUND - until the trig can be fixed and reload, make lowercase
  if (response[0].status) response[0].status = response[0].status.toLowerCase();
  // END WORKAROUND

  if (Array.isArray(response) && response.length > 0) {
    const reducer = getReducer('DATA-SOURCE');
    return reducer(response[0]);
  }
};

export const findAllDataSources = async (args, dbName, dataSources, selectMap) => {
  const sparqlQuery = selectAllDataSourcesQuery(selectMap.getNode('node'), args);
  const configDB = conf.get('app:config:db_name') || 'cyio-config';
  let response;
  try {
    response = await dataSources.Stardog.queryAll({
      dbName: 'cyio-config',
      sparqlQuery,
      queryId: 'Select List of Data Sources',
      singularizeSchema,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  // no results found
  if (response === undefined || response.length === 0) return null;

  // Handle reporting Stardog Error
  if (typeof response === 'object' && 'body' in response) {
    throw new UserInputError(response.statusText, {
      error_details: response.body.message ? response.body.message : response.body,
      error_code: response.body.code ? response.body.code : 'N/A',
    });
  }

  // if no matching results, then return null
  if (Array.isArray(response) && response.length < 1) return null;

  const edges = [];
  const reducer = getReducer('DATA-SOURCE');
  const skipCount = 0;
  let filterCount = 0;
  let resultCount = 0;
  let limit;
  let offset;
  let limitSize;
  let offsetSize;
  limitSize = limit = args.first === undefined ? response.length : args.first;
  offsetSize = offset = args.offset === undefined ? 0 : args.offset;

  let resultList;
  if (args.orderedBy !== undefined) {
    resultList = response.sort(compareValues(args.orderedBy, args.orderMode));
  } else {
    resultList = response;
  }

  // return null if offset value beyond number of results items
  if (offset > resultList.length) return null;

  // for each result in the result set
  for (const resultItem of resultList) {
    // skip down past the offset
    if (offset) {
      offset--;
      continue;
    }

    // TODO: WORKAROUND - until the trig can be fixed and reload, make lowercase
    if (resultItem.status) resultItem.status = resultItem.status.toLowerCase();
    // END WORKAROUND

    // filter out non-matching entries if a filter is to be applied
    if ('filters' in args && args.filters != null && args.filters.length > 0) {
      if (!filterValues(resultItem, args.filters, args.filterMode)) {
        continue;
      }
      filterCount++;
    }

    // if haven't reached limit to be returned
    if (limit) {
      const edge = {
        cursor: resultItem.iri,
        node: reducer(resultItem),
      };
      edges.push(edge);
      limit--;
      if (limit === 0) break;
    }
  }
  // check if there is data to be returned
  if (edges.length === 0) return null;
  let hasNextPage = false;
  let hasPreviousPage = false;
  resultCount = resultList.length - skipCount;
  if (edges.length < resultCount) {
    if (edges.length === limitSize && filterCount <= limitSize) {
      hasNextPage = true;
      if (offsetSize > 0) hasPreviousPage = true;
    }
    if (edges.length <= limitSize) {
      if (filterCount !== edges.length) hasNextPage = true;
      if (filterCount > 0 && offsetSize > 0) hasPreviousPage = true;
    }
  }
  return {
    pageInfo: {
      startCursor: edges[0].cursor,
      endCursor: edges[edges.length - 1].cursor,
      hasNextPage,
      hasPreviousPage,
      globalCount: resultCount,
    },
    edges,
  };
};

export const createDataSource = async (input, dbName, selectMap, dataSources) => {
  // TODO: WORKAROUND to remove input fields with null or empty values so creation will work
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(input[key]) && input[key].length === 0) {
      delete input[key];
      continue;
    }
    if (value === null || value.length === 0) {
      delete input[key];
    }
  }
  // END WORKAROUND

<<<<<<< HEAD
  let frequency;
  const frequencyProps = {};
  if (input.update_frequency !== undefined) {
    frequency = input.update_frequency;
    for (const [key, value] of Object.entries(input.update_frequency)) frequencyProps[key] = value;
    delete input.update_frequency;
  }

  let connection;
  const connectionProps = {};
  if (input.connection_information !== undefined) {
    connection = input.connection_information;
    for (const [key, value] of Object.entries(input.connection_information)) connectionProps[key] = value;
=======
  let frequencyProps = {};
  if (input.update_frequency !== undefined) {
    for (let [key, value] of Object.entries(input.update_frequency)) frequencyProps[key] = value;
    delete input.update_frequency;
  }

  let connectionProps = {};
  if (input.connection_information !== undefined) {
    for (let [key, value] of Object.entries(input.connection_information)) connectionProps[key] = value;
>>>>>>> origin/develop
    delete input.connection_information;
  }

  if (input.iep !== undefined) {
<<<<<<< HEAD
    const query = selectObjectIriByIdQuery(input.id, 'data-marking');
    const result = await dataSources.Stardog.queryById({
=======
    let query = selectObjectIriByIdQuery( input.iep, 'marking-definition');
    let result = await dataSources.Stardog.queryById({
>>>>>>> origin/develop
      dbName: 'cyio-config',
      sparqlQuery: query,
      queryId: 'Obtaining IRI for Data Marking object with id',
      singularizeSchema,
    });
    if (result === undefined || result.length === 0) throw new CyioError(`Entity does not exist with ID ${input.iep}`);
    input.iep = `<${result[0].iri}>`;
  }

  // create the Data Source
  let response;
<<<<<<< HEAD
  const { iri, id: dataSourceId, query } = insertDataSourceQuery(input);
=======
  let {iri, id: dataSourceId, query} = insertDataSourceQuery(input);
>>>>>>> origin/develop
  try {
    response = await dataSources.Stardog.create({
      dbName: 'cyio-config',
      sparqlQuery: query,
<<<<<<< HEAD
      queryId: 'Create Note',
    });
=======
      queryId: "Create Data Source"
      });
>>>>>>> origin/develop
  } catch (e) {
    console.log(e);
    throw e;
  }

<<<<<<< HEAD
  if (frequencyProps !== undefined) {
    const { iri, id, query } = insertFrequencyTimingQuery(frequencyProps);
=======
  if (Object.keys(frequencyProps).length !== 0 ) {
    let {iri, id, query} = insertFrequencyTimingQuery(frequencyProps);
>>>>>>> origin/develop
    try {
      // Create Frequency Timing
      response = await dataSources.Stardog.create({
        dbName: 'cyio-config',
        sparqlQuery: query,
        queryId: 'Create Frequency Timing',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    // attach the FrequencyTiming to the new Data Source
    const attachQuery = attachToDataSourceQuery(dataSourceId, 'update_frequency', iri);
    try {
      response = await dataSources.Stardog.create({
        dbName: 'cyio-config',
        sparqlQuery: attachQuery,
        queryId: 'Attach Frequency Timing',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

<<<<<<< HEAD
  if (connectionProps !== undefined) {
    const { iri, id, query } = insertConnectionQuery(connectionProps);
=======
  if (Object.keys(connectionProps).length !== 0) {
    let {iri, id, query} = insertConnectionInformationQuery(connectionProps);
>>>>>>> origin/develop
    try {
      // Create the connection information
      response = await dataSources.Stardog.create({
        dbName: 'cyio-config',
        sparqlQuery: query,
        queryId: 'Create Connection Information',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    // attach the Connection Information to the new Data Source
    const attachQuery = attachToDataSourceQuery(dataSourceId, 'connection_information', iri);
    try {
      response = await dataSources.Stardog.create({
        dbName: 'cyio-config',
        sparqlQuery: attachQuery,
        queryId: 'Attach the connection information',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // retrieve the newly created Data Source to be returned
<<<<<<< HEAD
  const select = selectDataSourceQuery(id, selectMap.getNode('createDataSource'));
=======
  const select = selectDataSourceQuery(dataSourceId, selectMap.getNode("createDataSource"));
>>>>>>> origin/develop
  const result = await dataSources.Stardog.queryById({
    dbName: 'cyio-config',
    sparqlQuery: select,
    queryId: 'Select Data Source',
    singularizeSchema,
  });
<<<<<<< HEAD
  const reducer = getReducer('DATA-SOURCE');
  return reducer(result[0]);
};

export const deleteDataSourceById = async (id, dbName, dataSources) => {
  const select = ['id', 'object_type'];
=======
  if (result === undefined || result.length === 0) throw new CyioError(`Entity does not exist with ID ${dataSourceId}`);

  const reducer = getReducer("DATA-SOURCE");
  return reducer(result[0]);
};

export const deleteDataSourceById = async (id, dbName, dataSources) => {  
  let select = ['id','object_type','update_frequency','connection_information'];
>>>>>>> origin/develop
  if (!Array.isArray(id)) {
    if (!checkIfValidUUID(id)) throw new CyioError(`Invalid identifier: ${id}`);

    // check if object with id exists
    let sparqlQuery = selectDataSourceQuery(id, select);
    let response;
    try {
      response = await dataSources.Stardog.queryById({
        dbName: 'cyio-config',
        sparqlQuery,
        queryId: 'Select Data Source',
        singularizeSchema,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    if (response === undefined || response.length === 0) throw new CyioError(`Entity does not exist with ID ${id}`);

    // Delete any associated update frequency
    if (response[0].update_frequency) {
      let sparqlQuery = deleteFrequencyTimingByIriQuery(response[0].update_frequency);
      try {
        let results = await dataSources.Stardog.delete({
          dbName: 'cyio-config',
          sparqlQuery,
          queryId: "Delete Update Frequency"
        });
      } catch (e) {
        console.log(e)
        throw e
      }
    }

    // Delete any associated connection information
    if (response[0].connection_information) {
      let sparqlQuery = deleteConnectionInformationByIriQuery(response[0].connection_information);
      try {
        let results = await dataSources.Stardog.delete({
          dbName: 'cyio-config',
          sparqlQuery,
          queryId: "Delete Connection Information"
        });
      } catch (e) {
        console.log(e)
        throw e
      }
    }

    // delete the object
    sparqlQuery = deleteDataSourceQuery(id);
    try {
      response = await dataSources.Stardog.delete({
        dbName: 'cyio-config',
        sparqlQuery,
        queryId: 'Delete Data Source',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
<<<<<<< HEAD

    if (response === undefined || response.length === 0) throw new CyioError(`Entity does not exist with ID ${id}`);
=======
    
>>>>>>> origin/develop
    return id;
  }

  if (Array.isArray(id)) {
<<<<<<< HEAD
    let response;
    for (const item of id) {
      if (!checkIfValidUUID(item)) throw new CyioError(`Invalid identifier: ${item}`);

      // check if object with id exists
      const sparqlQuery = selectDataSourceQuery(id, select);
=======
    let removedIds = []
    for (let itemId of id) {
      let response;
      if (!checkIfValidUUID(itemId)) throw new CyioError(`Invalid identifier: ${itemId}`);  

      // check if object with id exists
      let sparqlQuery = selectDataSourceQuery(itemId, select);
>>>>>>> origin/develop
      try {
        response = await dataSources.Stardog.queryById({
          dbName: 'cyio-config',
          sparqlQuery,
          queryId: 'Select Data Source',
          singularizeSchema,
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
<<<<<<< HEAD

      if (response === undefined || response.length === 0) throw new CyioError(`Entity does not exist with ID ${id}`);
    }

    const sparqlQuery = deleteMultipleDataSourcesQuery(id);
    try {
      response = await dataSources.Stardog.delete({
        dbName: 'cyio-config',
        sparqlQuery,
        queryId: 'Delete multiple Data Sources',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (response === undefined || response.length === 0) throw new CyioError(`Entity does not exist with ID ${id}`);
    return id;
=======
      
      if (response === undefined || response.length === 0) throw new CyioError(`Entity does not exist with ID ${itemId}`);

      // Delete any associated update frequency
      if (response[0].update_frequency) {
        let sparqlQuery = deleteFrequencyTimingByIriQuery(response[0].update_frequency);
        try {
          let results = await dataSources.Stardog.delete({
            dbName: 'cyio-config',
            sparqlQuery,
            queryId: "Delete Update Frequency"
          });
        } catch (e) {
          console.log(e)
          throw e
        }
      }

      // Delete any associated connection information
      if (response[0].connection_information) {
        let sparqlQuery = deleteConnectionInformationByIriQuery(response[0].update_frequency);
        try {
          let results = await dataSources.Stardog.delete({
            dbName: 'cyio-config',
            sparqlQuery,
            queryId: "Delete Connection Information"
          });
        } catch (e) {
          console.log(e)
          throw e
        }
      }

      // delete the object
      sparqlQuery = deleteDataSourceQuery(itemId);
      try {
        let results = await dataSources.Stardog.delete({
          dbName: 'cyio-config',
          sparqlQuery,
          queryId: "Delete Data Source"
        });
      } catch (e) {
        console.log(e)
        throw e
      }

      removedIds.push(itemId);
    }

    return removedIds;
>>>>>>> origin/develop
  }
};

export const editDataSourceById = async (dataSourceId, input, dbName, dataSources, selectMap, schema) => {
  // make sure there is input data containing what is to be edited
  if (input === undefined || input.length === 0) throw new CyioError(`No input data was supplied`);

  // WORKAROUND to remove immutable fields
  input = input.filter((element) => element.key !== 'id' && element.key !== 'created' && element.key !== 'modified');

  // check that the object to be edited exists with the predicates - only get the minimum of data
  const editSelect = ['id', 'created', 'modified'];
  for (const editItem of input) {
    editSelect.push(editItem.key);
  }

  const sparqlQuery = selectDataSourceQuery(dataSourceId, editSelect);
  const response = await dataSources.Stardog.queryById({
    dbName: 'cyio-config',
    sparqlQuery,
    queryId: 'Select Data Source',
    singularizeSchema,
  });
  if (response.length === 0) throw new CyioError(`Entity does not exist with ID ${dataSourceId}`);

  // determine operation, if missing
  for (const editItem of input) {
    if (editItem.operation !== undefined) continue;

    // if value if empty then treat as a remove
    if (editItem.value.length === 0) {
      editItem.operation = 'remove';
      continue;
    }
    if (Array.isArray(editItem.value) && editItem.value[0] === null)
      throw new CyioError(`Field "${editItem.key}" has invalid value "null"`);

    if (!response[0].hasOwnProperty(editItem.key)) {
      editItem.operation = 'add';
    } else {
      editItem.operation = 'replace';

      // Set operation to 'skip' if no change in value
      if (response[0][editItem.key] === editItem.value) editItem.operation = 'skip';
    }
  }

  // Push an edit to update the modified time of the object
  const timestamp = new Date().toISOString();
  if (!response[0].hasOwnProperty('created')) {
    const update = { key: 'created', value: [`${timestamp}`], operation: 'add' };
    input.push(update);
  }
  let operation = 'replace';
  if (!response[0].hasOwnProperty('modified')) operation = 'add';
  const update = { key: 'modified', value: [`${timestamp}`], operation: `${operation}` };
  input.push(update);

  // Handle the update to fields that have references to other object instances
  for (const editItem of input) {
    if (editItem.operation === 'skip') continue;

    let value;
    let fieldType;
    let objectType;
    let objArray;
    const iris = [];
    for (value of editItem.value) {
      switch (editItem.key) {
        case 'data_source_type':
<<<<<<< HEAD
          if (!validateEnumValue(value, 'DataSourceType', schema))
            throw new CyioError(`Invalid value "${value}" for field "${editItem.key}".`);
          fieldType = 'simple';
          break;
        case 'status':
          if (!validateEnumValue(value, 'DataSourceStatus', schema))
            throw new CyioError(`Invalid value "${value}" for field "${editItem.key}".`);
=======
          if (!validateEnumValue(value, 'DataSourceType', schema)) throw new CyioError(`Invalid value "${value}" for field "${editItem.key}".`);
          editItem.value[0] = value.replace(/_/g,'-').toLowerCase();
          fieldType = 'simple';
          break;
        case 'status':
          if (!validateEnumValue(value, 'DataSourceStatus', schema)) throw new CyioError(`Invalid value "${value}" for field "${editItem.key}".`);
          editItem.value[0] = value.replace(/_/g,'-').toLowerCase();
>>>>>>> origin/develop
          fieldType = 'simple';
          break;
        case 'update_frequency':
          if (editItem.operation !== 'add') {
            // find the existing update frequency of the Data Source
            if ('update_frequency' in response[0]) {
              const frequency = response[0].update_frequency;

              // detach the private FrequencyTiming object
              let query = detachFromDataSourceQuery(dataSourceId, 'update_frequency', frequency);
<<<<<<< HEAD
              await dataSources.Stardog.delete({
                dbName: 'cyio-config',
                sparqlQuery: query,
                queryId: 'Detach FrequencyTiming from Data Source',
              });

              // Delete the Frequency object since its private to the Data Source
              query = deleteFrequencyTimingQuery(frequency);
              await dataSources.Stardog.delete({
                dbName: 'cyio-config',
                sparqlQuery: query,
                queryId: 'Delete Frequency Timing',
              });
=======
              // await dataSources.Stardog.delete({
              //   dbName: 'cyio-config',
              //   sparqlQuery: query,
              //   queryId: "Detach FrequencyTiming from Data Source"
              // });

              // Delete the Frequency object since its private to the Data Source
              query = deleteFrequencyTimingQuery(frequency);
              // await dataSources.Stardog.delete({
              //   dbName: 'cyio-config',
              //   sparqlQuery: query,
              //   queryId: "Delete Frequency Timing"
              // });  
>>>>>>> origin/develop
            }
          }
          if (editItem.operation !== 'delete') {
            let frequency;
            objArray = JSON.parse(value);
            if (Array.isArray(objArray)) {
              frequency = objArray[0];
            } else {
              frequency = objArray;
            }

            // create the instance of the Frequency Timing
            const { iri, id, query } = insertFrequencyTimingQuery(frequency);
<<<<<<< HEAD
            await dataSources.Stardog.create({
              dbName: 'cyio-config',
              sparqlQuery: query,
              queryId: 'Create Frequency Timing of Data Source',
            });

            // attach the new Frequency Timing to the Data Source
            const attachQuery = attachToDataSourceQuery(dataSourceId, 'update_frequency', iri);
            await dataSources.Stardog.create({
              dbName: 'cyio-config',
              sparqlQuery: attachQuery,
              queryId: 'Attach Frequency Timing object to Data Source',
            });
=======
            // await dataSources.Stardog.create({
            //   dbName: 'cyio-config',
            //   sparqlQuery: query,
            //   queryId: "Create Frequency Timing of Data Source"
            // });

            // attach the new Frequency Timing to the Data Source
            let attachQuery = attachToDataSourceQuery(dataSourceId, 'update_frequency', iri);
            // await dataSources.Stardog.create({
            //   dbName: 'cyio-config',
            //   sparqlQuery: attachQuery,
            //   queryId: "Attach Frequency Timing object to Data Source"
            // });
>>>>>>> origin/develop
          }
          fieldType = 'complex';
          editItem.operation = 'skip';
          break;
        case 'connection_information':
          if (editItem.operation !== 'add') {
            // find the existing update frequency of the Data Source
            if ('connection_information' in response[0]) {
              const connection = response[0].connection_information;

              // detach the private Connection Information object
              let query = detachFromDataSourceQuery(dataSourceId, 'connection_information', connection);
<<<<<<< HEAD
              await dataSources.Stardog.delete({
                dbName: 'cyio-config',
                sparqlQuery: query,
                queryId: 'Detach Connection Information from Data Source',
              });

              // Delete the Connection Information object since its private to the Data Source
              query = deleteConnectionInformationQuery(connection);
              await dataSources.Stardog.delete({
                dbName: 'cyio-config',
                sparqlQuery: query,
                queryId: 'Delete Connection Information',
              });
=======
              // await dataSources.Stardog.delete({
              //   dbName: 'cyio-config',
              //   sparqlQuery: query,
              //   queryId: "Detach Connection Information from Data Source"
              // });

              // Delete the Connection Information object since its private to the Data Source
              query = deleteConnectionInformationQuery(connection);
              // await dataSources.Stardog.delete({
              //   dbName: 'cyio-config',
              //   sparqlQuery: query,
              //   queryId: "Delete Connection Information"
              // });  
>>>>>>> origin/develop
            }
          }
          if (editItem.operation !== 'delete') {
            let connection;
            objArray = JSON.parse(value);
            if (Array.isArray(objArray)) {
              connection = objArray[0];
            } else {
              connection = objArray;
            }

            // create the instance of the Connection Information
            const { iri, id, query } = insertConnectionInformationQuery(connection);
<<<<<<< HEAD
            await dataSources.Stardog.create({
              dbName: 'cyio-config',
              sparqlQuery: query,
              queryId: 'Create Connection Information of Data Source',
            });

            // attach the new Frequency Timing to the Data Source
            const attachQuery = attachToDataSourceQuery(dataSourceId, 'connection_information', iri);
            await dataSources.Stardog.create({
              dbName: 'cyio-config',
              sparqlQuery: attachQuery,
              queryId: 'Attach Connection Information object to Data Source',
            });
=======
            // await dataSources.Stardog.create({
            //   dbName: 'cyio-config',
            //   sparqlQuery: query,
            //   queryId: "Create Connection Information of Data Source"
            // });

            // attach the new Connection Information to the Data Source
            let attachQuery = attachToDataSourceQuery(dataSourceId, 'connection_information', iri);
            // await dataSources.Stardog.create({
            //   dbName: 'cyio-config',
            //   sparqlQuery: attachQuery,
            //   queryId: "Attach Connection Information object to Data Source"
            // });
>>>>>>> origin/develop
          }
          fieldType = 'complex';
          editItem.operation = 'skip';
          break;
        case 'iep':
          objectType = 'marking-definition';
          fieldType = 'id';
          break;
        default:
          fieldType = 'simple';
          break;
      }

      if (fieldType === 'id') {
        // continue to next item if nothing to do
        if (editItem.operation === 'skip') continue;

        const iri = `${objectMap[objectType].iriTemplate}-${value}`;
        const sparqlQuery = selectObjectIriByIdQuery(value, objectType);
        const result = await dataSources.Stardog.queryById({
          dbName: 'cyio-config',
          sparqlQuery,
          queryId: 'Obtaining IRI for the object with id',
          singularizeSchema,
        });
        if (result === undefined || result.length === 0) throw new CyioError(`Entity does not exist with ID ${value}`);
        iris.push(`<${result[0].iri}>`);
      }
    }
    if (iris.length > 0) editItem.value = iris;
  }

  const query = updateQuery(
    `http://cyio.darklight.ai/data-source--${dataSourceId}`,
    'http://darklight.ai/ns/cyio/datasource#DataSource',
    input,
    dataSourcePredicateMap
  );
  if (query !== null) {
    let response;
    try {
      response = await dataSources.Stardog.edit({
        dbName: 'cyio-config',
        sparqlQuery: query,
        queryId: 'Update Data Source',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }

    if (response !== undefined && 'status' in response) {
      if (response.ok === false || response.status > 299) {
        // Handle reporting Stardog Error
        throw new UserInputError(response.statusText, {
          error_details: response.body.message ? response.body.message : response.body,
          error_code: response.body.code ? response.body.code : 'N/A',
        });
      }
    }
  }

  const select = selectDataSourceQuery(dataSourceId, selectMap.getNode('editDataSource'));
  const result = await dataSources.Stardog.queryById({
    dbName: 'cyio-config',
    sparqlQuery: select,
    queryId: 'Select Data Source',
    singularizeSchema,
  });
  const reducer = getReducer('DATA-SOURCE');
  return reducer(result[0]);
};

export const findFrequencyTimingByIri = async (iri, dbName, dataSources, selectMap) => {
  const sparqlQuery = selectFrequencyTimingByIriQuery(iri, selectMap.getNode('update_frequency'));
  let response;
  try {
    response = await dataSources.Stardog.queryById({
      dbName: 'cyio-config',
      sparqlQuery,
      queryId: 'Select Frequency Timing',
      singularizeSchema,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
  if (response === undefined) return null;
  if (typeof response === 'object' && 'body' in response) {
    throw new UserInputError(response.statusText, {
      error_details: response.body.message ? response.body.message : response.body,
      error_code: response.body.code ? response.body.code : 'N/A',
    });
  }
  if (Array.isArray(response) && response.length > 0) {
    const reducer = getReducer('FREQUENCY-TIMING');
    return reducer(response[0]);
  }
};
