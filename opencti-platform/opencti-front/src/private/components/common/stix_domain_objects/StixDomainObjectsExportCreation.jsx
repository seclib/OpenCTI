import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose, filter, flatten, fromPairs, includes, map, propOr, uniq, zip } from 'ramda';
import withStyles from '@mui/styles/withStyles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { Add } from '@mui/icons-material';
import { createFragmentContainer, graphql } from 'react-relay';
import { Field, Form, Formik } from 'formik';
import MenuItem from '@mui/material/MenuItem';
import * as Yup from 'yup';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import ObjectMarkingField from '../form/ObjectMarkingField';
import inject18n from '../../../../components/i18n';
import { commitMutation, MESSAGING$ } from '../../../../relay/environment';
import SelectField from '../../../../components/SelectField';
import { ExportContext } from '../../../../utils/ExportContextProvider';
import { fieldSpacingContainerStyle } from '../../../../utils/field';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = 'TransitionSlide';

const styles = () => ({
  createButton: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 2000,
  },
  listIcon: {
    marginRight: 0,
  },
  item: {
    padding: '0 0 0 10px',
  },
  itemField: {
    padding: '0 15px 0 15px',
  },
});

export const StixDomainObjectsExportCreationMutation = graphql`
  mutation StixDomainObjectsExportCreationMutation(
    $format: String!
    $exportType: String!
    $contentMaxMarkings: [String]
    $fileMarkings: [String]
    $exportContext: ExportContext
    $search: String
    $orderBy: StixDomainObjectsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
    $relationship_type: [String]
    $selectedIds: [String]
  ) {
    stixDomainObjectsExportAsk(
      format: $format
      exportType: $exportType
      contentMaxMarkings: $contentMaxMarkings
      fileMarkings: $fileMarkings
      exportContext: $exportContext
      search: $search
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
      relationship_type: $relationship_type
      selectedIds: $selectedIds
    ) {
      id
    }
  }
`;

const exportValidation = (t) => Yup.object().shape({
  format: Yup.string().required(t('This field is required')),
  type: Yup.string().required(t('This field is required')),
  contentMaxMarkingDefinitions: Yup.array().min(1, 'This field is required').required(t('This field is required')), // rename to contentMaxMarkings
  fileMarkingDefinitions: Yup.array().min(1, 'This field is required').required(t('This field is required')), // rename to fileMarkings
});

export const scopesConn = (exportConnectors) => {
  const scopes = uniq(flatten(exportConnectors.map((c) => c.connector_scope)));
  const connectors = scopes.map((s) => {
    const filteredConnectors = filter(
      (e) => includes(s, e.connector_scope),
      exportConnectors,
    );
    return map(
      (x) => ({ data: { name: x.name, active: x.active } }),
      filteredConnectors,
    );
  });
  const zipped = zip(scopes, connectors);
  return fromPairs(zipped);
};

class StixDomainObjectsExportCreationComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  onSubmit(selectedIds, values, { setSubmitting, resetForm }) {
    const { paginationOptions, exportContext } = this.props;

    const contentMaxMarkingDefinitions = values.contentMaxMarkingDefinitions.map(({ value }) => value); // rename to contentMaxMarkings
    const fileMarkingDefinitions = values.fileMarkingDefinitions.map(({ value }) => value); // rename to fileMarkings

