import * as R from 'ramda';
import { Promise as Bluebird } from 'bluebird';
import { logApp, TOPIC_PREFIX } from '../config/conf';
import {
  ENTITY_TYPE_CONNECTOR,
  ENTITY_TYPE_RULE,
  ENTITY_TYPE_SETTINGS,
  ENTITY_TYPE_STATUS,
  ENTITY_TYPE_STATUS_TEMPLATE,
  ENTITY_TYPE_STREAM_COLLECTION,
  ENTITY_TYPE_USER
} from '../schema/internalObject';
import { executionContext, SYSTEM_USER } from '../utils/access';
import { connectors as findConnectors } from '../database/repository';
import type {
  BasicStoreRelation,
  BasicStoreSettings,
  BasicStreamEntity,
  BasicTriggerEntity,
  BasicWorkflowStatusEntity,
  BasicWorkflowTemplateEntity,
  StoreEntity,
  StoreRelation,
} from '../types/store';
import { EntityOptions, listAllEntities, listAllRelations } from '../database/middleware-loader';
import { ENTITY_TYPE_MARKING_DEFINITION } from '../schema/stixMetaObject';
import { dynamicCacheUpdater, resetCacheForEntity, writeCacheForEntity } from '../database/cache';
import type { AuthContext } from '../types/user';
import { ENTITY_TYPE_IDENTITY_ORGANIZATION, ENTITY_TYPE_RESOLVED_FILTERS } from '../schema/stixDomainObject';
import { ENTITY_TYPE_ENTITY_SETTING } from '../modules/entitySetting/entitySetting-types';
import { OrderingMode } from '../generated/graphql';
import { extractFilterIdsToResolve } from '../utils/filtering';
import { BasicStoreEntityTrigger, ENTITY_TYPE_TRIGGER } from '../modules/notification/notification-types';
import { ES_MAX_CONCURRENCY } from '../database/engine';
import { resolveUserById } from '../domain/user';
import { pubSubSubscription } from '../database/redis';
import { stixLoadByIds } from '../database/middleware';
import { RELATION_MEMBER_OF, RELATION_PARTICIPATE_TO } from '../schema/internalRelationship';

const workflowStatuses = (context: AuthContext) => {
  const reloadStatuses = async () => {
    const templates = await listAllEntities<BasicWorkflowTemplateEntity>(context, SYSTEM_USER, [ENTITY_TYPE_STATUS_TEMPLATE], { connectionFormat: false });
    const args:EntityOptions<BasicWorkflowStatusEntity> = { orderBy: ['order'], orderMode: OrderingMode.Asc, connectionFormat: false };
    const statuses = await listAllEntities<BasicWorkflowStatusEntity>(context, SYSTEM_USER, [ENTITY_TYPE_STATUS], args);
    return statuses.map((status) => {
      const template = templates.find((t) => t.internal_id === status.template_id);
      return { ...status, name: template?.name ?? 'Error with template association' };
    });
  };
  return { values: null, fn: reloadStatuses };
};
const platformResolvedFilters = (context: AuthContext) => {
  const reloadFilters = async () => {
    const filteringIds = [];
    const streams = await listAllEntities<BasicStreamEntity>(context, SYSTEM_USER, [ENTITY_TYPE_STREAM_COLLECTION], { connectionFormat: false });
    filteringIds.push(...streams.map((s) => extractFilterIdsToResolve(JSON.parse(s.filters ?? '{}'))).flat());
    const triggers = await listAllEntities<BasicTriggerEntity>(context, SYSTEM_USER, [ENTITY_TYPE_TRIGGER], { connectionFormat: false });
    filteringIds.push(...triggers.map((s) => extractFilterIdsToResolve(JSON.parse(s.filters ?? '{}'))).flat());
    if (filteringIds.length > 0) {
      const resolvingIds = R.uniq(filteringIds);
      const loadedDependencies = await stixLoadByIds(context, SYSTEM_USER, resolvingIds);
      return loadedDependencies;
    }
    return [];
  };
  return { values: null, fn: reloadFilters };
};
const platformConnectors = (context: AuthContext) => {
  const reloadConnectors = () => {
    return findConnectors(context, SYSTEM_USER);
  };
  return { values: null, fn: reloadConnectors };
};
const platformOrganizations = (context: AuthContext) => {
  const reloadOrganizations = () => {
    return listAllEntities(context, SYSTEM_USER, [ENTITY_TYPE_IDENTITY_ORGANIZATION], { connectionFormat: false });
  };
  return { values: null, fn: reloadOrganizations };
};
const platformRules = (context: AuthContext) => {
  const reloadRules = () => {
    return listAllEntities(context, SYSTEM_USER, [ENTITY_TYPE_RULE], { connectionFormat: false });
  };
  return { values: null, fn: reloadRules };
};
const platformMarkings = (context: AuthContext) => {
  const reloadMarkings = () => {
    return listAllEntities(context, SYSTEM_USER, [ENTITY_TYPE_MARKING_DEFINITION], { connectionFormat: false });
  };
  return { values: null, fn: reloadMarkings };
};
const platformTriggers = (context: AuthContext) => {
  const reloadTriggers = () => {
    return listAllEntities<BasicStoreEntityTrigger>(context, SYSTEM_USER, [ENTITY_TYPE_TRIGGER], { connectionFormat: false });
  };
  return { values: null, fn: reloadTriggers };
};
const platformUsers = (context: AuthContext) => {
  const reloadUsers = async () => {
    const users = await listAllEntities(context, SYSTEM_USER, [ENTITY_TYPE_USER], { connectionFormat: false });
    const allUserIds = users.map((user) => user.internal_id);
    return Bluebird.map(allUserIds, (userId: string) => resolveUserById(context, userId), { concurrency: ES_MAX_CONCURRENCY });
  };
  return { values: null, fn: reloadUsers };
};
const platformSettings = (context: AuthContext) => {
  const reloadSettings = async () => {
    const memberOfRelations = await listAllRelations<BasicStoreRelation>(context, SYSTEM_USER, [RELATION_MEMBER_OF, RELATION_PARTICIPATE_TO], { connectionFormat: false });
    const memberOfGroups = memberOfRelations.filter((m) => m.entity_type === RELATION_MEMBER_OF)
      .map((mr) => ({ group: mr.toId, user: mr.fromId }));
    const membersGroupMap = new Map(Object.entries(R.groupBy((r) => r.group, memberOfGroups)).map(([k, v]) => [k, v.map((t) => t.user)]));
    const memberOfOrgs = memberOfRelations.filter((m) => m.entity_type === RELATION_PARTICIPATE_TO)
      .map((mr) => ({ organization: mr.toId, user: mr.fromId }));
    const membersOrganizationMap = new Map(Object.entries(R.groupBy((r) => r.organization, memberOfOrgs)).map(([k, v]) => [k, v.map((t) => t.user)]));
    return listAllEntities<BasicStoreSettings>(context, SYSTEM_USER, [ENTITY_TYPE_SETTINGS], { connectionFormat: false }).then((settings) => {
      return settings.map((s) => {
        const auditListenerIds = s.activity_listeners_ids ?? [];
        const activity_listeners_users = auditListenerIds.map((id: string) => membersGroupMap.get(id) ?? membersOrganizationMap.get(id) ?? [id]).flat();
        return { ...s, activity_listeners_users };
      });
    });
  };
  return { values: null, fn: reloadSettings };
};
const platformEntitySettings = (context: AuthContext) => {
  const reloadEntitySettings = () => {
    return listAllEntities(context, SYSTEM_USER, [ENTITY_TYPE_ENTITY_SETTING], { connectionFormat: false });
  };
  return { values: null, fn: reloadEntitySettings };
};

