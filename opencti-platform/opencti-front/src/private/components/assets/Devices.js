import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import { QueryRenderer } from '../../../relay/environment';
import {
  buildViewParamsFromUrlAndStorage,
  convertFilters,
  saveViewParameters,
} from '../../../utils/ListParameters';
import inject18n from '../../../components/i18n';
import ListCards from '../../../components/list_cards/ListCards';
import ListLines from '../../../components/list_lines/ListLines';
import DevicesCards, {
  devicesCardsQuery,
} from './devices/DevicesCards';
import DevicesLines, {
  devicesLinesQuery,
} from './devices/DevicesLines';
import DeviceCreation from './devices/DeviceCreation';
import Security, { KNOWLEDGE_KNUPDATE } from '../../../utils/Security';
import { isUniqFilter } from '../common/lists/Filters';

class Devices extends Component {
  constructor(props) {
    super(props);
    const params = buildViewParamsFromUrlAndStorage(
      props.history,
      props.location,
      'view-threat_actors',
    );
    this.state = {
      sortBy: R.propOr('name', 'sortBy', params),
      orderAsc: R.propOr(true, 'orderAsc', params),
      searchTerm: R.propOr('', 'searchTerm', params),
      view: R.propOr('cards', 'view', params),
      filters: R.propOr({}, 'filters', params),
      openExports: false,
      numberOfElements: { number: 0, symbol: '' },
      selectedElements: null,
      selectAll: false,
    };
  }

  saveView() {
    saveViewParameters(
      this.props.history,
      this.props.location,
      'view-threat_actors',
      this.state,
    );
  }

  handleChangeView(mode) {
    this.setState({ view: mode }, () => this.saveView());
  }

  handleSearch(value) {
    this.setState({ searchTerm: value }, () => this.saveView());
  }

  handleSort(field, orderAsc) {
    this.setState({ sortBy: field, orderAsc }, () => this.saveView());
  }

  handleToggleExports() {
    this.setState({ openExports: !this.state.openExports });
  }

  handleToggleSelectAll() {
    this.setState({ selectAll: !this.state.selectAll, selectedElements: null });
  }

  handleClearSelectedElements() {
    this.setState({ selectAll: false, selectedElements: null });
  }

  handleToggleSelectEntity(entity, event) {
    event.stopPropagation();
    event.preventDefault();
    const { selectedElements } = this.state;
    if (entity.id in (selectedElements || {})) {
      const newSelectedElements = R.omit([entity.id], selectedElements);
      this.setState({
        selectAll: false,
        selectedElements: newSelectedElements,
      });
    } else {
      const newSelectedElements = R.assoc(
        entity.id,
        entity,
        selectedElements || {},
      );
      this.setState({
        selectAll: false,
        selectedElements: newSelectedElements,
      });
    }
  }

