import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { FileDownloadOutlined, FilterAltOutlined, InvertColorsOffOutlined, ViewColumnOutlined, ViewListOutlined } from '@mui/icons-material';
import { IconButton, ToggleButton, ToggleButtonGroup, Tooltip, styled } from '@mui/material';
import SearchInput from 'src/components/SearchInput';
import { useFormatter } from 'src/components/i18n';
import useHelper from 'src/utils/hooks/useHelper';
import { HandleAddFilter } from 'src/utils/hooks/useLocalStorage';
import { Filter, FilterGroup } from 'src/utils/filters/filtersUtils';
import FilterIconButton from 'src/components/FilterIconButton';
import { ProgressWrench } from 'mdi-material-ui';
import { export_max_size } from 'src/utils/utils';
import ExportButtons from 'src/components/ExportButtons';
import { KNOWLEDGE_KNGETEXPORT, KNOWLEDGE_KNUPDATE } from 'src/utils/hooks/useGranted';
import Security from 'src/utils/Security';
import { graphql, useRefetchableFragment } from 'react-relay';
import StixCoreRelationshipCreationFromEntity from '../stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import StixDomainObjectAttackPatternsKillChainLines from './StixDomainObjectAttackPatternsKillChainLines';
import StixDomainObjectAttackPatternsKillChainMatrix from './StixDomainObjectAttackPatternsKillChainMatrix';
import Filters from '../lists/Filters';
import {
  StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery$data,
  StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery$variables,
  StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery as TriggerQuery,
} from './__generated__/StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery.graphql';
import {
  StixDomainObjectAttackPatternsKillChain_triggers$key as FragmentKey,
  StixDomainObjectAttackPatternsKillChain_triggers$data,
} from './__generated__/StixDomainObjectAttackPatternsKillChain_triggers.graphql';
import { CreateRelationshipContext } from '../menus/CreateRelationshipContextProvider';

const StyledParameters = styled('div')({
  marginBottom: 20,
  marginTop: -12,
  padding: 0,
});

const StyledSearchInput = styled(SearchInput)({
  float: 'left',
  marginRight: 20,
});

const StyledButtonGroup = styled('div')({
  float: 'right',
  margin: 0,
});

const StyledToggleButtons = styled('div')({
  float: 'left',
  display: 'flex',
  margin: '-6px 4px 0 0',
});

const StyledExportButtons = styled(ExportButtons)({
  float: 'right',
  margin: '0 0 0 20px',
});

const StyledContainer = styled('div')({
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
});

interface TargetEntity {
  id: string;
  entity_type: string;
}

interface StixDomainObjectAttackPatternsKillChainComponentProps {
  data: StixDomainObjectAttackPatternsKillChain_triggers$data;
  stixDomainObjectId: string;
  entityLink: string;
  handleSearch: string;
  handleAddFilter: HandleAddFilter;
  handleRemoveFilter: (key: string, id?: string | undefined) => void;
  handleSwitchLocalMode: (filter: Filter) => void;
  handleSwitchGlobalMode: () => void;
  filters?: FilterGroup;
  handleChangeView: (value: string) => void;
  searchTerm: string;
  currentView: string;
  paginationOptions: StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery$variables;
  openExports?: boolean;
  handleToggleExports?: () => void;
  exportContext: { entity_type: string };
  refetch?: () => void;
}

