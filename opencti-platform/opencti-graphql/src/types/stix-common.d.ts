import { v4, v5 } from 'uuid';
import { STIX_EXT_OCTI, STIX_EXT_OCTI_SCO } from './stix-extensions';
import type { StixRelation, StixSighting } from './stix-sro';
import type { StixInternalExternalReference } from './stix-smo';

export type StixDate = string | undefined;
type StixId = `${string}--${v4 | v5}`;

export type StixBundle = {
  id: string;
  type: 'bundle'
  objects: StixObject[];
};

interface StixMitreExtension {
  'extension_type': 'property-extension' | 'new-sdo',
  id: string;
  detection: string;
  permissions_required: Array<string>;
  platforms: Array<string>;
  collection_layers: Array<string>;
}

interface StixFileExtension {
  name: string;
  uri: string;
  version: string;
  mime_type: string;
}

interface StixOpenctiExtension {
  extension_type : 'property-extension' | 'new-sdo' | 'new-sro';
  id: v4 | undefined;
  files: Array<StixFileExtension>;
  aliases: Array<string>;
  granted_refs: Array<StixId>;
  linked_to_refs: Array<StixId>;
  stix_ids: Array<StixId>;
  type: string;
  created_at: StixDate;
  updated_at: StixDate;
  is_inferred: boolean;
  workflow_id: string | undefined;
  assignee_ids: string[];
  participant_ids: string[];
  creator_ids: string[];
}

interface StixOpenctiExtensionSDO extends StixOpenctiExtension {
  extension_type : 'new-sdo';
}

interface StixObject {
  id: StixId;
  type: string;
  spec_version: string;
  // TODO Implement granular_markings
  extensions: {
    [STIX_EXT_OCTI] : StixOpenctiExtension;
  };
}

// --- STIX Core Objects
// SDO
interface StixDomainObject extends StixObject {
  created_by_ref: StixId | undefined; // optional
  created: StixDate;
  modified: StixDate;
  revoked: boolean; // optional
  labels: Array<string>; // optional
  confidence: number; // optional
  lang: string; // optional
  external_references?: Array<StixInternalExternalReference>;
  object_marking_refs: Array<StixId>; // optional
}

// SRO
interface StixRelationshipObject extends StixObject {
  created_by_ref: StixId | undefined; // optional
  created: StixDate;
  modified: StixDate;
  revoked: boolean; // optional
  labels: Array<string>; // optional
  confidence: number; // optional
  lang: string; // optional
  external_references?: Array<StixInternalExternalReference>; // optional
  object_marking_refs: Array<StixId>; // optional
}

// SCO
interface CyberObjectExtension {
  extension_type : 'property-extension',
  labels: Array<string>;
  description: string;
  score: number;
  created_by_ref: StixId | undefined;
  external_references: Array<StixInternalExternalReference>;
}

interface StixCyberObject extends StixObject {
  object_marking_refs: Array<StixId>; // optional
  defanged: boolean; // optional
  extensions: {
    [STIX_EXT_OCTI]: StixOpenctiExtension;
    [STIX_EXT_OCTI_SCO]: CyberObjectExtension
  };
}

// --- STIX Meta Objects

// Extension
interface StixContainerExtension extends StixOpenctiExtension {
  object_refs_inferred?: Array<StixId>; // optional
}

// Language Contents
// TODO Add support for Language Contents

// Markings
interface StixMarkingsObject extends StixObject {
  created_by_ref: StixId | undefined; // optional
  created: StixDate;
  modified: StixDate;
  external_references?: Array<StixInternalExternalReference>; // optional
  object_marking_refs: Array<StixId>; // optional
}

// Stix core definition
export type StixCoreObject = StixDomainObject | StixCyberObject | StixRelation | StixSighting;