  handleAddFilter(key, id, value, event = null) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.state.filters[key] && this.state.filters[key].length > 0) {
      this.setState(
        {
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
        },
        () => this.saveView(),
      );
    } else {
      this.setState(
        {
          filters: R.assoc(key, [{ id, value }], this.state.filters),
        },
        () => this.saveView(),
      );
    }
  }

  handleRemoveFilter(key) {
    this.setState({ filters: R.dissoc(key, this.state.filters) }, () => this.saveView());
  }

  setNumberOfElements(numberOfElements) {
    this.setState({ numberOfElements });
  }

  renderCards(paginationOptions) {
    const {
      sortBy,
      orderAsc,
      searchTerm,
      filters,
      openExports,
      numberOfElements,
      selectedElements,
      selectAll,
    } = this.state;
    const dataColumns = {
      name: {
        label: 'Name',
      },

      created: {
        label: 'Creation date',
      },
      modified: {
        label: 'Modification date',
      },
    };
    return (
      <ListCards
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={this.handleSort.bind(this)}
        handleSearch={this.handleSearch.bind(this)}
        handleChangeView={this.handleChangeView.bind(this)}
        handleAddFilter={this.handleAddFilter.bind(this)}
        handleRemoveFilter={this.handleRemoveFilter.bind(this)}
        handleToggleExports={this.handleToggleExports.bind(this)}
        openExports={openExports}
        exportEntityType="Device"
        keyword={searchTerm}
        filters={filters}
        paginationOptions={paginationOptions}
        numberOfElements={numberOfElements}
        availableFilterKeys={[
          'labelledBy',
          'markedBy',
          'created_start_date',
          'created_end_date',
          'createdBy',
        ]}
      >
        <QueryRenderer
          query={devicesCardsQuery}
          variables={{ count: 25, ...paginationOptions }}
          render={({ props }) => (
            <DevicesCards
              data={props}
              extra={props}
              paginationOptions={paginationOptions}
              initialLoading={props === null}
              onLabelClick={this.handleAddFilter.bind(this)}
              setNumberOfElements={this.setNumberOfElements.bind(this)}
            />
          )}
        />
      </ListCards>
    );
  }

  renderLines(paginationOptions) {
    const {
      sortBy,
      orderAsc,
      searchTerm,
      filters,
      openExports,
      selectAll,
      selectedElements,
      numberOfElements,
    } = this.state;
    let numberOfSelectedElements = Object.keys(selectedElements || {}).length;
    if (selectAll) {
      numberOfSelectedElements = numberOfElements.original;
    }
    const dataColumns = {
      name: {
        label: 'Name',
        width: '15%',
        isSortable: true,
      },
      type: {
        label: 'Type',
        width: '5%',
        isSortable: true,
      },
      id: {
        label: 'Asset ID',
        width: '15%',
        isSortable: true,
      },
      ipAddress: {
        label: 'IP Address',
        width: '15%',
        isSortable: true,
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
      objectLabel: {
        label: 'Labels',
        width: '20%',
        isSortable: false,
      },
    };
    return (
      <ListLines
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={this.handleSort.bind(this)}
        handleSearch={this.handleSearch.bind(this)}
        handleChangeView={this.handleChangeView.bind(this)}
        handleAddFilter={this.handleAddFilter.bind(this)}
        handleRemoveFilter={this.handleRemoveFilter.bind(this)}
        handleToggleExports={this.handleToggleExports.bind(this)}
        openExports={openExports}
        handleToggleSelectAll={this.handleToggleSelectAll.bind(this)}
        selectAll={selectAll}
        exportEntityType="Device"
        keyword={searchTerm}
        filters={filters}
        paginationOptions={paginationOptions}
        numberOfElements={numberOfElements}
        availableFilterKeys={[
          'labelledBy',
          'markedBy',
          'created_start_date',
          'created_end_date',
          'createdBy',
        ]}
      >
        <QueryRenderer
          query={devicesLinesQuery}
          variables={{ count: 25, ...paginationOptions }}
          render={({ props }) => (
            <DevicesLines
              data={props}
              paginationOptions={paginationOptions}
              dataColumns={dataColumns}
              selectAll={selectAll}
              selectedElements={selectedElements}
              initialLoading={props === null}
              onLabelClick={this.handleAddFilter.bind(this)}
              onToggleEntity={this.handleToggleSelectEntity.bind(this)}
              setNumberOfElements={this.setNumberOfElements.bind(this)}
            />
          )}
        />
      </ListLines>
    );
  }

  render() {
    const {
      view, sortBy, orderAsc, searchTerm, filters,
    } = this.state;
    const finalFilters = convertFilters(filters);
    const paginationOptions = {
      search: searchTerm,
      orderBy: sortBy,
      orderMode: orderAsc ? 'asc' : 'desc',
      filters: finalFilters,
    };
    return (
      <div>
        {view === 'cards' ? this.renderCards(paginationOptions) : ''}
        {view === 'lines' ? this.renderLines(paginationOptions) : ''}
        <Security needs={[KNOWLEDGE_KNUPDATE]}>
          <DeviceCreation paginationOptions={paginationOptions} />
        </Security>
      </div>
    );
  }
}

Devices.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default R.compose(inject18n, withRouter)(Devices);
