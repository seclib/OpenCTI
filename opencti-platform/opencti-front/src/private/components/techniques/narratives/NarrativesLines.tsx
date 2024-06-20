import React, { FunctionComponent } from 'react';
import { graphql, PreloadedQuery } from 'react-relay';
import { NarrativesLinesPaginationQuery, NarrativesLinesPaginationQuery$variables } from '@components/techniques/narratives/__generated__/NarrativesLinesPaginationQuery.graphql';
import { NarrativesLines_data$key } from '@components/techniques/narratives/__generated__/NarrativesLines_data.graphql';
import { NarrativeLine, NarrativeLineDummy } from './NarrativeLine';
import { DataColumns } from '../../../../components/list_lines';
import { HandleAddFilter, UseLocalStorageHelpers } from '../../../../utils/hooks/useLocalStorage';
import usePreloadedPaginationFragment from '../../../../utils/hooks/usePreloadedPaginationFragment';
import ListLinesContent from '../../../../components/list_lines/ListLinesContent';

const nbOfRowsToLoad = 50;

interface NarrativesLinesProps {
  queryRef: PreloadedQuery<NarrativesLinesPaginationQuery>;
  dataColumns: DataColumns;
  paginationOptions?: NarrativesLinesPaginationQuery$variables;
  setNumberOfElements: UseLocalStorageHelpers['handleSetNumberOfElements'];
  onLabelClick: HandleAddFilter;
}

export const narrativesLinesQuery = graphql`
  query NarrativesLinesPaginationQuery(
    $search: String
    $count: Int!
    $cursor: ID
    $orderBy: NarrativesOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    ...NarrativesLines_data
    @arguments(
      search: $search
      count: $count
      cursor: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    )
  }
`;

const narrativesLineFragment = graphql`
  fragment NarrativesLines_data on Query
  @argumentDefinitions(
    search: { type: "String" }
    count: { type: "Int", defaultValue: 25 }
    cursor: { type: "ID" }
    orderBy: { type: "NarrativesOrdering", defaultValue: name }
    orderMode: { type: "OrderingMode", defaultValue: asc }
    filters: { type: "FilterGroup" }
  )
  @refetchable(queryName: "NarrativesLinesRefetchQuery") {
    narratives(
      search: $search
      first: $count
      after: $cursor
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) @connection(key: "Pagination_narratives") {
      edges {
        node {
          id
          name
          description
          ...NarrativeLine_node
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        globalCount
      }
    }
  }
`;

const NarrativesLines: FunctionComponent<NarrativesLinesProps> = ({
  setNumberOfElements,
  queryRef,
  dataColumns,
  paginationOptions,
  onLabelClick,
}) => {
  const { data, hasMore, loadMore, isLoadingMore } = usePreloadedPaginationFragment<
  NarrativesLinesPaginationQuery,
  NarrativesLines_data$key
  >({
    linesQuery: narrativesLinesQuery,
    linesFragment: narrativesLineFragment,
    queryRef,
    nodePath: ['narratives', 'pageInfo', 'globalCount'],
    setNumberOfElements,
  });
  return (
    <ListLinesContent
      initialLoading={!data}
      isLoading={isLoadingMore}
      loadMore={loadMore}
      hasMore={hasMore}
      dataList={data?.narratives?.edges ?? []}
      globalCount={data?.narratives?.pageInfo?.globalCount ?? nbOfRowsToLoad}
      LineComponent={NarrativeLine}
      DummyLineComponent={NarrativeLineDummy}
      dataColumns={dataColumns}
      nbOfRowsToLoad={nbOfRowsToLoad}
      paginationOptions={paginationOptions}
    />
  );
};

export default NarrativesLines;
