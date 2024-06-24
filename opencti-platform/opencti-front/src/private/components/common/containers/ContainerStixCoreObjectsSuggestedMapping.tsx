import React, { FunctionComponent, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { ContainerContent_container$data } from '@components/common/containers/__generated__/ContainerContent_container.graphql';
import { graphql } from 'react-relay';
import {
  ContainerStixCoreObjectsSuggestedMappingLine,
  ContainerStixCoreObjectsSuggestedMappingLineDummy,
} from '@components/common/containers/ContainerStixCoreObjectsSuggestedMappingLine';
import { ContainerStixCoreObjectsSuggestedMappingQuery$data } from '@components/common/containers/__generated__/ContainerStixCoreObjectsSuggestedMappingQuery.graphql';
import ListLines from '../../../../components/list_lines/ListLines';
import useAuth from '../../../../utils/hooks/useAuth';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { emptyFilterGroup } from '../../../../utils/filters/filtersUtils';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';
import Loader, { LoaderVariant } from '../../../../components/Loader';

export const containerStixCoreObjectsSuggestedMappingQuery = graphql`
  query ContainerStixCoreObjectsSuggestedMappingQuery(
    $id: ID!
    $contentSource: String!
    $contentType: AnalysisContentType!
  ) {
    stixCoreObjectAnalysis(id: $id, contentSource: $contentSource, contentType: $contentType) {
      ... on MappingAnalysis {
        analysisType
        mappedEntities {
          matchedString
          ...ContainerStixCoreObjectsSuggestedMappingLine_mappedEntity
          matchedEntity{
            id
            standard_id
          }
        }
      }
    }
  }
`;

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    padding: '15px 0 0 0',
  },
}));

interface ContainerStixCoreObjectsSuggestedMappingProps {
  container: ContainerContent_container$data;
  suggestedMapping: ContainerStixCoreObjectsSuggestedMappingQuery$data
  suggestedMappingCount: Record<string, number>;
  height: number;
  handleSwitchView: (view: string) => void;
  handleAskNewSuggestedMapping: () => void;
  handleValidateSuggestedMapping: any;
  currentView: string;
  isLoading: boolean;
}

const ContainerStixCoreObjectsSuggestedMapping: FunctionComponent<
ContainerStixCoreObjectsSuggestedMappingProps
> = ({ container,
  suggestedMapping,
  suggestedMappingCount,
  height,
  handleSwitchView,
  handleAskNewSuggestedMapping,
  handleValidateSuggestedMapping,
  currentView,
  isLoading,
}) => {
  const [removedEntities, setRemovedEntities] = useState<string[]>([]);
  const classes = useStyles();
  const {
    platformModuleHelpers: { isRuntimeFieldEnable },
  } = useAuth();
  const isRuntimeSort = isRuntimeFieldEnable() ?? false;

  const LOCAL_STORAGE_KEY = `container-${container.id}-stixCoreObjectsSuggestedMapping`;
  const {
    viewStorage,
    helpers,
  } = usePaginationLocalStorage(
    LOCAL_STORAGE_KEY,
    {
      id: container.id,
      types: ['Stix-Core-Object'],
      filters: emptyFilterGroup,
      searchTerm: '',
      sortBy: 'name',
      orderAsc: false,
      openExports: false,
      view: 'suggestedMapping',
    },
    true,
  );
  const {
    numberOfElements,
    filters,
    searchTerm,
    sortBy,
    orderAsc,
  } = viewStorage;
  const {
    handleSetNumberOfElements,
  } = helpers;

  const dataColumns = {
    entity_type: {
      label: 'Type',
      width: '20%',
      isSortable: true,
    },
    matched_text: {
      label: 'Matched text',
      width: '17%',
      isSortable: true,
    },
    createdBy: {
      label: 'Author',
      width: '15%',
      isSortable: isRuntimeSort,
    },
    value: {
      label: 'Value',
      width: '30%',
      isSortable: false,
    },
    objectMarking: {
      label: 'Marking',
      width: '10%',
      isSortable: isRuntimeSort,
    },
    mapping: {
      label: 'Mapping',
      width: '8%',
      isSortable: false,
    },
  };

  const mappedEntities = (suggestedMapping?.stixCoreObjectAnalysis?.mappedEntities ?? []);
  const mappedEntitiesWithNode = mappedEntities.map((e) => { return { node: e }; });
  const filteredMappedEntities = mappedEntitiesWithNode.filter((e) => !removedEntities.find((r) => r === e?.node?.matchedEntity?.id));

  handleSetNumberOfElements({
    number: filteredMappedEntities.length.toString(),
    symbol: '',
    original: filteredMappedEntities.length,
  });

  const handleRemoveSuggestedMappingLine = (matchedId: string) => {
    setRemovedEntities([...removedEntities, matchedId]);
  };

  const handleAskValidateSuggestedMapping = () => {
    const mappingToAdd = filteredMappedEntities.map((e) => { return { matchedString: e?.node?.matchedString, matchedEntityId: e?.node?.matchedEntity?.standard_id }; });
    handleValidateSuggestedMapping(mappingToAdd);
  };

  if (isLoading) return <Loader variant={LoaderVariant.inElement}/>;

  // @ts-ignore
  return (
    <div className={classes.container}>
      <ListLines
        helpers={helpers}
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleChangeView={handleSwitchView}
        iconExtension={false}
        filters={filters}
        availableEntityTypes={['Stix-Core-Object']}
        keyword={searchTerm}
        secondaryAction={true}
        numberOfElements={numberOfElements}
        noPadding={true}
        handleAskNewSuggestedMapping={handleAskNewSuggestedMapping}
        handleValidateSuggestedMapping={handleAskValidateSuggestedMapping}
        currentView={currentView}
        enableMappingView
        disableCards
      >
        <ListLinesContent
          initialLoading={false}
          loadMore={() => {}}
          hasMore={() => {}}
          isLoading={() => false}
          dataList={filteredMappedEntities}
          globalCount={filteredMappedEntities.length}
          LineComponent={
            <ContainerStixCoreObjectsSuggestedMappingLine
              handleRemoveSuggestedMappingLine={handleRemoveSuggestedMappingLine}
            />
          }
          DummyLineComponent={ContainerStixCoreObjectsSuggestedMappingLineDummy}
          dataColumns={dataColumns}
          contentMappingCount={suggestedMappingCount}
          height={height}
        />
      </ListLines>
    </div>
  );
};

export default ContainerStixCoreObjectsSuggestedMapping;