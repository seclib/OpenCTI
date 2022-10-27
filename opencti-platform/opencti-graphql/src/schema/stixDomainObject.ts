import * as R from 'ramda';
import {
  ABSTRACT_STIX_DOMAIN_OBJECT,
  buildRefRelationKey,
  ENTITY_TYPE_CONTAINER,
  ENTITY_TYPE_IDENTITY,
  ENTITY_TYPE_LOCATION,
  schemaTypes,
} from './general';
import {
  RELATION_CREATED_BY,
  RELATION_EXTERNAL_REFERENCE,
  RELATION_OBJECT,
  RELATION_OBJECT_LABEL,
  RELATION_OBJECT_MARKING,
} from './stixMetaRelationship';
import { RELATION_INDICATES } from './stixCoreRelationship';

export const ATTRIBUTE_NAME = 'name';
export const ATTRIBUTE_ABSTRACT = 'abstract';
export const ATTRIBUTE_EXPLANATION = 'explanation';
export const ATTRIBUTE_DESCRIPTION = 'description';
export const ATTRIBUTE_ALIASES = 'aliases';
export const ATTRIBUTE_ALIASES_OPENCTI = 'x_opencti_aliases';
export const ATTRIBUTE_ADDITIONAL_NAMES = 'x_opencti_additional_names';

export const ENTITY_TYPE_ATTACK_PATTERN = 'Attack-Pattern';
export const ENTITY_TYPE_CAMPAIGN = 'Campaign';
export const ENTITY_TYPE_CONTAINER_NOTE = 'Note';
export const ENTITY_TYPE_CONTAINER_OBSERVED_DATA = 'Observed-Data';
export const ENTITY_TYPE_CONTAINER_OPINION = 'Opinion';
export const ENTITY_TYPE_CONTAINER_REPORT = 'Report';
export const ENTITY_TYPE_CONTAINER_GROUPING = 'Grouping';
export const ENTITY_TYPE_COURSE_OF_ACTION = 'Course-Of-Action';
export const ENTITY_TYPE_IDENTITY_INDIVIDUAL = 'Individual';
export const ENTITY_TYPE_IDENTITY_ORGANIZATION = 'Organization';
export const ENTITY_TYPE_IDENTITY_SECTOR = 'Sector';
export const ENTITY_TYPE_IDENTITY_SYSTEM = 'System';
export const ENTITY_TYPE_INDICATOR = 'Indicator';
export const ENTITY_TYPE_INFRASTRUCTURE = 'Infrastructure';
export const ENTITY_TYPE_INTRUSION_SET = 'Intrusion-Set';
export const ENTITY_TYPE_LOCATION_CITY = 'City';
export const ENTITY_TYPE_LOCATION_COUNTRY = 'Country';
export const ENTITY_TYPE_LOCATION_REGION = 'Region';
export const ENTITY_TYPE_LOCATION_POSITION = 'Position';
export const ENTITY_TYPE_MALWARE = 'Malware';
export const ENTITY_TYPE_THREAT_ACTOR = 'Threat-Actor';
export const ENTITY_TYPE_TOOL = 'Tool';
export const ENTITY_TYPE_VULNERABILITY = 'Vulnerability';
export const ENTITY_TYPE_INCIDENT = 'Incident';

const STIX_DOMAIN_OBJECT_CONTAINERS: Array<string> = [
  ENTITY_TYPE_CONTAINER_NOTE,
  ENTITY_TYPE_CONTAINER_OBSERVED_DATA,
  ENTITY_TYPE_CONTAINER_OPINION,
  ENTITY_TYPE_CONTAINER_REPORT,
];

schemaTypes.register(ENTITY_TYPE_CONTAINER, STIX_DOMAIN_OBJECT_CONTAINERS);
export const isStixDomainObjectContainer = (type: string): boolean => {
  return R.includes(type, STIX_DOMAIN_OBJECT_CONTAINERS) || type === ENTITY_TYPE_CONTAINER;
};

const STIX_DOMAIN_OBJECT_IDENTITIES: Array<string> = [
  ENTITY_TYPE_IDENTITY_INDIVIDUAL,
  ENTITY_TYPE_IDENTITY_ORGANIZATION,
  ENTITY_TYPE_IDENTITY_SECTOR,
  ENTITY_TYPE_IDENTITY_SYSTEM,
];
schemaTypes.register(ENTITY_TYPE_IDENTITY, STIX_DOMAIN_OBJECT_IDENTITIES);
export const isStixDomainObjectIdentity = (type: string): boolean => {
  return R.includes(type, STIX_DOMAIN_OBJECT_IDENTITIES) || type === ENTITY_TYPE_IDENTITY;
};

