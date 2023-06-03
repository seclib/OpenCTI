import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import * as R from 'ramda';
import withStyles from '@mui/styles/withStyles';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { Add, Close } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { GlobeModel, HexagonOutline } from 'mdi-material-ui';
import { QueryRenderer } from '../../../../relay/environment';
import inject18n from '../../../../components/i18n';
import SearchInput from '../../../../components/SearchInput';
import ContainerAddStixCoreObjectsLines, {
  containerAddStixCoreObjectsLinesQuery,
} from './ContainerAddStixCoreObjectsLines';
import StixDomainObjectCreation from '../stix_domain_objects/StixDomainObjectCreation';
import StixCyberObservableCreation from '../../observations/stix_cyber_observables/StixCyberObservableCreation';
import {
  stixCyberObservableTypes,
  stixDomainObjectTypes,
} from '../../../../utils/hooks/useAttributes';
import { UserContext } from '../../../../utils/hooks/useAuth';
import ListLines from '../../../../components/list_lines/ListLines';
import { isUniqFilter } from '../../../../utils/filters/filtersUtils';
import {convertFilters} from "../../../../utils/ListParameters";

const styles = (theme) => ({
  drawerPaper: {
    minHeight: '100vh',
    width: '50%',

    padding: 0,
    zIndex: 1,
  },
  createButton: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 1100,
  },
  createButtonWithPadding: {
    position: 'fixed',
    bottom: 30,
    right: 280,
    zIndex: 1100,
  },
  createButtonSimple: {
    float: 'left',
    marginTop: -15,
  },
  title: {
    float: 'left',
  },
  search: {
    float: 'right',
  },
  header: {
    backgroundColor: theme.palette.background.nav,
    padding: '20px 20px 20px 60px',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 5,
    color: 'inherit',
  },
  container: {
    padding: 0,
    height: '100%',
    width: '100%',
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: theme.palette.grey[700],
  },
  avatar: {
    width: 24,
    height: 24,
  },
  speedDial: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 2000,
  },
  info: {
    paddingTop: 10,
  },
  speedDialButton: {
    backgroundColor: theme.palette.secondary.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
});

class ContainerAddStixCoreObjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openSpeedDial: false,
      openCreateEntity: false,
      openCreateObservable: false,
      sortBy: '_score',
      orderAsc: false,
      filters: props.targetStixCoreObjectTypes ? { 'entity_type': props.targetStixCoreObjectTypes } : {},,
      numberOfElements: { number: 0, symbol: '' },
      selectedElements: null,
      search: '',
    };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleOpenSpeedDial() {
    this.setState({ openSpeedDial: true });
  }

  handleCloseSpeedDial() {
    this.setState({ openSpeedDial: false });
  }

  handleOpenCreateEntity() {
    this.setState({ openCreateEntity: true, openSpeedDial: false });
  }

  handleCloseCreateEntity() {
    this.setState({ openCreateEntity: false, openSpeedDial: false });
  }

  handleOpenCreateObservable() {
    this.setState({ openCreateObservable: true, openSpeedDial: false });
  }

  handleCloseCreateObservable() {
    this.setState({ openCreateObservable: false, openSpeedDial: false });
  }

  handleSearch(value) {
    this.setState({ searchTerm: value });
  }

  handleChangeView(mode) {
    this.setState({ view: mode });
  }

  handleSort(field, orderAsc) {
    this.setState({ sortBy: field, orderAsc });
  }

  handleToggleExports() {
    this.setState({ openExports: !this.state.openExports });
  }

  handleClearSelectedElements() {
    this.setState({
      selectAll: false,
      selectedElements: null,
      deSelectedElements: null,
    });
  }

  handleAddFilter(key, id, value, event = null) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.state.filters[key] && this.state.filters[key].length > 0) {
      this.setState({
        filters: R.assoc(
          key,
          isUniqFilter(key)
            ? [{ id, value }]
            : R.uniqBy(R.prop('id'), [
              { id, value },
              ...this.state.filters[key],
            ]),
          this.state.filters,
        ),
      });
    } else {
      this.setState({
        filters: R.assoc(key, [{ id, value }], this.state.filters),
      });
    }
  }

  handleRemoveFilter(key) {
    this.setState({ filters: R.dissoc(key, this.state.filters) });
  }

  setNumberOfElements(numberOfElements) {
    this.setState({ numberOfElements });
  }

  static isTypeDomainObject(types) {
    return !types || types.some((r) => stixDomainObjectTypes.indexOf(r) >= 0);
  }

  static isTypeObservable(types) {
    return (
      !types || types.some((r) => stixCyberObservableTypes.indexOf(r) >= 0)
    );
  }

  renderDomainObjectCreation(paginationOptions) {
    const {
      defaultCreatedBy,
      defaultMarkingDefinitions,
      confidence,
      targetStixCoreObjectTypes,
    } = this.props;
    const { open, searchTerm } = this.state;
    return (
      <StixDomainObjectCreation
        display={open}
        inputValue={searchTerm}
        paginationKey="Pagination_stixCoreObjects"
        paginationOptions={paginationOptions}
        confidence={confidence}
        defaultCreatedBy={defaultCreatedBy}
        defaultMarkingDefinitions={defaultMarkingDefinitions}
        stixDomainObjectTypes={
          targetStixCoreObjectTypes && targetStixCoreObjectTypes.length > 0
            ? targetStixCoreObjectTypes
            : []
        }
      />
    );
  }

  renderObservableCreation(paginationOptions) {
    const { defaultCreatedBy, defaultMarkingDefinitions } = this.props;
    const { open, searchTerm } = this.state;
    return (
      <StixCyberObservableCreation
        display={open}
        contextual={true}
        inputValue={searchTerm}
        paginationKey="Pagination_stixCoreObjects"
        paginationOptions={paginationOptions}
        defaultCreatedBy={defaultCreatedBy}
        defaultMarkingDefinitions={defaultMarkingDefinitions}
      />
    );
  }

  renderStixCoreObjectCreation(paginationOptions) {
    const {
      classes,
      defaultCreatedBy,
      defaultMarkingDefinitions,
      confidence,
      targetStixCoreObjectTypes,
      t,
    } = this.props;
    const {
      open,
      openSpeedDial,
      openCreateEntity,
      openCreateObservable,
      searchTerm,
    } = this.state;
    return (
      <div>
        <SpeedDial
          className={classes.createButton}
          ariaLabel="Create"
          icon={<SpeedDialIcon />}
          onClose={this.handleCloseSpeedDial.bind(this)}
          onOpen={this.handleOpenSpeedDial.bind(this)}
          open={openSpeedDial}
          FabProps={{
            color: 'secondary',
          }}
        >
          <SpeedDialAction
            title={t('Create an observable')}
            icon={<HexagonOutline />}
            tooltipTitle={t('Create an observable')}
            onClick={this.handleOpenCreateObservable.bind(this)}
            FabProps={{
              classes: { root: classes.speedDialButton },
            }}
          />
          <SpeedDialAction
            title={t('Create an entity')}
            icon={<GlobeModel />}
            tooltipTitle={t('Create an entity')}
            onClick={this.handleOpenCreateEntity.bind(this)}
            FabProps={{
              classes: { root: classes.speedDialButton },
            }}
          />
        </SpeedDial>
        <StixDomainObjectCreation
          display={open}
          inputValue={searchTerm}
          paginationKey="Pagination_stixCoreObjects"
          paginationOptions={paginationOptions}
          confidence={confidence}
          defaultCreatedBy={defaultCreatedBy}
          defaultMarkingDefinitions={defaultMarkingDefinitions}
          stixCoreObjectTypes={
            targetStixCoreObjectTypes && targetStixCoreObjectTypes.length > 0
              ? targetStixCoreObjectTypes
              : []
          }
          speeddial={true}
          open={openCreateEntity}
          handleClose={this.handleCloseCreateEntity.bind(this)}
        />
        <StixCyberObservableCreation
          display={open}
          contextual={true}
          inputValue={searchTerm}
          paginationKey="Pagination_stixCoreObjects"
          paginationOptions={paginationOptions}
          defaultCreatedBy={defaultCreatedBy}
          defaultMarkingDefinitions={defaultMarkingDefinitions}
          speeddial={true}
          open={openCreateObservable}
          handleClose={this.handleCloseCreateObservable.bind(this)}
        />
      </div>
    );
  }

  renderEntityCreation(paginationOptions) {
    const { targetStixCoreObjectTypes } = this.props;
    if (
      targetStixCoreObjectTypes
      && ContainerAddStixCoreObjects.isTypeDomainObject(
        targetStixCoreObjectTypes,
      )
      && !ContainerAddStixCoreObjects.isTypeObservable(targetStixCoreObjectTypes)
    ) {
      return this.renderDomainObjectCreation(paginationOptions);
    }
    if (
      targetStixCoreObjectTypes
      && ContainerAddStixCoreObjects.isTypeObservable(targetStixCoreObjectTypes)
      && !ContainerAddStixCoreObjects.isTypeDomainObject(targetStixCoreObjectTypes)
    ) {
      return this.renderObservableCreation(paginationOptions);
    }
    if (
      !targetStixCoreObjectTypes
      || (ContainerAddStixCoreObjects.isTypeObservable(
        targetStixCoreObjectTypes,
      )
        && ContainerAddStixCoreObjects.isTypeDomainObject(
          targetStixCoreObjectTypes,
        ))
    ) {
      return this.renderStixCoreObjectCreation(paginationOptions);
    }
    return null;
  }

  renderSearchResults(paginationOptions) {
    const {
      classes,
      containerId,
      knowledgeGraph,
      containerStixCoreObjects,
      t,
    } = this.props;
    const { sortBy, orderAsc, filters, numberOfElements } = this.state;
    return (
      <UserContext.Consumer>
        {({ platformModuleHelpers }) => (
          <div>
            <ListLines
              sortBy={sortBy}
              orderAsc={orderAsc}
              dataColumns={this.buildColumns(platformModuleHelpers)}
              handleSort={this.handleSort.bind(this)}
              handleAddFilter={this.handleAddFilter.bind(this)}
              handleRemoveFilter={this.handleRemoveFilter.bind(this)}
              exportEntityType="Stix-Core-Object"
              disableCards={true}
              filters={filters}
              paginationOptions={paginationOptions}
              numberOfElements={numberOfElements}
              iconExtension={true}
              availableFilterKeys={[
                'entity_type',
                'markedBy',
                'labelledBy',
                'createdBy',
                'confidence',
                'x_opencti_organization_type',
                'created_start_date',
                'created_end_date',
                'created_at_start_date',
                'created_at_end_date',
                'creator',
              ]}
            >
              <QueryRenderer
                query={containerAddStixCoreObjectsLinesQuery}
                variables={{ count: 100, ...paginationOptions }}
                render={({ props }) => (
                  <ContainerAddStixCoreObjectsLines
                    containerId={containerId}
                    data={props}
                    paginationOptions={this.props.paginationOptions}
                    knowledgeGraph={knowledgeGraph}
                    containerStixCoreObjects={containerStixCoreObjects}
                    onAdd={this.props.onAdd}
                    onDelete={this.props.onDelete}
                  />
                )}
              />
            </ListLines>
          </div>
        )}
      </UserContext.Consumer>
    );
  }

  renderSearch(paginationOptions) {
    return this.renderSearchResults(paginationOptions);
  }

  getSearchTypes() {
    const { paginationOptions, targetStixCoreObjectTypes } = this.props;
    let searchTypes;
    if (targetStixCoreObjectTypes !== undefined) {
      searchTypes = [...targetStixCoreObjectTypes];
    }
    if (paginationOptions !== undefined) {
      const { types } = paginationOptions;
      searchTypes = [...types];
    }
    return searchTypes;
  }

  getPaginationOptions() {
    const { searchTerm, filters, sortBy, orderAsc } = this.state;
    const finalFilters = convertFilters(filters);
    const paginationOptions = {
      search: searchTerm,
      filters: finalFilters,
      orderBy: sortBy,
      orderMode: orderAsc ? 'asc' : 'desc',
    };
  }

  render() {
    const { t, classes, withPadding, simple, knowledgeGraph } = this.props;
    const paginationOptions = this.getPaginationOptions();
    return (
      <div>
        {/* eslint-disable-next-line no-nested-ternary */}
        {knowledgeGraph ? (
          <Tooltip title={t('Add an entity to this container')}>
            <IconButton
              color="primary"
              aria-label="Add"
              onClick={this.handleOpen.bind(this)}
              size="large"
            >
              <Add />
            </IconButton>
          </Tooltip>
        ) : simple ? (
          <IconButton
            color="secondary"
            aria-label="Add"
            onClick={this.handleOpen.bind(this)}
            classes={{ root: classes.createButtonSimple }}
            size="large"
          >
            <Add fontSize="small" />
          </IconButton>
        ) : (
          <Fab
            onClick={this.handleOpen.bind(this)}
            color="secondary"
            aria-label="Add"
            className={
              withPadding
                ? classes.createButtonWithPadding
                : classes.createButton
            }
          >
            <Add />
          </Fab>
        )}
        <Drawer
          open={this.state.open}
          keepMounted={true}
          anchor="right"
          elevation={1}
          sx={{ zIndex: 1202 }}
          classes={{ paper: classes.drawerPaper }}
          onClose={this.handleClose.bind(this)}
        >
          <div className={classes.header}>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.handleClose.bind(this)}
              size="large"
              color="primary"
            >
              <Close fontSize="small" color="primary" />
            </IconButton>
            {(ContainerAddStixCoreObjects.isTypeDomainObject(
              paginationOptions.types,
            )
              || ContainerAddStixCoreObjects.isTypeObservable(
                paginationOptions.types,
              )) && (
              <Typography variant="h6" classes={{ root: classes.title }}>
                {t('Add entities')}
              </Typography>
            )}
            {this.renderSearchTypeFilter(paginationOptions)}
            <div className={classes.search}>
              <SearchInput
                variant="inDrawer"
                placeholder={`${t('Search')}...`}
                onSubmit={this.handleSearch.bind(this)}
              />
            </div>
          </div>
          <div className={classes.container}>
            {this.renderSearch(paginationOptions)}
          </div>
          {this.renderEntityCreation(paginationOptions)}
        </Drawer>
      </div>
    );
  }
}

ContainerAddStixCoreObjects.propTypes = {
  containerId: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
  paginationOptions: PropTypes.object,
  knowledgeGraph: PropTypes.bool,
  withPadding: PropTypes.bool,
  defaultCreatedBy: PropTypes.object,
  defaultMarkingDefinitions: PropTypes.array,
  confidence: PropTypes.number,
  containerStixCoreObjects: PropTypes.array,
  simple: PropTypes.bool,
  targetStixCoreObjectTypes: PropTypes.array,
  onTypesChange: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  openExports: PropTypes.bool,
};

export default R.compose(
  inject18n,
  withStyles(styles),
)(ContainerAddStixCoreObjects);
