import { v4 as uuidv4 } from 'uuid';
import type { AuthContext, AuthUser } from '../../types/user';
import type { BasicStoreEntityWorkspace } from './workspace-types';
import { FunctionalError } from '../../config/errors';
import { storeLoadByIdsWithRefs } from '../../database/middleware';
import { buildStixBundle, convertStoreToStix } from '../../database/stix-converter';
import { ENTITY_TYPE_CONTAINER_REPORT } from '../../schema/stixDomainObject';
import { STIX_SPEC_VERSION } from '../../database/stix';
import { generateStandardId } from '../../schema/identifier';
import type { StixId, StixObject } from '../../types/stix-common';
import { internalLoadById } from '../../database/middleware-loader';
import { addWorkspace } from './workspace-domain';
import type { BasicStoreEntity, StoreEntity, StoreEntityReport } from '../../types/store';
import { now } from '../../utils/format';
import { READ_STIX_INDICES } from '../../database/utils';
import { getParentTypes } from '../../schema/schemaUtils';

const buildStixReportForExport = (workspace: BasicStoreEntityWorkspace, investigatedEntities: StoreEntity[]): StixObject => {
  const id = generateStandardId(ENTITY_TYPE_CONTAINER_REPORT, { name: workspace.name, published: workspace.created_at }) as StixId;
  const report: StoreEntityReport = {
    internal_id: uuidv4(),
    standard_id: id,
    name: workspace.name,
    published: workspace.created_at,
    spec_version: STIX_SPEC_VERSION,
    entity_type: ENTITY_TYPE_CONTAINER_REPORT,
    parent_types: getParentTypes(ENTITY_TYPE_CONTAINER_REPORT),
    objects: investigatedEntities,
  };
  return convertStoreToStix(report);
};

export const toStixReportBundle = async (context: AuthContext, user: AuthUser, workspace: BasicStoreEntityWorkspace): Promise<string> => {
  if (workspace.type !== 'investigation') {
    throw FunctionalError('You can only export investigation objects as a stix report bundle.');
  }
  const investigatedEntitiesIds = workspace.investigated_entities_ids ?? [];
  const storeInvestigatedEntities = await storeLoadByIdsWithRefs(context, user, investigatedEntitiesIds, { indices: READ_STIX_INDICES });
  const stixReportForExport = buildStixReportForExport(workspace, storeInvestigatedEntities);
  const bundle = buildStixBundle([stixReportForExport, ...storeInvestigatedEntities.map((s) => convertStoreToStix(s))]);
  return JSON.stringify(bundle);
};

export const investigationAddFromContainer = async (context: AuthContext, user: AuthUser, containerId: string) => {
  const container = await internalLoadById<BasicStoreEntity>(context, user, containerId);
  const investigationToStartCanonicalName = `investigation from ${container.entity_type.toLowerCase()} "${container.name}" (${now()})`;
  const investigationInput = { type: 'investigation', name: investigationToStartCanonicalName, investigated_entities_ids: container.object };
  return addWorkspace(context, user, investigationInput);
};
