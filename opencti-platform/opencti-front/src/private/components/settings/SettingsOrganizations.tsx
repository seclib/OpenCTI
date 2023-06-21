import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ListLines from '../../../components/list_lines/ListLines';
import SettingsOrganizationsLines, { settingsOrganizationsLinesQuery } from './organizations/SettingsOrganizationsLines';
import Loader, { LoaderVariant } from '../../../components/Loader';
import useQueryLoading from '../../../utils/hooks/useQueryLoading';
import { SettingsOrganizationsLinesPaginationQuery, SettingsOrganizationsLinesPaginationQuery$variables } from './organizations/__generated__/SettingsOrganizationsLinesPaginationQuery.graphql';
import { usePaginationLocalStorage } from '../../../utils/hooks/useLocalStorage';
import AccessesMenu from './AccessesMenu';

const useStyles = makeStyles(() => ({
  container: {
    margin: 0,
    padding: '0 200px 50px 0',
  },
}));

const SettingsOrganizations = () => {
  const classes = useStyles();
  const LOCAL_STORAGE_KEY = 'view-settings-organizations';
  const { viewStorage, helpers, paginationOptions } = usePaginationLocalStorage<SettingsOrganizationsLinesPaginationQuery$variables>(LOCAL_STORAGE_KEY, {
    searchTerm: '',
    sortBy: 'name',
    orderAsc: false,
  });
  const queryRef = useQueryLoading<SettingsOrganizationsLinesPaginationQuery>(settingsOrganizationsLinesQuery, paginationOptions);
  const renderLines = () => {
    const dataColumns = {
      name: {
        label: 'Name',
        width: '23%',
        isSortable: true,
      },
      x_opencti_organization_type: {
        label: 'Type',
        width: '15%',
        isSortable: true,
      },
      objectLabel: {
        label: 'Labels',
        width: '23%',
        isSortable: false,
      },
      created: {
        label: 'Creation date',
        width: '15%',
        isSortable: true,
      },
      modified: {
        label: 'Modification date',
        width: '15%',
        isSortable: true,
      },
    };
    return (
      <ListLines
        sortBy={viewStorage.sortBy}
        orderAsc={viewStorage.orderAsc}
        dataColumns={dataColumns}
        handleSort={helpers.handleSort}
        handleSearch={helpers.handleSearch}
        keyword={paginationOptions.search}
        paginationOptions={paginationOptions}
      >
        {queryRef && (
          <>
            <React.Suspense
              fallback={<Loader variant={LoaderVariant.inElement} />}
            >
              <SettingsOrganizationsLines
                queryRef={queryRef}
                paginationOptions={paginationOptions}
                dataColumns={dataColumns}
              />
            </React.Suspense>
          </>
        )}
      </ListLines>
    );
  };
  return (
    <div className={classes.container}>
      <AccessesMenu />
      {renderLines()}
    </div>
  );
};
export default SettingsOrganizations;
