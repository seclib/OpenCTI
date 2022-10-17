import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { withStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import graphql from 'babel-plugin-relay/macro';
import { QueryRenderer } from '../../../../../relay/environment';
import inject18n from '../../../../../components/i18n';
import RemediationEntitiesLines from './RemediationEntitiesLines';

const styles = () => ({
  paper: {
    height: '100%',
    minHeight: '100%',
    margin: 0,
    padding: '25px 15px 15px 15px',
    borderRadius: 6,
  },
  bodyItem: {
    height: 35,
    fontSize: 13,
    paddingLeft: 24,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
  },
  ListItem: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const remediationEntitiesQuery = graphql`
  query RemediationEntitiesQuery($id: ID!) {
    risk(id: $id) {
      id
      name
      ...RemediationEntitiesLines_risk
    }
  }
`;

class RemediationEntities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: null,
      orderAsc: false,
      searchTerm: '',
      view: 'lines',
      relationReversed: false,
    };
  }

  handleReverseRelation() {
    this.setState({ relationReversed: !this.state.relationReversed });
  }

  handleSort(field, orderAsc) {
    this.setState({ sortBy: field, orderAsc });
  }

  handleSearch(value) {
    this.setState({ searchTerm: value });
  }

  renderLines(paginationOptions) {
    const {
      entityId,
      classes,
      history,
      riskId,
      t,
    } = this.props;
    const dataColumns = {
      relationship_type: {
        label: 'Title',
        width: '15%',
        isSortable: true,
      },
      entity_type: {
        label: 'Response type',
        width: '15%',
        isSortable: false,
      },
      name: {
        label: 'Lifecycle',
        width: '15%',
        isSortable: false,
      },
      start_time: {
        label: 'Decision Maker',
        width: '15%',
        isSortable: true,
      },
      stop_time: {
        label: 'Start Date',
        width: '15%',
        isSortable: true,
      },
      confidence: {
        label: 'End Date',
        width: '12%',
        isSortable: true,
      },
      source: {
        label: 'Source',
        width: '12%',
        isSortable: true,
      },
    };
    return (
      <>
        <QueryRenderer
          query={remediationEntitiesQuery}
          variables={{ id: entityId }}
          render={({ props, retry }) => {
            if (props) {
              return (
                  <RemediationEntitiesLines
                  risk={props.risk}
                  paginationOptions={paginationOptions}
                  history={history}
                  dataColumns={dataColumns}
                  initialLoading={props === null}
                  displayRelation={true}
                  riskId={riskId}
                  entityId={entityId}
                  refreshQuery={retry}
                />
              );
            }
            return (
              <div style={{ height: '100%' }}>
                <List>
                  {Array.from(Array(5), (e, i) => (
                    <ListItem
                      key={i}
                      dense={true}
                      divider={true}
                      button={false}
                    >
                      <ListItemText
                        primary={
                          <div className={ classes.ListItem }>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                width={140}
                                height="100%"
                              />
                            </div>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                width={140}
                                height="100%"
                              />
                            </div>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                width={140}
                                height="100%"
                              />
                            </div>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                width={140}
                                height='100%'
                              />
                            </div>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                width={140}
                                height='100%'
                              />
                            </div>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="rect"
                                width={140}
                                height='100%'
                              />
                            </div>
                            <div
                              className={classes.bodyItem}
                            >
                              <Skeleton
                                animation="wave"
                                variant="circle"
                                width={30}
                                height={30}
                              />
                            </div>
                          </div>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            );
          }}
        />
      </>
    );
  }

  render() {
    const {
      view,
      sortBy,
      orderAsc,
      searchTerm,
    } = this.state;
    const { classes, entityId } = this.props;
    const paginationOptions = {
      elementId: entityId,
      search: searchTerm,
      orderBy: sortBy,
      orderMode: orderAsc ? 'asc' : 'desc',
    };
    return (
      <div style={{ height: '100%' }}>
        <div className="clearfix" />
          {view === 'lines' ? this.renderLines(paginationOptions) : ''}
      </div>
    );
  }
}

RemediationEntities.propTypes = {
  entityId: PropTypes.string,
  relationship_type: PropTypes.string,
  classes: PropTypes.object,
  riskId: PropTypes.string,
  risk: PropTypes.object,
  t: PropTypes.func,
  history: PropTypes.object,
};

export default compose(
  inject18n,
  withStyles(styles),
)(RemediationEntities);