    commitMutation({
      mutation: StixDomainObjectsExportCreationMutation,
      variables: {
        format: values.format,
        exportType: values.type,
        contentMaxMarkings: contentMaxMarkingDefinitions,
        fileMarkings: fileMarkingDefinitions,
        exportContext,
        ...paginationOptions,
        selectedIds,
      },
      onCompleted: () => {
        setSubmitting(false);
        resetForm();
        if (this.props.onExportAsk) this.props.onExportAsk();
        this.handleClose();
        MESSAGING$.notifySuccess('Export successfully started');
      },
    });
  }

  render() {
    const { classes, t, data } = this.props;
    const connectorsExport = propOr([], 'connectorsForExport', data);
    const exportScopes = uniq(
      flatten(map((c) => c.connector_scope, connectorsExport)),
    );
    const exportConnsPerFormat = scopesConn(connectorsExport);
    const isExportActive = (format) => filter((x) => x.data.active, exportConnsPerFormat[format]).length > 0;
    const isExportPossible = filter((x) => isExportActive(x), exportScopes).length > 0;

    // global export pdf can not be used here
    // export-report-pdf connector needs precise entity_type to work but the type sent here is incompatible
    const availableFormat = exportScopes.filter((exportScope) => exportScope !== 'application/pdf');

    return (
      <ExportContext.Consumer>
        {({ selectedIds }) => {
          return (
            <>
              <Tooltip
                title={
                  isExportPossible
                    ? t('Generate an export')
                    : t('No export connector available to generate an export')
                }
                aria-label="generate-export"
              >
                <Fab
                  onClick={this.handleOpen.bind(this)}
                  color="secondary"
                  aria-label="Add"
                  className={classes.createButton}
                  disabled={!isExportPossible}
                >
                  <Add />
                </Fab>
              </Tooltip>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  format: '',
                  type: 'simple',
                  maxMarkingDefinition: 'none',
                  contentMaxMarkingDefinitions: [], // rename to contentMaxMarkings
                  fileMarkingsDefinitions: [], // rename to fileMarkings
                }}
                validationSchema={exportValidation(t)}
                onSubmit={this.onSubmit.bind(this, selectedIds)}
                onReset={this.handleClose.bind(this)}
              >
                {({ submitForm, handleReset, isSubmitting, resetForm }) => (
                  <Form>
                    <Dialog
                      PaperProps={{ elevation: 1 }}
                      open={this.state.open}
                      onClose={resetForm}
                      fullWidth={true}
                    >
                      <DialogTitle>{t('Generate an export')}</DialogTitle>
                      <DialogContent>
                        <Field
                          component={SelectField}
                          variant="standard"
                          name="format"
                          label={t('Export format')}
                          fullWidth={true}
                          containerstyle={{ width: '100%' }}
                        >
                          {availableFormat.map((value, i) => (
                            <MenuItem
                              key={i}
                              value={value}
                              disabled={!isExportActive(value)}
                            >
                              {value}
                            </MenuItem>
                          ))}
                        </Field>
                        <Field
                          component={SelectField}
                          variant="standard"
                          name="type"
                          label={t('Export type')}
                          fullWidth={true}
                          containerstyle={fieldSpacingContainerStyle}
                        >
                          <MenuItem value="simple">
                            {t('Simple export (just the entity)')}
                          </MenuItem>
                          <MenuItem value="full">
                            {t(
                              'Full export (entity and first neighbours)',
                            )}
                          </MenuItem>
                        </Field>
                        <ObjectMarkingField
                          name="contentMaxMarkingDefinitions"
                          label={t('Content max marking definition levels')}
                          style={fieldSpacingContainerStyle}
                        />
                        <ObjectMarkingField
                          name="fileMarkingDefinitions"
                          label={t('File marking definition levels')}
                          style={fieldSpacingContainerStyle}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleReset} disabled={isSubmitting}>
                          {t('Cancel')}
                        </Button>
                        <Button
                          color="secondary"
                          onClick={submitForm}
                          disabled={isSubmitting}
                        >
                          {t('Create')}
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Form>
                )}
              </Formik>
            </>
          );
        }}
      </ExportContext.Consumer>
    );
  }
}

const StixDomainObjectsExportCreations = createFragmentContainer(
  StixDomainObjectsExportCreationComponent,
  {
    data: graphql`
      fragment StixDomainObjectsExportCreation_data on Query {
        connectorsForExport {
          id
          name
          active
          connector_scope
          updated_at
        }
      }
    `,
  },
);

StixDomainObjectsExportCreations.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func,
  data: PropTypes.object,
  exportContext: PropTypes.object,
  paginationOptions: PropTypes.object,
  onExportAsk: PropTypes.func,
};

export default compose(
  inject18n,
  withStyles(styles),
)(StixDomainObjectsExportCreations);