const platformStreams = (context: AuthContext) => {
  const reloadStreams = () => {
    return listAllEntities(context, SYSTEM_USER, [ENTITY_TYPE_STREAM_COLLECTION], { connectionFormat: false });
  };
  return { values: null, fn: reloadStreams };
};

const initCacheManager = () => {
  let subscribeIdentifier: { topic: string; unsubscribe: () => void; };
  const initCacheContent = () => {
    const context = executionContext('cache_manager');
    writeCacheForEntity(ENTITY_TYPE_SETTINGS, platformSettings(context));
    writeCacheForEntity(ENTITY_TYPE_ENTITY_SETTING, platformEntitySettings(context));
    writeCacheForEntity(ENTITY_TYPE_MARKING_DEFINITION, platformMarkings(context));
    writeCacheForEntity(ENTITY_TYPE_USER, platformUsers(context));
    writeCacheForEntity(ENTITY_TYPE_STATUS, workflowStatuses(context));
    writeCacheForEntity(ENTITY_TYPE_CONNECTOR, platformConnectors(context));
    writeCacheForEntity(ENTITY_TYPE_TRIGGER, platformTriggers(context));
    writeCacheForEntity(ENTITY_TYPE_RULE, platformRules(context));
    writeCacheForEntity(ENTITY_TYPE_IDENTITY_ORGANIZATION, platformOrganizations(context));
    writeCacheForEntity(ENTITY_TYPE_RESOLVED_FILTERS, platformResolvedFilters(context));
    writeCacheForEntity(ENTITY_TYPE_STREAM_COLLECTION, platformStreams(context));
  };
  const resetCacheContent = async (event: { instance: StoreEntity | StoreRelation }) => {
    const { instance } = event;
    const context = executionContext('cache_manager');
    // Invalid cache if any entity has changed.
    resetCacheForEntity(instance.entity_type);
    // Smart dynamic cache loading (for filtering ...)
    dynamicCacheUpdater(context, SYSTEM_USER, instance);
  };
  return {
    init: () => initCacheContent(), // Use for testing
    start: async () => {
      initCacheContent();
      // Listen pub/sub configuration events
      subscribeIdentifier = await pubSubSubscription<{ instance: StoreEntity | StoreRelation }>(`${TOPIC_PREFIX}*`, async (event) => {
        await resetCacheContent(event);
      });
      logApp.info('[OPENCTI-MODULE] Cache manager pub sub listener initialized');
    },
    shutdown: async () => {
      logApp.info('[OPENCTI-MODULE] Stopping cache manager');
      if (subscribeIdentifier) {
        try { subscribeIdentifier.unsubscribe(); } catch { /* dont care */ }
      }
      return true;
    }
  };
};
const cacheManager = initCacheManager();

export default cacheManager;