const STIX_DOMAIN_OBJECT_LOCATIONS: Array<string> = [
  ENTITY_TYPE_LOCATION_CITY,
  ENTITY_TYPE_LOCATION_COUNTRY,
  ENTITY_TYPE_LOCATION_REGION,
  ENTITY_TYPE_LOCATION_POSITION,
];
schemaTypes.register(ENTITY_TYPE_LOCATION, STIX_DOMAIN_OBJECT_LOCATIONS);
export const isStixDomainObjectLocation = (type: string): boolean => {
  return R.includes(type, STIX_DOMAIN_OBJECT_LOCATIONS) || type === ENTITY_TYPE_LOCATION;
};

const STIX_DOMAIN_OBJECTS: Array<string> = [
  ENTITY_TYPE_ATTACK_PATTERN,
  ENTITY_TYPE_CAMPAIGN,
  ENTITY_TYPE_CONTAINER_NOTE,
  ENTITY_TYPE_CONTAINER_OBSERVED_DATA,
  ENTITY_TYPE_CONTAINER_OPINION,
  ENTITY_TYPE_CONTAINER_REPORT,
  ENTITY_TYPE_COURSE_OF_ACTION,
  ENTITY_TYPE_IDENTITY_INDIVIDUAL,
  ENTITY_TYPE_IDENTITY_ORGANIZATION,
  ENTITY_TYPE_IDENTITY_SECTOR,
  ENTITY_TYPE_IDENTITY_SYSTEM,
  ENTITY_TYPE_INDICATOR,
  ENTITY_TYPE_INFRASTRUCTURE,
  ENTITY_TYPE_INTRUSION_SET,
  ENTITY_TYPE_LOCATION_CITY,
  ENTITY_TYPE_LOCATION_COUNTRY,
  ENTITY_TYPE_LOCATION_REGION,
  ENTITY_TYPE_LOCATION_POSITION,
  ENTITY_TYPE_MALWARE,
  ENTITY_TYPE_THREAT_ACTOR,
  ENTITY_TYPE_TOOL,
  ENTITY_TYPE_VULNERABILITY,
  ENTITY_TYPE_INCIDENT,
];
export const registerStixDomainType = (type: string) => {
  STIX_DOMAIN_OBJECTS.push(type);
};

schemaTypes.register(ABSTRACT_STIX_DOMAIN_OBJECT, STIX_DOMAIN_OBJECTS);
export const isStixDomainObject = (type: string): boolean => {
  return R.includes(type, STIX_DOMAIN_OBJECTS)
  || isStixDomainObjectIdentity(type)
  || isStixDomainObjectLocation(type)
  || isStixDomainObjectContainer(type)
  || type === ABSTRACT_STIX_DOMAIN_OBJECT;
};

const STIX_DOMAIN_OBJECT_ALIASED: Array<string> = [
  ENTITY_TYPE_COURSE_OF_ACTION,
  ENTITY_TYPE_ATTACK_PATTERN,
  ENTITY_TYPE_CAMPAIGN,
  ENTITY_TYPE_INFRASTRUCTURE,
  ENTITY_TYPE_INTRUSION_SET,
  ENTITY_TYPE_MALWARE,
  ENTITY_TYPE_THREAT_ACTOR,
  ENTITY_TYPE_TOOL,
  ENTITY_TYPE_INCIDENT,
  ENTITY_TYPE_VULNERABILITY,
];
export const registerStixDomainAliased = (type: string) => {
  STIX_DOMAIN_OBJECT_ALIASED.push(type);
};
export const isStixObjectAliased = (type: string): boolean => {
  return R.includes(type, STIX_DOMAIN_OBJECT_ALIASED) || isStixDomainObjectIdentity(type) || isStixDomainObjectLocation(type);
};
export const resolveAliasesField = (type: string): string => {
  if (type === ENTITY_TYPE_COURSE_OF_ACTION || type === ENTITY_TYPE_VULNERABILITY || isStixDomainObjectIdentity(type) || isStixDomainObjectLocation(type)) {
    return ATTRIBUTE_ALIASES_OPENCTI;
  }
  return ATTRIBUTE_ALIASES;
};

export const stixDomainObjectOptions = {
  StixDomainObjectsFilter: {
    createdBy: buildRefRelationKey(RELATION_CREATED_BY),
    markedBy: buildRefRelationKey(RELATION_OBJECT_MARKING),
    labelledBy: buildRefRelationKey(RELATION_OBJECT_LABEL),
    objectContains: buildRefRelationKey(RELATION_OBJECT),
    containedBy: buildRefRelationKey(RELATION_OBJECT),
    hasExternalReference: buildRefRelationKey(RELATION_EXTERNAL_REFERENCE),
    indicates: buildRefRelationKey(RELATION_INDICATES),
  },
};