const StixDomainObjectAttackPatternsKillChainComponent: FunctionComponent<StixDomainObjectAttackPatternsKillChainComponentProps> = ({
  data,
  stixDomainObjectId,
  entityLink,
  handleSearch,
  handleAddFilter,
  handleRemoveFilter,
  handleSwitchLocalMode,
  handleSwitchGlobalMode,
  filters,
  handleChangeView,
  searchTerm,
  currentView,
  paginationOptions,
  openExports,
  handleToggleExports,
  exportContext,
  refetch,
}) => {
  const { t_i18n } = useFormatter();
  const { setState: setCreateRelationshipContext } = useContext(CreateRelationshipContext);
  const { isFeatureEnable } = useHelper();
  const FABReplaced = isFeatureEnable('FAB_REPLACEMENT');
  const [currentModeOnlyActive, setCurrentModeOnlyActive] = useState<boolean>(false);
  const [currentColorsReversed, setCurrentColorsReversed] = useState<boolean>(false);
  const [targetEntities, setTargetEntities] = useState<TargetEntity[]>([]);
  useEffect(() => {
    setCreateRelationshipContext({
      onCreate: refetch,
    });
  }, []);

  const handleToggleModeOnlyActive = () => setCurrentModeOnlyActive(!currentModeOnlyActive);
  const handleToggleColorsReversed = () => setCurrentColorsReversed(!currentColorsReversed);
  const handleAdd = (entity: TargetEntity) => setTargetEntities([entity]);

  const exportDisabled = targetEntities.length > export_max_size;

  const newExportContext = { ...exportContext, entity_type: 'Attack-Pattern' };
  const newPaginationOptions = {
    orderBy: 'name',
    orderMode: 'desc',
    filters: {
      mode: 'and',
      filters: [
        {
          key: 'regardingOf',
          values: [{
            key: 'id',
            values: [stixDomainObjectId],
          }],
        },
      ],
      filterGroups: [],
    },
  };

  return (
    <>
      <StyledParameters>
        <StyledSearchInput
          variant="small"
          keyword={searchTerm}
          onSubmit={handleSearch}
        />
        <StyledToggleButtons>
          <Tooltip
            title={
              currentModeOnlyActive
                ? t_i18n('Display the whole matrix')
                : t_i18n('Display only used techniques')
            }
          >
            <span>
              <IconButton
                color={currentModeOnlyActive ? 'secondary' : 'primary'}
                onClick={handleToggleModeOnlyActive}
                size="large"
              >
                <FilterAltOutlined fontSize="medium"/>
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={currentColorsReversed
              ? t_i18n('Disable invert colors')
              : t_i18n('Enable invert colors')
            }
          >
            <span>
              <IconButton
                color={currentColorsReversed ? 'secondary' : 'primary'}
                onClick={handleToggleColorsReversed}
                size="large"
              >
                <InvertColorsOffOutlined fontSize="medium"/>
              </IconButton>
            </span>
          </Tooltip>
        </StyledToggleButtons>
        <Filters
          availableFilterKeys={[
            'objectMarking',
            'createdBy',
            'created',
          ]}
          handleAddFilter={handleAddFilter}
          handleRemoveFilter={handleRemoveFilter}
          handleSwitchLocalMode={handleSwitchLocalMode}
          handleSwitchGlobalMode={handleSwitchGlobalMode}
        />
        <FilterIconButton
          filters={filters}
          handleRemoveFilter={handleRemoveFilter}
          handleSwitchLocalMode={handleSwitchLocalMode}
          handleSwitchGlobalMode={handleSwitchGlobalMode}
          styleNumber={2}
          redirection
        />
        <StyledButtonGroup>
          <ToggleButtonGroup size="small" color="secondary" exclusive={true}>
            <Tooltip title={t_i18n('Matrix view')}>
              <ToggleButton
                onClick={() => handleChangeView('matrix')}
                value='matrix'
                aria-label={t_i18n('Matrix view')}
              >
                <ViewColumnOutlined
                  fontSize="small"
                  color={currentView === 'matrix' ? 'secondary' : 'primary'}
                />
              </ToggleButton>
            </Tooltip>
            <Tooltip title={t_i18n('Kill chain view')}>
              <ToggleButton
                onClick={() => handleChangeView('list')}
                value='list'
                aria-label={t_i18n('Kill chain view')}
              >
                <ViewListOutlined
                  fontSize="small"
                  color={currentView === 'list' ? 'secondary' : 'primary'}
                />
              </ToggleButton>
            </Tooltip>
            <Tooltip title={t_i18n('Courses of action view')}>
              <ToggleButton
                onClick={() => handleChangeView('courses-of-action')}
                value='courses-of-action'
                aria-label={t_i18n('Courses of action view')}
              >
                <ProgressWrench
                  fontSize="small"
                  color={
                    currentView === 'courses-of-action'
                      ? 'secondary'
                      : 'primary'
                  }
                />
              </ToggleButton>
            </Tooltip>
            {typeof handleToggleExports === 'function' && !exportDisabled && (
            <Tooltip title={t_i18n('Open export panel')}>
              <ToggleButton
                value="export"
                aria-label={t_i18n('Open export panel')}
                onClick={handleToggleExports}
              >
                <FileDownloadOutlined
                  fontSize="small"
                  color={openExports ? 'secondary' : 'primary'}
                />
              </ToggleButton>
            </Tooltip>
            )}
            {typeof handleToggleExports === 'function' && exportDisabled && (
            <Tooltip
              title={`${
                t_i18n(
                  'Export is disabled because too many entities are targeted (maximum number of entities is: ',
                ) + export_max_size
              })`}
            >
              <span>
                <ToggleButton
                  size="small"
                  value="export"
                  aria-label="export"
                  disabled={true}
                >
                  <FileDownloadOutlined fontSize="small"/>
                </ToggleButton>
              </span>
            </Tooltip>
            )}
          </ToggleButtonGroup>
          <StyledExportButtons
            domElementId="container"
            name={t_i18n('Attack patterns kill chain')}
            csvData={currentView === 'courses-of-action'
              ? data.stixCoreRelationships?.edges.flatMap((n) => n.node.to?.coursesOfAction?.edges).map((n) => n?.node)
              : null
            }
            csvFileName={`${t_i18n('Attack pattern courses of action')}.csv`}
          />
        </StyledButtonGroup>
        <div className="clearfix"/>
      </StyledParameters>
      <StyledContainer>
        {currentView === 'list' && (
          <StixDomainObjectAttackPatternsKillChainLines
            data={data}
            entityLink={entityLink}
            paginationOptions={paginationOptions}
            onDelete={refetch}
            searchTerm={searchTerm}
          />
        )}
        {currentView === 'matrix' && (
          <StixDomainObjectAttackPatternsKillChainMatrix
            data={data}
            entityLink={entityLink}
            searchTerm={searchTerm}
            handleToggleModeOnlyActive={handleToggleModeOnlyActive}
            handleToggleColorsReversed={handleToggleColorsReversed}
            currentColorsReversed={currentColorsReversed}
            currentModeOnlyActive={currentModeOnlyActive}
            handleAdd={handleAdd}
          />
        )}
        {currentView === 'courses-of-action' && (
          <StixDomainObjectAttackPatternsKillChainLines
            data={data}
            entityLink={entityLink}
            paginationOptions={paginationOptions}
            onDelete={refetch}
            searchTerm={searchTerm}
            coursesOfAction={true}
          />
        )}
        {FABReplaced && <Security needs={[KNOWLEDGE_KNUPDATE]}>
          <StixCoreRelationshipCreationFromEntity
            entityId={stixDomainObjectId}
            isRelationReversed={false}
            paddingRight={220}
            onCreate={refetch}
            targetStixDomainObjectTypes={['Attack-Pattern']}
            paginationOptions={paginationOptions}
            targetEntities={targetEntities}
            defaultStartTime={new Date().toISOString()}
            defaultStopTime={new Date().toISOString()}
          />
        </Security>}
        <Security needs={[KNOWLEDGE_KNGETEXPORT]}>
          <StixCoreObjectsExports
            open={openExports}
            exportType='simple'
            handleToggle={handleToggleExports}
            paginationOptions={newPaginationOptions}
            exportContext={newExportContext}
          />
        </Security>
      </StyledContainer>
    </>
  );
};

