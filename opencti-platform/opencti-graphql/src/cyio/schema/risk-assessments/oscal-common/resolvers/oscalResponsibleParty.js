import { riskSingularizeSchema as singularizeSchema } from '../../risk-mappings.js';
import { compareValues, updateQuery, filterValues } from '../../../utils.js';
import { UserInputError } from "apollo-server-express";
import {
  selectLabelByIriQuery,
  selectExternalReferenceByIriQuery,
  selectNoteByIriQuery,
  getReducer as getGlobalReducer,
} from '../../../global/resolvers/sparql-query.js';
import {
  getReducer,
  insertResponsiblePartyQuery,
  selectResponsiblePartyQuery,
  selectAllResponsibleParties,
  deleteResponsiblePartyQuery,
  attachToResponsiblePartyQuery,
  selectPartyByIriQuery,  
  selectRoleByIriQuery,
  responsiblePartyPredicateMap,
} from './sparql-query.js';

const responsiblePartyResolvers = {
  Query: {
    oscalResponsibleParties: async (_, args, { dbName, dataSources, selectMap }) => {
      const sparqlQuery = selectAllResponsibleParties(selectMap.getNode("node"), args.filters);
      let response;
      try {
        response = await dataSources.Stardog.queryAll({
          dbName,
          sparqlQuery,
          queryId: "Select List of Responsible Parties",
          singularizeSchema
        });
      } catch (e) {
        console.log(e)
        throw e
      }

      if (response === undefined) return null;
      if (Array.isArray(response) && response.length > 0) {
        const edges = [];
        const reducer = getReducer("RESPONSIBLE-PARTY");
        let limit = (args.first === undefined ? response.length : args.first);
        let offset = (args.offset === undefined ? 0 : args.offset);
        let respPartyList;
        if (args.orderedBy !== undefined) {
          respPartyList = response.sort(compareValues(args.orderedBy, args.orderMode));
        } else {
          respPartyList = response;
        }

        if (offset > respPartyList.length) return null;

        // for each Role in the result set
        for (let respParty of respPartyList) {
          // skip down past the offset
          if (offset) {
            offset--
            continue
          }

          if (respParty.id === undefined || respParty.id == null) {
            console.log(`[DATA-ERROR] object ${respParty.iri} is missing required properties; skipping object.`);
            continue;
          }

          // filter out non-matching entries if a filter is to be applied
          if ('filters' in args && args.filters != null && args.filters.length > 0) {
            if (!filterValues(respParty, args.filters, args.filterMode)) {
              continue
            }
          }

          // if haven't reached limit to be returned
          if (limit) {
            let edge = {
              cursor: respParty.iri,
              node: reducer(respParty),
            }
            edges.push(edge)
            limit--;
          }
        }
        if (edges.length === 0 ) return null;
        return {
          pageInfo: {
            startCursor: edges[0].cursor,
            endCursor: edges[edges.length - 1].cursor,
            hasNextPage: (args.first > respPartyList.length),
            hasPreviousPage: (args.offset > 0),
            globalCount: respPartyList.length,
          },
          edges: edges,
        }
      } else {
        // Handle reporting Stardog Error
        if (typeof (response) === 'object' && 'body' in response) {
          throw new UserInputError(response.statusText, {
            error_details: (response.body.message ? response.body.message : response.body),
            error_code: (response.body.code ? response.body.code : 'N/A')
          });
        } else {
          return null;
        }
      }
    },
    oscalResponsibleParty: async (_, { id }, { dbName, dataSources, selectMap }) => {
      const sparqlQuery = selectResponsiblePartyQuery(id, selectMap.getNode("oscalResponsibleParty"));
      let response;
      try {
        response = await dataSources.Stardog.queryById({
          dbName,
          sparqlQuery,
          queryId: "Select OSCAL Responsible Party",
          singularizeSchema
        });
      } catch (e) {
        console.log(e)
        throw e
      }

      if (response === undefined) return null;
      if (Array.isArray(response) && response.length > 0) {
        const reducer = getReducer("RESPONSIBLE-PARTY");
        return reducer(response[0]);
      } else {
        // Handle reporting Stardog Error
        if (typeof (response) === 'object' && 'body' in response) {
          throw new UserInputError(response.statusText, {
            error_details: (response.body.message ? response.body.message : response.body),
            error_code: (response.body.code ? response.body.code : 'N/A')
          });
        } else {
          return null;
        }
      }
    },
  },
  Mutation: {
    createOscalResponsibleParty: async (_, { input }, { dbName, selectMap, dataSources }) => {
      // Setup to handle embedded objects to be created
      let parties, role;
      if (input.parties !== undefined) {
        parties = input.parties;
        delete input.parties;
      }
      if (input.role !== undefined) {
        role = input.role;
        delete input.role;
      }

      // create the Responsible Party
      const { id, query } = insertResponsiblePartyQuery(input);
      await dataSources.Stardog.create({
        dbName,
        sparqlQuery: query,
        queryId: "Create OSCAL Responsible Party"
      });

      // add the responsible party to the parent object (if supplied)

      // attach associated Role
      if (role !== undefined && role !== null) {
        const roleIris = [];
        roleIris.push(`<http://csrc.nist.gov/ns/oscal/common#Role-${role}>`);
        // attach the Role to the Responsible Party
        const roleAttachQuery = attachToResponsiblePartyQuery(id, 'role', roleIris);
        await dataSources.Stardog.create({
          dbName,
          sparqlQuery: roleAttachQuery,
          queryId: "Attach reference to the Role to this Responsible Party"
        });        
      }
      // attach any Parties
      if (parties !== undefined && parties !== null) {
        const partyIris = [];
        for (let partyIri of parties) partyIris.push(`<http://csrc.nist.gov/ns/oscal/common#Party-${partyIri}>`);
        // attach the Party to the Responsible Party
        const partyAttachQuery = attachToResponsiblePartyQuery(id, 'parties', partyIris);
        await dataSources.Stardog.create({
          dbName,
          sparqlQuery: partyAttachQuery,
          queryId: "Attach references to one or more Parties to this Responsible Party"
        });        
      }

      // retrieve information about the newly created Responsible Party to return to the user
      const select = selectResponsiblePartyQuery(id, selectMap.getNode("createOscalResponsibleParty"));
      let response;
      try {
        response = await dataSources.Stardog.queryById({
          dbName,
          sparqlQuery: select,
          queryId: "Select OSCAL Responsible Party",
          singularizeSchema
        });
      } catch (e) {
        console.log(e)
        throw e
      }
      const reducer = getReducer("RESPONSIBLE-PARTY");
      return reducer(response[0]);
    },
    deleteOscalResponsibleParty: async (_, { id }, { dbName, dataSources }) => {
      // check that the Role exists
      const sparqlQuery = selectResponsiblePartyQuery(id, null);
      let response;
      try {
        response = await dataSources.Stardog.queryById({
          dbName,
          sparqlQuery,
          queryId: "Select OSCAL Responsible Party",
          singularizeSchema
        });
      } catch (e) {
        console.log(e)
        throw e
      }
      if (response.length === 0) throw new UserInputError(`Entity does not exist with ID ${id}`);

      // detach the Responsible Party from the parent object (if supplied)

      // Delete the responsible party itself
      const query = deleteResponsiblePartyQuery(id);
      try {
        await dataSources.Stardog.delete({
          dbName,
          sparqlQuery: query,
          queryId: "Delete OSCAL Responsible party"
        });
      } catch (e) {
        console.log(e)
        throw e
      }
      return id;
    },
    editOscalResponsibleParty: async (_, { id, input }, { dbName, dataSources, selectMap }) => {
      // check that the Party exists
      const sparqlQuery = selectResponsiblePartyQuery(id, null);
      let response;
      try {
        response = await dataSources.Stardog.queryById({
          dbName,
          sparqlQuery,
          queryId: "Select OSCAL Responsible Party",
          singularizeSchema
        });
      } catch (e) {
        console.log(e)
        throw e
      }

      if (response.length === 0) throw new UserInputError(`Entity does not exist with ID ${id}`);

      const query = updateQuery(
        `http://csrc.nist.gov/ns/oscal/common#ResponsibleParty-${id}`,
        "http://csrc.nist.gov/ns/oscal/common#ResponsibleParty",
        input,
        responsiblePartyPredicateMap
      )
      await dataSources.Stardog.edit({
        dbName,
        sparqlQuery: query,
        queryId: "Update OSCAL Role"
      });
      const select = selectResponsiblePartyQuery(id, selectMap.getNode("editOscalResponsibleParty"));
      const result = await dataSources.Stardog.queryById({
        dbName,
        sparqlQuery: select,
        queryId: "Select OSCAL Responsible Party",
        singularizeSchema
      });
      const reducer = getReducer("RESPONSIBLE-PARTY");
      return reducer(result[0]);
    },
  },
  OscalResponsibleParty: {
    labels: async (parent, args, {dbName, dataSources, selectMap}) => {
      if (parent.labels_iri === undefined) return [];
      let iriArray = parent.labels_iri;
      const results = [];
      if (Array.isArray(iriArray) && iriArray.length > 0) {
        const reducer = getGlobalReducer("LABEL");
        for (let iri of iriArray) {
          if (iri === undefined || !iri.includes('Label')) continue;
          const sparqlQuery = selectLabelByIriQuery(iri, selectMap.getNode("labels"));
          let response;
          try {
            response = await dataSources.Stardog.queryById({
              dbName,
              sparqlQuery,
              queryId: "Select Label",
              singularizeSchema
            });
          } catch (e) {
            console.log(e)
            throw e
          }
          if (response === undefined) return [];
          if (Array.isArray(response) && response.length > 0) {
            results.push(reducer(response[0]))
          }
          else {
            // Handle reporting Stardog Error
            if (typeof (response) === 'object' && 'body' in response) {
              throw new UserInputError(response.statusText, {
                error_details: (response.body.message ? response.body.message : response.body),
                error_code: (response.body.code ? response.body.code : 'N/A')
              });
            }
          }  
        }
        return results;
      } else {
        return [];
      }
    },
    links: async (parent, args, {dbName, dataSources, selectMap}) => {
      if (parent.ext_ref_iri === undefined) return [];
      let iriArray = parent.ext_ref_iri;
      const results = [];
      if (Array.isArray(iriArray) && iriArray.length > 0) {
        const reducer = getGlobalReducer("EXTERNAL-REFERENCE");
        for (let iri of iriArray) {
          if (iri === undefined || !iri.includes('ExternalReference')) continue;
          const sparqlQuery = selectExternalReferenceByIriQuery(iri, selectMap.getNode("external_references"));
          let response;
          try {
            response = await dataSources.Stardog.queryById({
              dbName,
              sparqlQuery,
              queryId: "Select External Reference",
              singularizeSchema
            });
          } catch (e) {
            console.log(e)
            throw e
          }
          if (response === undefined) return [];
          if (Array.isArray(response) && response.length > 0) {
            results.push(reducer(response[0]))
          }
          else {
            // Handle reporting Stardog Error
            if (typeof (response) === 'object' && 'body' in response) {
              throw new UserInputError(response.statusText, {
                error_details: (response.body.message ? response.body.message : response.body),
                error_code: (response.body.code ? response.body.code : 'N/A')
              });
            }
          }  
        }
        return results;
      } else {
        return [];
      }
    },
    remarks: async (parent, args, {dbName, dataSources, selectMap}) => {
      if (parent.notes_iri === undefined) return [];
      let iriArray = parent.notes_iri;
      const results = [];
      if (Array.isArray(iriArray) && iriArray.length > 0) {
        const reducer = getGlobalReducer("NOTE");
        for (let iri of iriArray) {
          if (iri === undefined || !iri.includes('Note')) continue;
          const sparqlQuery = selectNoteByIriQuery(iri, selectMap.getNode("notes"));
          let response;
          try {
            response = await dataSources.Stardog.queryById({
              dbName,
              sparqlQuery,
              queryId: "Select Note",
              singularizeSchema
            });
          } catch (e) {
            console.log(e)
            throw e
          }
          if (response === undefined) return [];
          if (Array.isArray(response) && response.length > 0) {
            results.push(reducer(response[0]))
          }
          else {
            // Handle reporting Stardog Error
            if (typeof (response) === 'object' && 'body' in response) {
              throw new UserInputError(response.statusText, {
                error_details: (response.body.message ? response.body.message : response.body),
                error_code: (response.body.code ? response.body.code : 'N/A')
              });
            }
          }  
        }
        return results;
      } else {
        return [];
      }
    },
    parties: async (parent, args, {dbName, dataSources, selectMap}) => {
      if (parent.parties_iri === undefined) return [];
      let iriArray = parent.parties_iri;
      const results = [];
      if (Array.isArray(iriArray) && iriArray.length > 0) {
        const reducer = getReducer("PARTY");
        for (let iri of iriArray) {
          if (iri === undefined || !iri.includes('Party')) continue;
          const sparqlQuery = selectPartyByIriQuery(iri, selectMap.getNode("parties"));
          let response;
          try {
            response = await dataSources.Stardog.queryById({
              dbName,
              sparqlQuery,
              queryId: "Select Party",
              singularizeSchema
            });
          } catch (e) {
            console.log(e)
            throw e
          }
          if (response === undefined) return [];
          if (Array.isArray(response) && response.length > 0) {
            results.push(reducer(response[0]))
          }
          else {
            // Handle reporting Stardog Error
            if (typeof (response) === 'object' && 'body' in response) {
              throw new UserInputError(response.statusText, {
                error_details: (response.body.message ? response.body.message : response.body),
                error_code: (response.body.code ? response.body.code : 'N/A')
              });
            }
          }  
        }
        return results;
      } else {
        return [];
      }
    },
    role: async (parent, args, {dbName, dataSources, selectMap}) => {
      if (parent.role_iri === undefined) return null;
      let iri = parent.role_iri[0];
      const reducer = getReducer("ROLE");
      const sparqlQuery = selectRoleByIriQuery(iri, selectMap.getNode("role"));
      let response;
      try {
        response = await dataSources.Stardog.queryById({
          dbName,
          sparqlQuery,
          queryId: "Select Role",
          singularizeSchema
        });
      } catch (e) {
        console.log(e)
        throw e
      }
      if (response === undefined) return null;
      if (Array.isArray(response) && response.length > 0) {
        return (reducer(response[0]))
      }
      else {
        // Handle reporting Stardog Error
        if (typeof (response) === 'object' && 'body' in response) {
          throw new UserInputError(response.statusText, {
            error_details: (response.body.message ? response.body.message : response.body),
            error_code: (response.body.code ? response.body.code : 'N/A')
          });
        }
      }
      return null;  
    }
  }
}

export default responsiblePartyResolvers;