const stixDomainObjectFieldsToBeUpdated: { [k: string]: Array<string> } = {
  [ENTITY_TYPE_ATTACK_PATTERN]: [
    'name',
    'revoked',
    'description',
    'x_mitre_id',
    'x_mitre_platforms',
    'x_mitre_permissions_required',
    'x_mitre_detection',
    'confidence',
    'aliases',
  ],
  [ENTITY_TYPE_CAMPAIGN]: ['name', 'revoked', 'description', 'first_seen', 'last_seen', 'confidence', 'aliases'],
  [ENTITY_TYPE_CONTAINER_NOTE]: ['content', 'confidence', 'attribute_abstract'],
  [ENTITY_TYPE_CONTAINER_OBSERVED_DATA]: ['description', 'confidence'],
  [ENTITY_TYPE_CONTAINER_OPINION]: ['opinion', 'confidence', 'explanation'],
  [ENTITY_TYPE_CONTAINER_REPORT]: ['name', 'revoked', 'description', 'confidence', 'confidence'],
  [ENTITY_TYPE_COURSE_OF_ACTION]: [
    'name',
    'revoked',
    'description',
    'x_mitre_id',
    'x_opencti_threat_hunting',
    'x_opencti_log_sources',
    'confidence',
    'x_opencti_aliases'
  ],
  [ENTITY_TYPE_IDENTITY_INDIVIDUAL]: ['name', 'revoked', 'description', 'contact_information', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_IDENTITY_ORGANIZATION]: ['name', 'revoked', 'description', 'contact_information', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_IDENTITY_SECTOR]: ['name', 'revoked', 'description', 'contact_information', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_IDENTITY_SYSTEM]: ['name', 'revoked', 'description', 'contact_information', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_INDICATOR]: [
    'name',
    'revoked',
    'description',
    'valid_from',
    'valid_until',
    'confidence',
    'indicator_types',
    'x_opencti_score',
    'x_opencti_detection',
    'x_mitre_platforms',
    'x_opencti_main_observable_type',
  ],
  [ENTITY_TYPE_INFRASTRUCTURE]: ['name', 'revoked', 'description', 'confidence', 'aliases'],
  [ENTITY_TYPE_INTRUSION_SET]: [
    'name',
    'revoked',
    'description',
    'first_seen',
    'last_seen',
    'goals',
    'resource_level',
    'primary_motivation',
    'secondary_motivations',
    'confidence',
    'aliases'
  ],
  [ENTITY_TYPE_LOCATION_CITY]: ['name', 'revoked', 'description', 'latitude', 'longitude', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_LOCATION_COUNTRY]: ['name', 'revoked', 'description', 'latitude', 'longitude', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_LOCATION_REGION]: ['name', 'revoked', 'description', 'latitude', 'longitude', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_LOCATION_POSITION]: ['name', 'revoked', 'description', 'latitude', 'longitude', 'confidence', 'x_opencti_aliases'],
  [ENTITY_TYPE_MALWARE]: ['name', 'revoked', 'description', 'first_seen', 'last_seen', 'is_family', 'malware_types', 'confidence', 'aliases'],
  [ENTITY_TYPE_THREAT_ACTOR]: [
    'name',
    'revoked',
    'description',
    'first_seen',
    'last_seen',
    'goals',
    'roles',
    'resource_level',
    'primary_motivation',
    'secondary_motivations',
    'confidence',
    'aliases'
  ],
  [ENTITY_TYPE_TOOL]: ['name', 'revoked', 'description', 'confidence', 'aliases'],
  [ENTITY_TYPE_VULNERABILITY]: [
    'name',
    'revoked',
    'description',
    'x_opencti_base_score',
    'x_opencti_base_severity',
    'x_opencti_attack_vector',
    'x_opencti_integrity_impact',
    'x_opencti_availability_impact',
    'x_opencti_confidentiality_impact',
    'confidence',
    'x_opencti_aliases',
  ],
  [ENTITY_TYPE_INCIDENT]: ['name', 'revoked', 'description', 'first_seen', 'last_seen', 'objective', 'confidence', 'aliases'],
};
R.forEachObjIndexed((value, key) => schemaTypes.registerUpsertAttributes(key, value), stixDomainObjectFieldsToBeUpdated);

