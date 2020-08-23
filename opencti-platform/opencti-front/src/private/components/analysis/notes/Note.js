import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import inject18n from '../../../../components/i18n';
import ContainerHeader from '../../common/containers/ContainerHeader';
import NoteDetails from './NoteDetails';
import NoteEdition from './NoteEdition';
import StixDomainObjectOverview from '../../common/stix_domain_objects/StixDomainObjectOverview';
import EntityExternalReferences from '../external_references/StixCoreObjectExternalReferences';
import Security, { KNOWLEDGE_KNUPDATE } from '../../../../utils/Security';
import StixCoreObjectNotes from './StixCoreObjectNotes';
import StixCoreObjectLatestHistory from '../../common/stix_core_objects/StixCoreObjectLatestHistory';

const styles = () => ({
  container: {
    margin: 0,
  },
  gridContainer: {
    marginBottom: 20,
  },
});

class NoteComponent extends Component {
  render() {
    const { classes, note } = this.props;
    return (
      <div className={classes.container}>
        <ContainerHeader container={note} />
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
        >
          <Grid item={true} xs={6}>
            <StixDomainObjectOverview stixDomainObject={note} />
          </Grid>
          <Grid item={true} xs={6}>
            <NoteDetails note={note} />
          </Grid>
        </Grid>
        <Grid
          container={true}
          spacing={3}
          classes={{ container: classes.gridContainer }}
          style={{ marginTop: 25 }}
        >
          <Grid item={true} xs={6}>
            <EntityExternalReferences entityId={note.id} />
          </Grid>
          <Grid item={true} xs={6}>
            <StixCoreObjectLatestHistory entityStandardId={note.standard_id} />
          </Grid>
        </Grid>
        <StixCoreObjectNotes entityId={note.id} />
        <Security needs={[KNOWLEDGE_KNUPDATE]}>
          <NoteEdition noteId={note.id} />
        </Security>
      </div>
    );
  }
}

NoteComponent.propTypes = {
  note: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
};

const Note = createFragmentContainer(NoteComponent, {
  note: graphql`
    fragment Note_note on Note {
      id
      standard_id
      stix_ids
      spec_version
      revoked
      confidence
      created
      modified
      created_at
      updated_at
      createdBy {
        ... on Identity {
          id
          name
          entity_type
        }
      }
      creator {
        name
      }
      objectLabel {
        edges {
          node {
            id
            value
            color
          }
        }
      }
      ...NoteDetails_note
      ...ContainerHeader_container
    }
  `,
});

export default compose(inject18n, withStyles(styles))(Note);
