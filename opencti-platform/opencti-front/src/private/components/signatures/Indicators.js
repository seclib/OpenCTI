import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import {
  append, compose, filter, propOr,
} from 'ramda';
import { withRouter } from 'react-router-dom';
import { QueryRenderer } from '../../../relay/environment';
import {
  buildViewParamsFromUrlAndStorage,
  saveViewParameters,
} from '../../../utils/ListParameters';
import inject18n from '../../../components/i18n';
import ListLines from '../../../components/list_lines/ListLines';
import IndicatorsLines, {
  indicatorsLinesQuery,
} from './indicators/IndicatorsLines';
import IndicatorCreation from './indicators/IndicatorCreation';
import IndicatorsRightBar from './indicators/IndicatorsRightBar';

class Indicators extends Component {
  constructor(props) {
    super(props);
    const params = buildViewParamsFromUrlAndStorage(
      props.history,
      props.location,
      'Indicators-view',
    );
    this.state = {
      sortBy: propOr('valid_from', 'sortBy', params),
      orderAsc: propOr(false, 'orderAsc', params),
      searchTerm: propOr('', 'searchTerm', params),
      view: propOr('lines', 'view', params),
      mainObservableTypes: propOr([], 'mainObservableTypes', params),
    };
  }

  saveView() {
    saveViewParameters(
      this.props.history,
      this.props.location,
      'Indicators-view',
      this.state,
    );
  }

  handleSearch(value) {
    this.setState({ searchTerm: value }, () => this.saveView());
  }

  handleSort(field, orderAsc) {
    this.setState({ sortBy: field, orderAsc }, () => this.saveView());
  }

  handleToggle(mainObservableType) {
    if (this.state.mainObservableTypes.includes(mainObservableType)) {
      this.setState(
        {
          mainObservableTypes: filter(
            (t) => t !== mainObservableType,
            this.state.mainObservableTypes,
          ),
        },
        () => this.saveView(),
      );
    } else {
      this.setState(
        { mainObservableTypes: append(mainObservableType, this.state.mainObservableTypes) },
        () => this.saveView(),
      );
    }
  }

  renderLines(paginationOptions) {
    const { sortBy, orderAsc, searchTerm } = this.state;
    const dataColumns = {
      main_observable_type: {
        label: 'Type',
        width: '10%',
        isSortable: true,
      },
      name: {
        label: 'Name',
        width: '25%',
        isSortable: true,
      },
      valid_from: {
        label: 'Valid from',
        width: '15%',
        isSortable: true,
      },
      valid_until: {
        label: 'Valid until',
        width: '15%',
        isSortable: true,
      },
      pattern_type: {
        label: 'Pattern type',
        width: '15%',
        isSortable: true,
      },
      markingDefinitions: {
        label: 'Marking',
        isSortable: true,
      },
    };
    return (
      <ListLines
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        handleSort={this.handleSort.bind(this)}
        handleSearch={this.handleSearch.bind(this)}
        displayImport={true}
        keyword={searchTerm}
      >
        <QueryRenderer
          query={indicatorsLinesQuery}
          variables={{ count: 25, ...paginationOptions }}
          render={({ props }) => (
            <IndicatorsLines
              data={props}
              paginationOptions={paginationOptions}
              dataColumns={dataColumns}
              initialLoading={props === null}
            />
          )}
        />
      </ListLines>
    );
  }

  render() {
    const {
      view,
      sortBy,
      orderAsc,
      searchTerm,
      mainObservableTypes,
    } = this.state;
    const paginationOptions = {
      filters: mainObservableTypes
        ? [{ key: 'main_observable_type', values: mainObservableTypes }]
        : null,
      search: searchTerm,
      orderBy: sortBy,
      orderMode: orderAsc ? 'asc' : 'desc',
    };
    return (
      <div>
        {view === 'lines' ? this.renderLines(paginationOptions) : ''}
        <IndicatorCreation paginationOptions={paginationOptions} />
        <IndicatorsRightBar
          types={mainObservableTypes}
          handleToggle={this.handleToggle.bind(this)}
        />
      </div>
    );
  }
}

Indicators.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default compose(inject18n, withRouter)(Indicators);
