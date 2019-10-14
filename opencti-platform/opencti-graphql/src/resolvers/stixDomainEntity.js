import { withFilter } from 'graphql-subscriptions';
import { BUS_TOPICS } from '../config/conf';
import {
  addStixDomainEntity,
  createdByRef,
  findAll,
  findByExternalReference,
  findById,
  findByName,
  findByStixId,
  markingDefinitions,
  reports,
  stixDomainEntitiesNumber,
  stixDomainEntitiesTimeSeries,
  stixDomainEntityAddRelation,
  stixDomainEntityExportAsk,
  stixDomainEntityCleanContext,
  stixDomainEntityDelete,
  stixDomainEntityDeleteRelation,
  stixDomainEntityEditContext,
  stixDomainEntityEditField,
  stixDomainEntityExportPush,
  stixRelations,
  stixDomainEntityImportPush
} from '../domain/stixDomainEntity';
import { fetchEditContext, pubsub } from '../database/redis';
import withCancel from '../schema/subscriptionWrapper';
import { filesListing } from '../database/minio';

const stixDomainEntityResolvers = {
  Query: {
    stixDomainEntity: (_, { id }) => findById(id),
    stixDomainEntities: (_, args) => {
      if (args.stix_id && args.stix_id.length > 0) {
        return findByStixId(args);
      }
      if (args.name && args.name.length > 0) {
        return findByName(args);
      }
      if (args.externalReferenceId && args.externalReferenceId.length > 0) {
        return findByExternalReference(args);
      }
      return findAll(args);
    },
    stixDomainEntitiesTimeSeries: (_, args) =>
      stixDomainEntitiesTimeSeries(args),
    stixDomainEntitiesNumber: (_, args) => stixDomainEntitiesNumber(args)
  },
  StixDomainEntity: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(obj) {
      if (obj.entity_type) {
        return obj.entity_type.replace(/(?:^|-)(\w)/g, (matches, letter) =>
          letter.toUpperCase()
        );
      }
      return 'Unknown';
    },
    createdByRef: entity => createdByRef(entity.id),
    markingDefinitions: (entity, args) => markingDefinitions(entity.id, args),
    stixRelations: (entity, args) => stixRelations(entity.id, args),
    editContext: entity => fetchEditContext(entity.id),
    reports: (entity, args) => reports(entity.id, args),
    importFiles: (entity, { first }) => filesListing(first, 'import', entity),
    exportFiles: (entity, { first }) => filesListing(first, 'export', entity)
  },
  Mutation: {
    stixDomainEntityEdit: (_, { id }, { user }) => ({
      delete: () => stixDomainEntityDelete(id),
      fieldPatch: ({ input }) => stixDomainEntityEditField(user, id, input),
      contextPatch: ({ input }) => stixDomainEntityEditContext(user, id, input),
      contextClean: () => stixDomainEntityCleanContext(user, id),
      relationAdd: ({ input }) => stixDomainEntityAddRelation(user, id, input),
      relationDelete: ({ relationId }) =>
        stixDomainEntityDeleteRelation(user, id, relationId),
      importPush: ({ file }) => stixDomainEntityImportPush(user, id, file),
      exportAsk: ({ format, exportType }) =>
        stixDomainEntityExportAsk(id, format, exportType),
      exportPush: ({ jobId, file }) =>
        stixDomainEntityExportPush(user, id, jobId, file)
    }),
    stixDomainEntityAdd: (_, { input }, { user }) =>
      addStixDomainEntity(user, input)
  },
  Subscription: {
    stixDomainEntity: {
      resolve: payload => payload.instance,
      subscribe: (_, { id }, { user }) => {
        stixDomainEntityEditContext(user, id);
        const filtering = withFilter(
          () => pubsub.asyncIterator(BUS_TOPICS.StixDomainEntity.EDIT_TOPIC),
          payload => {
            if (!payload) return false; // When disconnect, an empty payload is dispatched.
            return payload.user.id !== user.id && payload.instance.id === id;
          }
        )(_, { id }, { user });
        return withCancel(filtering, () => {
          stixDomainEntityCleanContext(user, id);
        });
      }
    }
  }
};

export default stixDomainEntityResolvers;
