import {
  type AttributeDefinition,
  baseType,
  createdAt,
  creators,
  entityType,
  id,
  type IdAttribute,
  internalId,
  parentTypes,
  relationshipType,
  standardId,
  updatedAt
} from '../../schema/attribute-definition';
import { schemaAttributesDefinition } from '../../schema/schema-attributes';
import { ABSTRACT_BASIC_RELATIONSHIP } from '../../schema/general';
import {
  INSTANCE_FILTER_TARGET_TYPES,
  INSTANCE_RELATION_FILTER,
  RELATION_FROM_FILTER,
  RELATION_FROM_TYPES_FILTER,
  RELATION_TO_FILTER,
  RELATION_TO_TYPES_FILTER
} from '../../utils/filtering/filtering-constants';

export const connections: AttributeDefinition = {
  name: 'connections',
  label: 'Relations connections',
  type: 'object',
  format: 'nested',
  editDefault: false,
  mandatoryType: 'internal',
  multiple: true,
  upsert: false,
  update: false,
  isFilterable: false,
  mappings: [
    { ...internalId as IdAttribute,
      associatedFilterKeys: [
        { key: RELATION_FROM_FILTER, label: 'Source entity' },
        { key: RELATION_TO_FILTER, label: 'Target entity' },
        { key: INSTANCE_RELATION_FILTER, label: 'Related entity' }
      ]
    },
    { name: 'name', label: 'Name', type: 'string', format: 'short', editDefault: false, mandatoryType: 'no', multiple: true, upsert: true, isFilterable: false },
    { name: 'role', label: 'Role', type: 'string', format: 'short', editDefault: false, mandatoryType: 'no', multiple: true, upsert: true, isFilterable: false },
    { name: 'types', label: 'Types', type: 'string', format: 'short', editDefault: false, mandatoryType: 'no', multiple: true, upsert: true, isFilterable: false, associatedFilterKeys: [{ key: RELATION_FROM_TYPES_FILTER, label: 'Source type' }, { key: RELATION_TO_TYPES_FILTER, label: 'Target type' }, { key: INSTANCE_FILTER_TARGET_TYPES, label: 'Related type' }] },
  ],
};

const basicRelationshipAttributes: Array<AttributeDefinition> = [
  id,
  internalId,
  standardId,
  parentTypes,
  baseType,
  { ...relationshipType, isFilterable: false },
  entityType,
  createdAt,
  updatedAt,
  creators,
  { name: 'i_inference_weight', label: 'Inference weight', type: 'numeric', precision: 'integer', update: false, editDefault: false, mandatoryType: 'no', multiple: false, upsert: false, isFilterable: false },
  connections,
];
schemaAttributesDefinition.registerAttributes(ABSTRACT_BASIC_RELATIONSHIP, basicRelationshipAttributes);
