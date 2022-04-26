/* eslint-disable */
/* refactor */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import inject18n from '../../../../../components/i18n';
import EntityRoleDetails from './EntityRoleDetails';
import CyioDomainObjectHeader from '../../../common/stix_domain_objects/CyioDomainObjectHeader';
import Security, { KNOWLEDGE_KNUPDATE } from '../../../../../utils/Security';
import TopBarBreadcrumbs from '../../../nav/TopBarBreadcrumbs';
import CyioCoreObjectOrCyioCoreRelationshipNotes from '../../../analysis/notes/CyioCoreObjectOrCyioCoreRelationshipNotes';
import CyioCoreObjectExternalReferences from '../../../analysis/external_references/CyioCoreObjectExternalReferences';

const styles = () => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
});

class EmtityRoleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: false,
    };
  }

  handleDisplayEdit() {
    this.setState({ displayEdit: !this.state.displayEdit });
  }

  handleOpenNewCreation() {
    this.props.history.push({
      pathname: '/defender HQ/assets/devices',
      openNewCreation: true,
    });
  }

  render() {
    const {
      classes,
      device,
      history,
      refreshQuery,
      location,
    } = this.props;
    return (
      <>
        {!this.state.displayEdit && !location.openEdit ? (
          <div className={classes.container}>
            <CyioDomainObjectHeader
              cyioDomainObject={device}
              history={history}
              // PopoverComponent={<DevicePopover />}
              handleDisplayEdit={this.handleDisplayEdit.bind(this)}
              handleOpenNewCreation={this.handleOpenNewCreation.bind(this)}
            // OperationsComponent={<DeviceDeletion />}
            />
            <TopBarBreadcrumbs />
            <Grid
              container={true}
              spacing={3}
              classes={{ container: classes.gridContainer }}
            >
              <Grid item={true} xs={12}>
                <EntityRoleDetails device={device} history={history} refreshQuery={refreshQuery} />
              </Grid>
            </Grid>
            <Grid
              container={true}
              spacing={3}
              classes={{ container: classes.gridContainer }}
              style={{ marginTop: 25 }}
            >
              <Grid item={true} xs={6}>
                <CyioCoreObjectExternalReferences
                  typename={device.__typename}
                  externalReferences={device.external_references}
                  fieldName='external_references'
                  cyioCoreObjectId={device?.id}
                  refreshQuery={refreshQuery}
                />
              </Grid>
              <Grid item={true} xs={6}>
                <CyioCoreObjectOrCyioCoreRelationshipNotes
                  typename={device.__typename}
                  notes={device.notes}
                  refreshQuery={refreshQuery}
                  fieldName='notes'
                  marginTop='0px'
                  cyioCoreObjectOrCyioCoreRelationshipId={device?.id}
                />
              </Grid>
            </Grid>
            {/* <Security needs={[KNOWLEDGE_KNUPDATE]}>
                <DeviceEdition deviceId={device?.id} />
              </Security> */}
          </div>
        ) : (
          // <Security needs={[KNOWLEDGE_KNUPDATE]}>
          {/* <DeviceEdition
            open={this.state.openEdit}
            deviceId={device?.id}
            history={history}
          /> */}
          // </Security>
        )}
      </>
    );
  }
}

EmtityRoleComponent.propTypes = {
  device: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  refreshQuery: PropTypes.func,
};

const EntityRole = createFragmentContainer(EmtityRoleComponent, {
  device: graphql`
    fragment EntityRole_device on HardwareAsset {
      __typename
      id
      name
      asset_id
      asset_type
      asset_tag
      description
      version
      vendor_name
      serial_number
      release_date
      labels {
        __typename
        id
        name
        color
        entity_type
        description
      }
      external_references {
        __typename
        id
        source_name
        description
        entity_type
        url
        hashes {
          value
        }
        external_id
      }
      notes {
        __typename
        id
        # created
        # modified
        entity_type
        abstract
        content
        authors
      }
      # responsible_parties
      operational_status
      ...EntityRoleDetails_device
    }
  `,
});

export default compose(inject18n, withStyles(styles))(EntityRole);