export const stixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery = graphql`
  query StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery(
      $fromOrToId: [String]
      $elementWithTargetTypes: [String]
      $first: Int
      $after: ID
      $filters: FilterGroup
  ) {
      ...StixDomainObjectAttackPatternsKillChain_triggers
  }
`;

export const stixDomainObjectAttackPatternsKillChainStixCoreRelationshipsTriggersFragment = graphql`
  fragment StixDomainObjectAttackPatternsKillChain_triggers on Query @refetchable(queryName: "StixDomainObjectAttackPatternsKillChain_triggersRefetch") {
    stixCoreRelationships(
      fromOrToId: $fromOrToId
      elementWithTargetTypes: $elementWithTargetTypes
      filters: $filters
      first: $first
      after: $after
    ) @connection(key: "Pagination_stixCoreRelationships") {
      edges {
        node {
          id
          description
          start_time
          stop_time
          from {
            ... on BasicRelationship {
              id
              entity_type
            }
            ... on AttackPattern {
              id
              parent_types
              entity_type
              name
              description
              x_mitre_id
              x_mitre_platforms
              x_mitre_permissions_required
              x_mitre_detection
              isSubAttackPattern
              coursesOfAction {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              parentAttackPatterns {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              subAttackPatterns {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              killChainPhases {
                id
                phase_name
                x_opencti_order
              }
            }
          }
          to {
            ... on BasicRelationship {
              id
              entity_type
            }
            ... on AttackPattern {
              id
              parent_types
              entity_type
              name
              description
              x_mitre_id
              x_mitre_platforms
              x_mitre_permissions_required
              x_mitre_detection
              isSubAttackPattern
              coursesOfAction {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              parentAttackPatterns {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              subAttackPatterns {
                edges {
                  node {
                    id
                    name
                    description
                    x_mitre_id
                  }
                }
              }
              killChainPhases {
                id
                phase_name
                x_opencti_order
              }
            }
          }
          killChainPhases {
            id
            phase_name
            x_opencti_order
          }
          objectMarking {
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
`;

interface StixDomainObjectAttackPatternsKillChainProps {
  triggerData: StixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery$data,
  componentProps: StixDomainObjectAttackPatternsKillChainComponentProps,
}

export default function StixDomainObjectAttackPatternsKillChain({
  triggerData,
  componentProps,
}: Readonly<StixDomainObjectAttackPatternsKillChainProps>) {
  const [data, refetch] = useRefetchableFragment<TriggerQuery, FragmentKey>(
    stixDomainObjectAttackPatternsKillChainStixCoreRelationshipsTriggersFragment,
    triggerData,
  );

  return (
    <StixDomainObjectAttackPatternsKillChainComponent
      {...componentProps}
      data={data}
      refetch={() => refetch({}, { fetchPolicy: 'network-only' })}
    />
  );
}
