import React, { useContext, useEffect } from 'react';
import useFiltersState from 'src/utils/filters/useFiltersState';
import { v4 as uuid } from 'uuid';
import { useLazyLoadQuery } from 'react-relay';
import { styled } from '@mui/material';
import Loader from '../../../../components/Loader';
import StixDomainObjectAttackPatternsKillChain, { stixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery } from './StixDomainObjectAttackPatternsKillChain';
import { usePaginationLocalStorage } from '../../../../utils/hooks/useLocalStorage';
import { emptyFilterGroup, isFilterGroupNotEmpty, useRemoveIdAndIncorrectKeysFromFilterGroupObject } from '../../../../utils/filters/filtersUtils';
import { CreateRelationshipContext } from '../menus/CreateRelationshipContextProvider';

const StyledContainer = styled('div')({
  container: {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
});

const StixDomainObjectAttackPatterns = ({
  stixDomainObjectId,
  entityLink,
  defaultStartTime,
  defaultStopTime,
  disableExport,
}) => {
  const LOCAL_STORAGE_KEY = `attack-patterns-${stixDomainObjectId}`;
  const {
    viewStorage,
    helpers,
    paginationOptions,
  } = usePaginationLocalStorage(LOCAL_STORAGE_KEY, {
    searchTerm: '',
    openExports: false,
    filters: emptyFilterGroup,
    view: 'matrix',
  });
  const { setState: setCreateRelationshipContext } = useContext(CreateRelationshipContext);
  const { searchTerm, filters, view, openExports } = viewStorage;
  const userFilters = useRemoveIdAndIncorrectKeysFromFilterGroupObject(filters, ['stix-core-relationship']);
  const contextFilters = {
    mode: 'and',
    filters: [
      { key: 'elementWithTargetTypes', values: ['Attack-Pattern'] },
      { key: 'fromOrToId', values: [stixDomainObjectId] },
    ],
    filterGroups: userFilters && isFilterGroupNotEmpty(userFilters) ? [userFilters] : [],
  };
  const queryPaginationOptions = { ...paginationOptions, filters: contextFilters };
  const [typeFilters, typeHelpers] = useFiltersState({
    mode: 'and',
    filterGroups: [],
    filters: [{
      id: uuid(),
      key: 'entity_type',
      values: ['Attack-Pattern'],
      operator: 'eq',
      mode: 'or',
    }],
  });
  useEffect(() => {
    setCreateRelationshipContext({
      stixCoreObjectTypes: ['Attack-Pattern'],
      filters: typeFilters,
      helpers: typeHelpers,
      paginationOptions: queryPaginationOptions,
    });
  }, []);
  const triggerData = useLazyLoadQuery(
    stixDomainObjectAttackPatternsKillChainStixCoreRelationshipsQuery,
    { first: 500, ...queryPaginationOptions },
  );
  return (
    <React.Suspense fallback={<Loader withRightPadding={true} />}>
      <StyledContainer>
        <StixDomainObjectAttackPatternsKillChain
          triggerData={triggerData}
          componentProps={{
            stixDomainObjectId,
            entityLink,
            handleSearch: helpers.handleSearch,
            handleAddFilter: helpers.handleAddFilter,
            handleRemoveFilter: helpers.handleRemoveFilter,
            handleSwitchLocalMode: helpers.handleSwitchLocalMode,
            handleSwitchGlobalMode: helpers.handleSwitchGlobalMode,
            handleChangeView: helpers.handleChangeView,
            filters,
            searchTerm: searchTerm ?? '',
            currentView: view,
            paginationOptions: queryPaginationOptions,
            defaultStartTime,
            defaultStopTime,
            openExports,
            handleToggleExports: disableExport ? null : helpers.handleToggleExports,
            exportContext: { entity_type: 'stix-core-relationship' },
          }}
        />
      </StyledContainer>
    </React.Suspense>
  );
};

export default StixDomainObjectAttackPatterns;