const stixDomainObjectsAttributes: { [k: string]: Array<string> } = {
  [ENTITY_TYPE_ATTACK_PATTERN]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'x_mitre_platforms',
    'x_mitre_permissions_required',
    'x_mitre_detection',
    'x_mitre_id',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_CAMPAIGN]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'first_seen',
    'i_first_seen_day',
    'i_first_seen_month',
    'i_first_seen_year',
    'last_seen',
    'i_last_seen_day',
    'i_last_seen_month',
    'i_last_seen_year',
    'objective',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_CONTAINER_NOTE]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'abstract',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'attribute_abstract',
    'content',
    'authors',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_CONTAINER_OBSERVED_DATA]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'first_observed',
    'last_observed',
    'number_observed',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_CONTAINER_OPINION]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'explanation',
    'authors',
    'opinion',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_CONTAINER_REPORT]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'report_types',
    'published',
    'i_published_day',
    'i_published_year',
    'i_published_month',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_COURSE_OF_ACTION]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_mitre_id',
    'x_opencti_threat_hunting',
    'x_opencti_log_sources',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_IDENTITY_INDIVIDUAL]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'contact_information',
    'identity_class',
    'roles',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_firstname',
    'x_opencti_lastname',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_IDENTITY_ORGANIZATION]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'contact_information',
    'identity_class',
    'roles',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_organization_type',
    'x_opencti_reliability',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_IDENTITY_SECTOR]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'contact_information',
    'identity_class',
    'roles',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_IDENTITY_SYSTEM]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'contact_information',
    'identity_class',
    'roles',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_INDICATOR]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'pattern_type',
    'pattern_version',
    'pattern',
    'name',
    'description',
    'indicator_types',
    'valid_from',
    'i_valid_from_day',
    'i_valid_from_month',
    'i_valid_from_year',
    'valid_until',
    'i_valid_until_day',
    'i_valid_until_month',
    'i_valid_until_year',
    'x_opencti_score',
    'x_opencti_detection',
    'x_opencti_main_observable_type',
    'x_mitre_platforms',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_INFRASTRUCTURE]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'infrastructure_types',
    'first_seen',
    'i_first_seen_day',
    'i_first_seen_month',
    'i_first_seen_year',
    'last_seen',
    'i_last_seen_day',
    'i_last_seen_month',
    'i_last_seen_year',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_INTRUSION_SET]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'first_seen',
    'i_first_seen_day',
    'i_first_seen_month',
    'i_first_seen_year',
    'last_seen',
    'i_last_seen_day',
    'i_last_seen_month',
    'i_last_seen_year',
    'goals',
    'resource_level',
    'primary_motivation',
    'secondary_motivations',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_LOCATION_CITY]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'latitude',
    'longitude',
    'precision',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_location_type',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_LOCATION_COUNTRY]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'latitude',
    'longitude',
    'precision',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_location_type',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_LOCATION_REGION]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'latitude',
    'longitude',
    'precision',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_location_type',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_LOCATION_POSITION]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'latitude',
    'longitude',
    'precision',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_location_type',
    'street_address',
    'postal_code',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_MALWARE]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'malware_types',
    'is_family',
    'first_seen',
    'i_first_seen_day',
    'i_first_seen_month',
    'i_first_seen_year',
    'last_seen',
    'i_last_seen_day',
    'i_last_seen_month',
    'i_last_seen_year',
    'architecture_execution_envs',
    'implementation_languages',
    'capabilities',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_THREAT_ACTOR]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'threat_actor_types',
    'first_seen',
    'i_first_seen_day',
    'i_first_seen_month',
    'i_first_seen_year',
    'last_seen',
    'i_last_seen_day',
    'i_last_seen_month',
    'i_last_seen_year',
    'goals',
    'roles',
    'sophistication',
    'resource_level',
    'primary_motivation',
    'secondary_motivations',
    'personal_motivations',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_TOOL]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'tool_types',
    'tool_version',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_VULNERABILITY]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'x_opencti_aliases',
    'i_aliases_ids',
    'x_opencti_base_score',
    'x_opencti_base_severity',
    'x_opencti_attack_vector',
    'x_opencti_integrity_impact',
    'x_opencti_availability_impact',
    'x_opencti_confidentiality_impact',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
  [ENTITY_TYPE_INCIDENT]: [
    'internal_id',
    'standard_id',
    'entity_type',
    'x_opencti_stix_ids',
    'spec_version',
    'created_at',
    'i_created_at_day',
    'i_created_at_month',
    'i_created_at_year',
    'updated_at',
    'revoked',
    'confidence',
    'lang',
    'created',
    'modified',
    'name',
    'description',
    'aliases',
    'i_aliases_ids',
    'first_seen',
    'i_first_seen_day',
    'i_first_seen_month',
    'i_first_seen_year',
    'last_seen',
    'i_last_seen_day',
    'i_last_seen_month',
    'i_last_seen_year',
    'objective',
    'x_opencti_graph_data',
    'x_opencti_workflow_id',
  ],
};
R.forEachObjIndexed((value, key) => schemaTypes.registerAttributes(key, value), stixDomainObjectsAttributes);
