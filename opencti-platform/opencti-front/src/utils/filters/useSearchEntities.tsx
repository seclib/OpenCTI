import * as R from 'ramda';
import { Dispatch, useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { markingDefinitionsLinesSearchQuery } from '@components/settings/marking_definitions/MarkingDefinitionsLines';
import { identitySearchCreatorsSearchQuery, identitySearchIdentitiesSearchQuery } from '@components/common/identities/IdentitySearch';
import { stixDomainObjectsLinesSearchQuery } from '@components/common/stix_domain_objects/StixDomainObjectsLines';
import { killChainPhasesLinesSearchQuery } from '@components/settings/kill_chain_phases/KillChainPhasesLines';
import { labelsSearchQuery } from '@components/settings/LabelsQuery';
import { attributesSearchQuery } from '@components/settings/AttributesQuery';
import { statusFieldStatusesSearchQuery } from '@components/common/form/StatusField';
import { vocabularySearchQuery } from '@components/settings/VocabularyQuery';
import { objectAssigneeFieldAssigneesSearchQuery, objectAssigneeFieldMembersSearchQuery } from '@components/common/form/ObjectAssigneeField';
import { IdentitySearchIdentitiesSearchQuery$data } from '@components/common/identities/__generated__/IdentitySearchIdentitiesSearchQuery.graphql';
import { IdentitySearchCreatorsSearchQuery$data } from '@components/common/identities/__generated__/IdentitySearchCreatorsSearchQuery.graphql';
import { ObjectAssigneeFieldAssigneesSearchQuery$data } from '@components/common/form/__generated__/ObjectAssigneeFieldAssigneesSearchQuery.graphql';
import { StixDomainObjectsLinesSearchQuery$data } from '@components/common/stix_domain_objects/__generated__/StixDomainObjectsLinesSearchQuery.graphql';
import { MarkingDefinitionsLinesSearchQuery$data } from '@components/settings/marking_definitions/__generated__/MarkingDefinitionsLinesSearchQuery.graphql';
import { KillChainPhasesLinesSearchQuery$data } from '@components/settings/kill_chain_phases/__generated__/KillChainPhasesLinesSearchQuery.graphql';
import { LabelsQuerySearchQuery$data } from '@components/settings/__generated__/LabelsQuerySearchQuery.graphql';
import { AttributesQuerySearchQuery$data } from '@components/settings/__generated__/AttributesQuerySearchQuery.graphql';
import { StatusFieldStatusesSearchQuery$data } from '@components/common/form/__generated__/StatusFieldStatusesSearchQuery.graphql';
import { VocabularyQuery$data } from '@components/settings/__generated__/VocabularyQuery.graphql';
import { ObjectAssigneeFieldMembersSearchQuery$data } from '@components/common/form/__generated__/ObjectAssigneeFieldMembersSearchQuery.graphql';
import { ObjectParticipantFieldParticipantsSearchQuery$data } from '@components/common/form/__generated__/ObjectParticipantFieldParticipantsSearchQuery.graphql';
import { objectParticipantFieldParticipantsSearchQuery } from '@components/common/form/ObjectParticipantField';
import { useTheme } from '@mui/styles';
import { graphql } from 'react-relay';
import { buildScaleFilters } from '../hooks/useScale';
import useAuth from '../hooks/useAuth';
import { useSearchEntitiesStixCoreObjectsSearchQuery$data } from './__generated__/useSearchEntitiesStixCoreObjectsSearchQuery.graphql';
import { vocabCategoriesQuery } from '../hooks/useVocabularyCategory';
import { useFormatter } from '../../components/i18n';
import { defaultValue } from '../Graph';
import { fetchQuery } from '../../relay/environment';
import { useVocabularyCategoryQuery$data } from '../hooks/__generated__/useVocabularyCategoryQuery.graphql';
import { useSearchEntitiesStixCoreObjectsContainersSearchQuery$data } from './__generated__/useSearchEntitiesStixCoreObjectsContainersSearchQuery.graphql';
import { isNotEmptyField } from '../utils';
import { useSearchEntitiesSchemaSCOSearchQuery$data } from './__generated__/useSearchEntitiesSchemaSCOSearchQuery.graphql';
import { Theme } from '../../components/Theme';

const filtersStixCoreObjectsContainersSearchQuery = graphql`
    query useSearchEntitiesStixCoreObjectsContainersSearchQuery(
        $search: String
        $filters: FilterGroup
    ) {
        containers(search: $search, filters: $filters) {
            edges {
                node {
                    id
                    entity_type
                    parent_types
                    representative {
                        main
                    }
                }
            }
        }
    }
`;

const filtersStixCoreObjectsSearchQuery = graphql`
    query useSearchEntitiesStixCoreObjectsSearchQuery(
        $search: String
        $types: [String]
        $count: Int
        $filters: FilterGroup
    ) {
        stixCoreObjects(
            search: $search
            types: $types
            first: $count
            filters: $filters
        ) {
            edges {
                node {
                    id
                    entity_type
                    parent_types
                    ... on AttackPattern {
                        name
                        description
                        x_mitre_id
                    }
                    ... on Note {
                        attribute_abstract
                        content
                    }
                    ... on ObservedData {
                        first_observed
                        last_observed
                    }
                    ... on Opinion {
                        opinion
                    }
                    ... on Report {
                        name
                    }
                    ... on Grouping {
                        name
                    }
                    ... on Campaign {
                        name
                        description
                    }
                    ... on CourseOfAction {
                        name
                        description
                    }
                    ... on Individual {
                        name
                        description
                    }
                    ... on Organization {
                        name
                        description
                    }
                    ... on Sector {
                        name
                        description
                    }
                    ... on System {
                        name
                        description
                    }
                    ... on Indicator {
                        name
                        description
                    }
                    ... on Infrastructure {
                        name
                        description
                    }
                    ... on IntrusionSet {
                        name
                        description
                    }
                    ... on Position {
                        name
                        description
                    }
                    ... on City {
                        name
                        description
                    }
                    ... on AdministrativeArea {
                        name
                        description
                    }
                    ... on Country {
                        name
                        description
                    }
                    ... on Region {
                        name
                        description
                    }
                    ... on Malware {
                        name
                        description
                    }
                    ... on MalwareAnalysis {
                        product
                        operatingSystem {
                            name
                        }
                    }
                    ... on ThreatActor {
                        name
                        description
                    }
                    ... on Tool {
                        name
                        description
                    }
                    ... on Vulnerability {
                        name
                        description
                    }
                    ... on Incident {
                        name
                        description
                    }
                    ... on Event {
                        name
                        description
                    }
                    ... on Channel {
                        name
                        description
                    }
                    ... on Narrative {
                        name
                        description
                    }
                    ... on DataComponent {
                        name
                    }
                    ... on DataSource {
                        name
                    }
                    ... on Case {
                        name
                    }
                    ... on Task {
                        name
                    }
                    ... on Language {
                        name
                    }
                    ... on StixCyberObservable {
                        observable_value
                    }
                    createdBy {
                        ... on Identity {
                            id
                            name
                            entity_type
                        }
                    }
                    objectMarking {
                        edges {
                            node {
                                id
                                definition_type
                                definition
                                x_opencti_order
                                x_opencti_color
                            }
                        }
                    }
                }
            }
        }
    }
`;

const filtersSchemaSCOSearchQuery = graphql`
    query useSearchEntitiesSchemaSCOSearchQuery {
        schemaSCOs: subTypes(type: "Stix-Cyber-Observable") {
            edges {
                node {
                    id
                    label
                }
            }
        }
    }
`;

export interface EntityValue {
  label?: string | null;
  value?: string | null;
  type?: string;
  group?: string;
  color?: string | null;
}

interface EntityWithLabelValue {
  label: string;
  value: string;
  type: string;
}

export interface SearchEntitiesProps {
  availableEntityTypes?: string[];
  availableRelationshipTypes?: string[];
  searchContext: { entityTypes: string[]; elementId?: string[] };
  searchScope: Record<string, string[]>;
  setInputValues: (value: { key: string, values: string[], operator?: string }[]) => void;
  allEntityTypes?: boolean;
}

const useSearchEntities = ({
  availableEntityTypes,
  availableRelationshipTypes,
  searchContext,
  searchScope,
  setInputValues,
  allEntityTypes,
}: {
  availableEntityTypes?: string[];
  availableRelationshipTypes?: string[];
  searchContext: { entityTypes: string[]; elementId?: string[] };
  searchScope: Record<string, string[]>;
  setInputValues: (
    value: { key: string; values: string[]; operator?: string }[],
  ) => void;
  allEntityTypes?: boolean;
}) => {
  const [entities, setEntities] = useState<Record<string, EntityValue[]>>({});
  const { t } = useFormatter();
  const { schema } = useAuth();
  const theme = useTheme() as Theme;

  const unionSetEntities = (key: string, newEntities: EntityValue[]) => setEntities((c) => ({
    ...c,
    [key]: [...newEntities, ...(c[key] ?? [])].filter(
      ({ value, group }, index, arr) => arr.findIndex((v) => v.value === value && v.group === group)
        === index,
    ),
  }));

  const entityType = searchContext?.entityTypes?.length > 0
    ? searchContext.entityTypes[0]
    : null;
  const confidences = buildScaleFilters(entityType, 'confidence');

  const searchEntities = (
    filterKey: string,
    cacheEntities: Record< string, { label: string; value: string; type: string }[] >,
    setCacheEntities: Dispatch< Record<string, { label: string; value: string; type: string }[]> >,
    event: SelectChangeEvent<string | number>,
  ) => {
    if (!event) {
      return;
    }

    const baseScores = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const scores = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
    const likelihoods = ['0', '15', '50', '75', '85'];

    const newInputValue = {
      key: filterKey,
      values: event.target.value && event.target.value !== 0 ? [event.target.value?.toString()] : [],
      operator: 'eq',
    };
    setInputValues([newInputValue]);

    // fetches vocabularies by categories and add them to the set
    const runVocabularySearchQuery = (key: string, filterCategories: string[]) => {
      const filters = {
        mode: 'or',
        filters: [
          { key: 'category', values: filterCategories, operator: 'eq', mode: 'or' },
        ],
        filterGroups: [],
      };
      fetchQuery(vocabularySearchQuery, {
        filters,
        search: event.target.value !== 0 ? event.target.value : '',
        first: 10,
      })
        .toPromise()
        .then((data) => {
          const entityValues = (
            ((data as VocabularyQuery$data)?.vocabularies?.edges ?? []).map((n) => ({
              label: n?.node.name,
              value: n?.node.name,
              type: 'Vocabulary',
            })));
          unionSetEntities(key, entityValues);
        });
    };

    // fetches runtime attributes by name and add them to the set
    // this query returns only the attributes used somewhere
    const runAttributesSearchQuery = (attributeName: string) => {
      fetchQuery(attributesSearchQuery, {
        attributeName,
        search: event.target.value !== 0 ? event.target.value : '',
        first: 10,
      })
        .toPromise()
        .then((data) => {
          const sourceEntities = (
            (data as AttributesQuerySearchQuery$data)?.runtimeAttributes
              ?.edges ?? []
          ).map((n) => ({
            label: n?.node.value,
            value: n?.node.value,
            type: 'Vocabulary',
          }));
          unionSetEntities(attributeName, sourceEntities);
        });
    };

    // fetches identities by types and add them to the set
    const runIdentitySearchQuery = (key: string, types: string[]) => {
      fetchQuery(identitySearchIdentitiesSearchQuery, {
        types,
        search: event.target.value !== 0 ? event.target.value : '',
        first: 10,
      })
        .toPromise()
        .then((data) => {
          const createdByEntities = (
            (data as IdentitySearchIdentitiesSearchQuery$data)?.identities
              ?.edges ?? []
          ).map((n) => ({
            label: n?.node.name,
            value: n?.node.id,
            type: n?.node.entity_type,
          }));
          unionSetEntities(key, createdByEntities);
        });
    };

    // fetches members by types and add them to the set
    const runMembersSearchQuery = (key: string, entityTypes: string[]) => {
      fetchQuery(objectAssigneeFieldMembersSearchQuery, {
        search: event.target.value !== 0 ? event.target.value : '',
        entityTypes,
        first: 10,
      })
        .toPromise()
        .then((data) => {
          const membersEntities = (
            (data as ObjectAssigneeFieldMembersSearchQuery$data)?.members
              ?.edges ?? []
          ).map((n) => ({
            label: n?.node.name,
            value: n?.node.id,
            type: n?.node.entity_type,
          }));
          unionSetEntities(key, membersEntities);
        });
    };

    // depending on filter key, fetch the right data and build the options list
    switch (filterKey) {
      // region member global
      case 'members_user': // All groups, only for granted users
        runMembersSearchQuery('members_user', ['User']);
        break;
      case 'members_group': // All groups, only for granted users
        runMembersSearchQuery('members_group', ['Group']);
        break;
      case 'members_organization': // All groups, only for granted users
        runMembersSearchQuery('members_organization', ['Organization']);
        break;
        // endregion

      // region user usage (with caching)
      case 'creator_id':
      case 'contextCreator':
        if (!cacheEntities[filterKey]) {
          fetchQuery(identitySearchCreatorsSearchQuery, {
            entityTypes: searchContext?.entityTypes ?? [],
          })
            .toPromise()
            .then((data) => {
              const creators = (
                (data as IdentitySearchCreatorsSearchQuery$data)?.creators
                  ?.edges ?? []
              ).map((n) => ({
                label: n?.node.name ?? '',
                value: n?.node.id ?? '',
                type: 'Individual',
              }));
              const myself = (data as IdentitySearchCreatorsSearchQuery$data).me;
              if (!creators.find((usr) => usr.value === myself.id)) {
                creators.push({
                  label: myself.name,
                  value: myself.id,
                  type: 'Individual',
                });
              }

              setCacheEntities({ ...cacheEntities, [filterKey]: creators });
              unionSetEntities(filterKey, creators);
            });
        }
        break;
      case 'objectAssignee': // only used
        if (!cacheEntities[filterKey]) {
          fetchQuery(objectAssigneeFieldAssigneesSearchQuery, {
            entityTypes: searchContext?.entityTypes ?? [],
          })
            .toPromise()
            .then((data) => {
              const objectAssigneeEntities = (
                (data as ObjectAssigneeFieldAssigneesSearchQuery$data)
                  ?.assignees?.edges ?? []
              ).map((n) => ({
                label: n?.node.name ?? '',
                value: n?.node.id ?? '',
                type: 'User',
              }));
              // always add myself to the possible assignees (to be able to add a trigger even if I have not yet any assignment)
              const myself = (data as ObjectAssigneeFieldAssigneesSearchQuery$data).me;
              if (!objectAssigneeEntities.find((usr) => usr.value === myself.id)) {
                objectAssigneeEntities.push({
                  label: myself.name,
                  value: myself.id,
                  type: 'User',
                });
              }
              setCacheEntities({
                ...cacheEntities,
                [filterKey]: objectAssigneeEntities,
              });
              unionSetEntities('objectAssignee', objectAssigneeEntities);
            });
        }
        break;
      case 'objectParticipant': // only used
        if (!cacheEntities[filterKey]) {
          fetchQuery(objectParticipantFieldParticipantsSearchQuery, {
            entityTypes: searchContext?.entityTypes ?? [],
          })
            .toPromise()
            .then((data) => {
              const participantToEntities = (
                (data as ObjectParticipantFieldParticipantsSearchQuery$data)
                  ?.participants?.edges ?? []
              ).map((n) => ({
                label: n?.node.name ?? '',
                value: n?.node.id ?? '',
                type: 'User',
              }));
              const myself = (data as ObjectParticipantFieldParticipantsSearchQuery$data).me;
              if (!participantToEntities.find((usr) => usr.value === myself.id)) {
                participantToEntities.push({
                  label: myself.name,
                  value: myself.id,
                  type: 'User',
                });
              }
              setCacheEntities({
                ...cacheEntities,
                [filterKey]: participantToEntities,
              });
              unionSetEntities('objectParticipant', participantToEntities);
            });
        }
        break;
        // endregion

      case 'createdBy':
      case 'contextCreatedBy':
        runIdentitySearchQuery('contextCreatedBy', ['Organization', 'Individual', 'System']);
        break;
      case 'toSightingId':
        runIdentitySearchQuery('toSightingId', ['Identity']);
        break;
      case 'sightedBy':
        fetchQuery(stixDomainObjectsLinesSearchQuery, {
          types: ['Sector', 'Organization', 'Individual', 'Region', 'Country', 'City'],
          search: event.target.value !== 0 ? event.target.value : '',
          count: 10,
        })
          .toPromise()
          .then((data) => {
            const sightedByEntities = (
              (data as StixDomainObjectsLinesSearchQuery$data)
                ?.stixDomainObjects?.edges ?? []
            ).map((n) => ({
              label: n?.node.name,
              value: n?.node.id,
              type: n?.node.entity_type,
            }));
            unionSetEntities('sightedBy', sightedByEntities);
          });
        break;
      case 'elementId':
      case 'contextEntityId':
      case 'connectedToId':
      case 'fromId':
      case 'toId':
      case 'targets':
      case 'objects':
      case 'indicates':
        fetchQuery(filtersStixCoreObjectsSearchQuery, {
          types: (searchScope && searchScope[filterKey]) || ['Stix-Core-Object'],
          search: event.target.value !== 0 ? event.target.value : '',
          count: 100,
        })
          .toPromise()
          .then((data) => {
            const elementIdEntities = (
              (data as useSearchEntitiesStixCoreObjectsSearchQuery$data)
                ?.stixCoreObjects?.edges ?? []
            ).map((n) => ({
              label: defaultValue(n?.node),
              value: n?.node.id,
              type: n?.node.entity_type,
              parentTypes: n?.node.parent_types,
            }));
            unionSetEntities(filterKey, elementIdEntities);
          });
        break;
      case 'containers': {
        const filters = [];
        if (searchContext?.elementId) filters.push({ key: 'objects', values: [searchContext?.elementId] });
        if (availableEntityTypes) filters.push({ key: 'entity_type', values: availableEntityTypes });
        fetchQuery(filtersStixCoreObjectsContainersSearchQuery, {
          search: event.target.value !== 0 ? event.target.value : '',
          count: 50,
          filters: {
            mode: 'and',
            filters,
            filterGroups: [],
          },
        })
          .toPromise()
          .then((data) => {
            const containerEntities = (
              (
                data as useSearchEntitiesStixCoreObjectsContainersSearchQuery$data
              )?.containers?.edges ?? []
            ).map((n) => ({
              label: n?.node.representative.main,
              value: n?.node.id,
              type: n?.node.entity_type,
              parentTypes: n?.node.parent_types,
            }));
            unionSetEntities('containers', containerEntities);
          });
        break;
      }
      case 'objectMarking':
      case 'contextObjectMarking':
        fetchQuery(markingDefinitionsLinesSearchQuery, {
          search: event.target.value !== 0 ? event.target.value : '',
        })
          .toPromise()
          .then((data) => {
            const markedByEntities = (
              (data as MarkingDefinitionsLinesSearchQuery$data)
                ?.markingDefinitions?.edges ?? []
            ).map((n) => ({
              label: n?.node.definition,
              value: n?.node.id,
              type: 'Marking-Definition',
              color: n?.node.x_opencti_color,
            }));
            unionSetEntities(filterKey, markedByEntities);
          });
        break;
      case 'killChainPhases':
        fetchQuery(killChainPhasesLinesSearchQuery, {
          search: event.target.value !== 0 ? event.target.value : '',
          first: 10,
        })
          .toPromise()
          .then((data) => {
            const killChainPhaseEntities = (
              (data as KillChainPhasesLinesSearchQuery$data)?.killChainPhases
                ?.edges ?? []
            ).map((n) => ({
              label: n
                ? `[${n.node.kill_chain_name}] ${n.node.phase_name}`
                : '',
              value: n?.node.id,
              type: 'Kill-Chain-Phase',
            }));
            unionSetEntities('killChainPhases', killChainPhaseEntities);
          });
        break;
      case 'objectLabel':
      case 'contextObjectLabel':
        fetchQuery(labelsSearchQuery, {
          search: event.target.value !== 0 ? event.target.value : '',
          first: 10,
        })
          .toPromise()
          .then((data) => {
            const objectLabelEntities = (
              (data as LabelsQuerySearchQuery$data)?.labels?.edges ?? []
            ).map((n) => ({
              label: n?.node.value,
              value: n?.node.id,
              type: 'Label',
              color: n?.node.color,
            }));
            unionSetEntities(filterKey, [
              {
                label: t('No label'),
                value: null,
                type: 'Label',
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              },
              ...objectLabelEntities,
            ]);
          });
        break;
      case 'x_opencti_base_score': {
        const baseScoreEntities = ['lte', 'gt'].flatMap((group) => baseScores.map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
          group,
        })));
        unionSetEntities('x_opencti_base_score', baseScoreEntities);
        break;
      }
      // region confidence
      case 'confidence': {
        const confidenceEntities = ['lte', 'gt'].flatMap((group) => confidences.map((n) => ({
          label: n.label,
          value: n.value,
          type: 'Vocabulary',
          color: n.color,
          group,
        })));
        unionSetEntities('confidence', confidenceEntities);
        break;
      }
      case 'confidence_gt': {
        const confidenceEntitiesGt = confidences.map((n) => ({
          label: n.label,
          value: n.value,
          type: 'Vocabulary',
          color: n.color,
        }));
        unionSetEntities('confidence_gt', confidenceEntitiesGt);
        break;
      }
      case 'confidence_lte': {
        const confidenceLteEntities = confidences.map((n) => ({
          label: n.label,
          value: n.value,
          type: 'Vocabulary',
          color: n.color,
        }));
        unionSetEntities('confidence_lte', confidenceLteEntities);
        break;
      }
      // endregion
      // region likelihood
      case 'likelihood': {
        const likelihoodEntities = ['lte', 'gt'].flatMap((group) => likelihoods.map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
          group,
        })));
        unionSetEntities('likelihood', likelihoodEntities);
        break;
      }
      case 'likelihood_gt': {
        const likelihoodEntitiesGt = likelihoods.map((n) => ({
          label: t(`likelihood_${n.toString()}`),
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('likelihood_gt', likelihoodEntitiesGt);
        break;
      }
      case 'likelihood_lte': {
        const likelihoodLteEntities = likelihoods.map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('likelihood_lte', likelihoodLteEntities);
        break;
      }
      // endregion
      // region x_opencti_score
      case 'x_opencti_score': {
        const scoreEntities = ['lte', 'gt'].flatMap((group) => scores.map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
          group,
        })));
        unionSetEntities('x_opencti_score', scoreEntities);
        break;
      }
      case 'x_opencti_score_gt': {
        const scoreGtEntities = scores.map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('x_opencti_score_gt', scoreGtEntities);
        break;
      }
      case 'x_opencti_score_lte': {
        const scoreLteEntities = scores.map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('x_opencti_score_lte', scoreLteEntities);
        break;
      }
      // endregion
      case 'x_opencti_detection': {
        const detectionEntities = ['true', 'false'].map((n) => ({
          label: t(n),
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('x_opencti_detection', detectionEntities);
        break;
      }
      case 'based-on': {
        fetchQuery(filtersStixCoreObjectsSearchQuery, {
          types: (searchScope && searchScope[filterKey]) || [
            'Stix-Cyber-Observable',
          ],
          search: event.target.value !== 0 ? event.target.value : '',
          count: 100,
        })
          .toPromise()
          .then((data) => {
            const elementIdEntities = (
              (data as useSearchEntitiesStixCoreObjectsSearchQuery$data)
                ?.stixCoreObjects?.edges ?? []
            ).map((n) => ({
              label: defaultValue(n?.node),
              value: n?.node.id,
              type: n?.node.entity_type,
              parentTypes: n?.node.parent_types,
            }));
            unionSetEntities(filterKey, elementIdEntities);
          });
        break;
      }
      case 'revoked': {
        const revokedEntities = ['true', 'false'].map((n) => ({
          label: t(n),
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('revoked', revokedEntities);
        break;
      }
      case 'trigger_type': {
        const isTriggerTypeEntities = ['digest', 'live'].map((n) => ({
          label: t(n),
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('trigger_type', isTriggerTypeEntities);
        break;
      }
      case 'instance_trigger': {
        const isInstanceTrigger = ['true', 'false'].map((n) => ({
          label: t(n),
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('instance_trigger', isInstanceTrigger);
        break;
      }
      case 'is_read': {
        const isReadEntities = ['true', 'false'].map((n) => ({
          label: t(n),
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('is_read', isReadEntities);
        break;
      }
      case 'event_type': {
        const eventTypeEntities = [
          'authentication',
          'read',
          'mutation',
          'file',
          'command',
        ].map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('event_type', eventTypeEntities);
        break;
      }
      case 'event_scope': {
        const eventScopeEntities = [
          'create',
          'update',
          'delete',
          'read',
          'search',
          'enrich',
          'download',
          'import',
          'export',
          'login',
          'logout',
        ].map((n) => ({
          label: n,
          value: n,
          type: 'Vocabulary',
        }));
        unionSetEntities('event_scope', eventScopeEntities);
        break;
      }
      case 'priority':
        runVocabularySearchQuery('priority', ['case_priority_ov']);
        break;
      case 'severity':
        runVocabularySearchQuery('severity', ['case_severity_ov', 'incident_severity_ov']);
        break;
      case 'pattern_type':
        runVocabularySearchQuery('pattern_type', ['pattern_type_ov']);
        break;
      case 'malware_types':
        runVocabularySearchQuery('malware_types', ['malware_type_ov']);
        break;
      case 'x_opencti_reliability':
      case 'source_reliability':
        runVocabularySearchQuery('source_reliability', ['reliability_ov']);
        break;
      case 'indicator_types':
        runVocabularySearchQuery('indicator_types', ['indicator_type_ov']);
        break;
      case 'incident_type':
        runVocabularySearchQuery('incident_type', ['incident_type_ov']);
        break;
      case 'report_types':
        runVocabularySearchQuery('report_types', ['report_types_ov']);
        break;
      case 'channel_types':
        runVocabularySearchQuery('channel_types', ['channel_types_ov']);
        break;
      case 'event_types':
        runVocabularySearchQuery('event_types', ['event_type_ov']);
        break;
      case 'context':
        runVocabularySearchQuery('context', ['grouping_context_ov']);
        break;

      case 'x_opencti_base_severity':
      case 'x_opencti_attack_vector':
      case 'x_opencti_organization_type':
      case 'source':
        runAttributesSearchQuery(filterKey);
        break;

      case 'x_opencti_workflow_id':
        fetchQuery(statusFieldStatusesSearchQuery, {
          first: 500,
          filters: isNotEmptyField(entityType) ? {
            mode: 'and',
            filterGroups: [],
            filters: [{ key: 'type', values: [entityType] },
            ],
          } : undefined,
        })
          .toPromise()
          .then((data) => {
            const statusEntities = (
              (data as StatusFieldStatusesSearchQuery$data)?.statuses?.edges
              ?? []
            )
              .filter((n) => !R.isNil(n.node.template))
              .map((n) => ({
                label: n.node.template?.name,
                color: n.node.template?.color,
                value: n.node.id,
                order: n.node.order,
                group: n.node.type,
                type: 'Vocabulary',
              }))
              .sort((a, b) => (a.label ?? '').localeCompare(b.label ?? ''))
              .sort((a, b) => a.group.localeCompare(b.group));
            unionSetEntities('x_opencti_workflow_id', statusEntities);
          });
        break;
      case 'x_opencti_main_observable_type':
        fetchQuery(filtersSchemaSCOSearchQuery)
          .toPromise()
          .then((data) => {
            const mainObservableTypeEntities = (
              (data as useSearchEntitiesSchemaSCOSearchQuery$data)?.schemaSCOs
                ?.edges ?? []
            ).map((n) => ({
              label: n?.node.label,
              value: n?.node.id,
              type: 'Vocabulary',
            }));
            unionSetEntities(
              'x_opencti_main_observable_type',
              mainObservableTypeEntities,
            );
          });
        break;
      // region entity and relation types
      case 'contextEntityType': {
        let elementTypeResult = [] as EntityWithLabelValue[];
        elementTypeResult = [
          ...(schema.scos ?? []).map((n) => ({
            label: t(`entity_${n.label}`),
            value: n.label,
            type: n.label,
          })),
          ...elementTypeResult,
        ];
        elementTypeResult = [
          ...(schema.sdos ?? []).map((n) => ({
            label: t(`entity_${n.label}`),
            value: n.label,
            type: n.label,
          })),
          ...elementTypeResult,
        ];
        const elementTypeTypes = elementTypeResult.sort((a, b) => a.label.localeCompare(b.label));
        unionSetEntities(filterKey, elementTypeTypes);
        break;
      }
      case 'elementTargetTypes':
      case 'entity_type':
      case 'entity_types':
      case 'fromTypes':
      case 'toTypes':
        if (
          availableEntityTypes
          && !availableEntityTypes.includes('Stix-Cyber-Observable')
          && !availableEntityTypes.includes('Stix-Domain-Object')
          && !availableEntityTypes.includes('Stix-Core-Object')
        ) {
          const entitiesTypes = availableEntityTypes
            .map((n) => ({
              label: t(
                n.toString()[0] === n.toString()[0].toUpperCase()
                  ? `entity_${n.toString()}`
                  : `relationship_${n.toString()}`,
              ),
              value: n,
              type: n,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
          if (allEntityTypes) {
            entitiesTypes.unshift({
              label: t('entity_All'),
              value: 'all',
              type: 'entity',
            });
          }
          unionSetEntities(filterKey, entitiesTypes);
        } else {
          let result = [] as EntityWithLabelValue[];
          if (
            !availableEntityTypes
            || availableEntityTypes.includes('Stix-Core-Object')
            || availableEntityTypes.includes('Stix-Cyber-Observable')
          ) {
            result = [
              ...(schema.scos ?? []).map((n) => ({
                label: t(`entity_${n.label}`),
                value: n.label,
                type: n.label,
              })),
              ...result,
              {
                label: t('entity_Stix-Cyber-Observable'),
                value: 'Stix-Cyber-Observable',
                type: 'Stix-Cyber-Observable',
              },
            ];
          }
          if (
            !availableEntityTypes
            || availableEntityTypes.includes('Stix-Core-Object')
            || availableEntityTypes.includes('Stix-Domain-Object')
          ) {
            result = [
              ...(schema.sdos ?? []).map((n) => ({
                label: t(`entity_${n.label}`),
                value: n.label,
                type: n.label,
              })),
              {
                label: t('entity_Stix-Domain-Object'),
                value: 'Stix-Domain-Object',
                type: 'Stix-Domain-Object',
              },
              ...result,
            ];
          }
          if (
            !availableEntityTypes
            || availableEntityTypes.includes('stix-core-relationship')
          ) {
            result = [
              ...(schema.sros ?? []).map((n) => ({
                label: t(`relationship_${n.label}`),
                value: n.label,
                type: n.label,
              })),
              ...result,
              {
                label: t('relationship_stix-sighting-relationship'),
                value: 'stix-sighting-relationship',
                type: 'stix-sighting-relationship',
              },
            ];
          }
          const entitiesTypes = result.sort((a, b) => a.label.localeCompare(b.label));
          if (allEntityTypes) {
            entitiesTypes.unshift({
              label: t('entity_All'),
              value: 'all',
              type: 'entity',
            });
          }
          unionSetEntities(filterKey, entitiesTypes);
        }
        break;
      case 'relationship_type': {
        if (availableRelationshipTypes) {
          const relationshipsTypes = availableRelationshipTypes
            .map((n) => ({
              label: t(`relationship_${n.toString()}`),
              value: n,
              type: n,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
          unionSetEntities('relationship_type', relationshipsTypes);
        } else {
          const relationshipsTypes = (schema.sros ?? [])
            .map((n) => ({
              label: t(`relationship_${n.label}`),
              value: n.label,
              type: n.label,
            }))
            .concat([
              {
                label: t('relationship_stix-sighting-relationship'),
                value: 'stix-sighting-relationship',
                type: 'stix-sighting-relationship',
              },
              {
                label: t('relationship_object'),
                value: 'object',
                type: 'stix-internal-relationship',
              },
            ])
            .sort((a, b) => a.label.localeCompare(b.label));
          unionSetEntities('relationship_type', relationshipsTypes);
        }
        break;
      }
      // endregion
      case 'category':
        fetchQuery(vocabCategoriesQuery)
          .toPromise()
          .then((data) => {
            unionSetEntities(
              'category',
              (
                data as useVocabularyCategoryQuery$data
              ).vocabularyCategories.map(({ key }) => ({
                label: key,
                value: key,
                type: 'Vocabulary',
              })),
            );
          });
        break;
      case 'container_type': {
        const containersTypes = [
          'Note',
          'Observed-Data',
          'Opinion',
          'Report',
          'Grouping',
          'Case',
        ]
          .map((n) => ({
            label: t(
              n.toString()[0] === n.toString()[0].toUpperCase()
                ? `entity_${n.toString()}`
                : `relationship_${n.toString()}`,
            ),
            value: n,
            type: n,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        unionSetEntities('container_type', containersTypes);
        break;
      }
      case 'x_opencti_negative': {
        const negativeValue = [true, false].map((n) => ({
          label: t(n ? 'False positive' : 'True positive'),
          value: n.toString(),
          type: 'Vocabulary',
        }));
        unionSetEntities('x_opencti_negative', negativeValue);
        break;
      }
      case 'note_types':
        runVocabularySearchQuery('note_types', ['note_types_ov']);
        break;
      default:
        break;
    }
  };
  return [entities, searchEntities];
};

export default useSearchEntities;
