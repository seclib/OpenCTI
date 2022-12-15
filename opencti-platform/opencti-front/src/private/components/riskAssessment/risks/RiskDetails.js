import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import * as R from 'ramda';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import { Information } from 'mdi-material-ui';
import inject18n from '../../../../components/i18n';
import { commitMutation } from '../../../../relay/environment';
import MarkDownField from '../../../../components/MarkDownField';
import RiskStatus from '../../common/form/RiskStatus';
import DatePickerField from '../../../../components/DatePickerField';
import ResourceType from '../../common/form/ResourceType';

const styles = (theme) => ({
  paper: {
    marginTop: '2%',
    padding: '1.5rem',
    borderRadius: 6,
    height: '75%',
  },
  link: {
    fontSize: '16px',
    font: 'DIN Next LT Pro',
  },
  chip: {
    color: theme.palette.header.text,
    height: 25,
    fontSize: 12,
    padding: '14px 12px',
    margin: '0 7px 7px 0',
    backgroundColor: theme.palette.header.background,
  },
  scrollBg: {
    background: theme.palette.header.background,
    width: '100%',
    color: 'white',
    padding: '10px 5px 10px 15px',
    borderRadius: '5px',
    lineHeight: '20px',
  },
  scrollDiv: {
    width: '100%',
    background: theme.palette.header.background,
    height: '78px',
    overflow: 'hidden',
    overflowY: 'scroll',
  },
  scrollObj: {
    color: theme.palette.header.text,
    fontFamily: 'sans-serif',
    padding: '0px',
    textAlign: 'left',
  },
  statusButton: {
    cursor: 'default',
    background: '#075AD333',
    marginBottom: '5px',
    border: '1px solid #075AD3',
  },
  gridContainer: {
    marginBottom: '5%',
  },
});

const riskDetailsEditMutation = graphql`
  mutation RiskDetailsEditMutation($id: ID!, $input: [EditInput]!) {
    editRisk(id: $id, input: $input) {
      id
      statement
      deadline
      risk_status
      accepted
      false_positive
      risk_adjusted
      vendor_dependency
    }
  }
`;

const RiskValidation = (t) => Yup.object().shape({
  statement: Yup.string().nullable(),
  risk_status: Yup.string().nullable(),
  deadline: Yup.string().nullable(),
  false_positive: Yup.string().nullable(),
  risk_adjusted: Yup.string().nullable(),
  vendor_dependency: Yup.string().nullable(),
  accepted: Yup.string().nullable(),
});

class RiskDetailsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      modelName: '',
    };
  }

  handleEditOpen(field) {
    this.setState({ open: !this.state.open, modelName: field });
  }

  handleSubmitField(name, value) {
    RiskValidation(this.props.t)
      .validateAt(name, { [name]: value })
      .then(() => {
        commitMutation({
          mutation: riskDetailsEditMutation,
          variables: { id: this.props.risk.id, input: { key: name, value } },
          onComplete: () => {
            this.setState({ modelName: '', open: false });
          },
        });
      })
      .catch(() => false);
  }

  render() {
    const {
      t,
      classes,
      risk,
      fldt,
    } = this.props;
    const riskDetectionSource = R.pipe(
      R.path(['origins']),
    )(risk);
    const initialValues = R.pipe(
      R.assoc('deadline', risk?.deadline || ''),
      R.assoc('statement', risk?.statement || ''),
      R.assoc('risk_status', risk?.risk_status || ''),
      R.assoc('risk_adjusted', risk?.risk_adjusted || ''),
      R.assoc('false_positive', risk?.false_positive || ''),
      R.assoc('vendor_dependency', risk?.vendor_dependency || ''),
      R.assoc('accepted', risk?.accepted || ''),
      R.pick([
        'deadline',
        'statement',
        'risk_status',
        'false_positive',
        'risk_adjusted',
        'vendor_dependency',
        'accepted',
      ]),
    )(risk);
    return (
      <div>
        <Typography variant="h4" gutterBottom={true}>
          {t('Details')}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
          >
            <Form>
              <Grid container spacing={3}>
                <Grid item={true} xs={6}>
                  <Typography
                    variant="h3"
                    color="textSecondary"
                    gutterBottom={true}
                    style={{ float: 'left', marginTop: 5 }}
                  >
                    {t('First Seen')}
                  </Typography>
                  <div style={{ float: 'left', margin: '1px 0 0 5px' }}>
                    <Tooltip
                      title={t(
                        'Identifies the date/time when the risk was first seen/observered.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                  </div>
                  <div className="clearfix" />
                  {risk.first_seen && fldt(risk.first_seen)}
                </Grid>
                <Grid item={true} xs={6}>
                  <Typography
                    variant="h3"
                    color="textSecondary"
                    gutterBottom={true}
                    style={{ float: 'left', marginTop: 5 }}
                  >
                    {t('Last Seen')}
                  </Typography>
                  <div style={{ float: 'left', margin: '1px 0 0 5px' }}>
                    <Tooltip
                      title={t(
                        'Idetifies the date/time when the risk was last seen/observed.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                  </div>
                  <div className="clearfix" />
                  {risk.last_seen && fldt(risk.last_seen)}
                </Grid>
                <Grid item={true} xs={12}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="h3"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      {t('Statement')}
                    </Typography>
                    <Tooltip
                      title={t(
                        'Identifies a summary of impact for how the risk affects the system.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                    <IconButton
                      size='small'
                      onClick={this.handleEditOpen.bind(this, 'statement')}
                    >
                      <Edit fontSize='inherit' />
                    </IconButton>
                  </div>
                  <div className="clearfix" />
                  {this.state.open && this.state.modelName === 'statement' ? (
                    <Field
                      component={MarkDownField}
                      name='statement'
                      fullWidth={true}
                      multiline={true}
                      variant='outlined'
                      onSubmit={this.handleSubmitField.bind(this)}
                    />
                  ) : (
                    <div className={classes.scrollBg}>
                      <div className={classes.scrollDiv}>
                        <div className={classes.scrollObj}>
                          {risk.statement && t(risk.statement)}
                        </div>
                      </div>
                    </div>
                  )}
                </Grid>
                <Grid item={true} xs={6}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="h3"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      {t('Risk Status')}
                    </Typography>
                    <Tooltip
                      title={t(
                        'Identifies the status of the associated risk.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                    <IconButton
                      size='small'
                      onClick={this.handleEditOpen.bind(this, 'risk_status')}
                    >
                      <Edit fontSize='inherit' />
                    </IconButton>
                  </div>
                  <div className="clearfix" />
                  {this.state.open && this.state.modelName === 'risk_status' ? (
                    <RiskStatus
                      variant='outlined'
                      name='risk_status'
                      size='small'
                      onChange={this.handleSubmitField.bind(this)}
                      fullWidth={true}
                      style={{ height: '38.09px', marginBottom: '3px' }}
                      containerstyle={{ width: '100%', padding: '0 0 1px 0' }}
                    />
                  ) : risk.risk_status && (
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.statusButton}
                    >
                      {t(risk.risk_status)}
                    </Button>
                  )}

                </Grid>
                <Grid item={true} xs={6}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="h3"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      {t('Deadline')}
                    </Typography>
                    <Tooltip
                      title={t(
                        'Identifies the date/time by which the risk must be resolved.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                    <IconButton
                      size='small'
                      onClick={this.handleEditOpen.bind(this, 'deadline')}
                    >
                      <Edit fontSize='inherit' />
                    </IconButton>
                  </div>
                  <div className="clearfix" />
                  {this.state.open && this.state.modelName === 'deadline' ? (
                    <Field
                      component={DatePickerField}
                      name='deadline'
                      fullWidth={true}
                      multiline={true}
                      variant='outlined'
                      onSubmit={this.handleSubmitField.bind(this)}
                      invalidDateMessage={t('The value must be a date (YYYY-MM-DD)')}
                    />
                  ) : risk.deadline && fldt(risk.deadline)
                  }
                </Grid>
                <Grid item={true} xs={12}>
                  <Typography
                    variant="h3"
                    color="textSecondary"
                    gutterBottom={true}
                    style={{ float: 'left', marginTop: 5 }}
                  >
                    {t('Detection Source')}
                  </Typography>
                  <div style={{ float: 'left', margin: '6px 0 0 5px' }}>
                    <Tooltip
                      title={t(
                        'Detection Source',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                  </div>
                  <div className="clearfix" />
                  {riskDetectionSource
                    && riskDetectionSource.map((value) => value.origin_actors.map((actor, i) => (
                      <Typography key={i}>
                        {actor.actor_ref.name && t(actor.actor_ref.name)}
                      </Typography>
                    )))}
                </Grid>
                <Grid item={true} xs={6}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="h3"
                        color="textSecondary"
                        gutterBottom={true}
                      >
                        {t('False Positive')}
                      </Typography>
                      <Tooltip
                        title={t(
                          'Identifies that the risk has been confirmed to be a false positive.',
                        )}
                      >
                        <Information fontSize="inherit" color="disabled" />
                      </Tooltip>
                      <IconButton
                        size='small'
                        onClick={this.handleEditOpen.bind(this, 'false_positive')}
                      >
                        <Edit fontSize='inherit' />
                      </IconButton>
                    </div>
                    <div className="clearfix" />
                    {this.state.open && this.state.modelName === 'false_positive' ? (
                      <ResourceType
                        variant='outlined'
                        name="false_positive"
                        size='small'
                        onChange={this.handleSubmitField.bind(this)}
                        fullWidth={true}
                        style={{ height: '38.09px' }}
                        containerstyle={{ width: '100%' }}
                      />
                    ) : risk.false_positive && (
                      <Button
                        variant="outlined"
                        size="small"
                        className={classes.statusButton}
                      >
                        {t(risk.false_positive)}
                      </Button>
                    )}
                  </div>
                </Grid>
                <Grid item={true} xs={6}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="h3"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      {t('Operationally Required')}
                    </Typography>
                    <Tooltip
                      title={t(
                        'Operationally Required',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                    <IconButton
                      size='small'
                      onClick={this.handleEditOpen.bind(this, 'accepted')}
                    >
                      <Edit fontSize='inherit' />
                    </IconButton>
                  </div>
                  <div className="clearfix" />
                  {this.state.open && this.state.modelName === 'accepted' ? (
                    <ResourceType
                      variant='outlined'
                      name="accepted"
                      size='small'
                      onChange={this.handleSubmitField.bind(this)}
                      fullWidth={true}
                      style={{ height: '38.09px' }}
                      containerstyle={{ width: '100%' }}
                    />
                  ) : risk.accepted && (
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.statusButton}
                    >
                      {t(risk.accepted)}
                    </Button>
                  )}
                </Grid>
                <Grid item={true} xs={6}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="h3"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      {t('Risk Adjusted')}
                    </Typography>
                    <Tooltip
                      title={t(
                        'Identifies that mitigating factors were identified or implemented, reducing the likelihood or impact of the risk.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                    <IconButton
                      size='small'
                      onClick={this.handleEditOpen.bind(this, 'risk_adjusted')}
                    >
                      <Edit fontSize='inherit' />
                    </IconButton>
                  </div>
                  <div className="clearfix" />
                  {this.state.open && this.state.modelName === 'risk_adjusted' ? (
                    <ResourceType
                      variant='outlined'
                      name="risk_adjusted"
                      size='small'
                      onChange={this.handleSubmitField.bind(this)}
                      fullWidth={true}
                      style={{ height: '38.09px' }}
                      containerstyle={{ width: '100%' }}
                    />
                  ) : risk.risk_adjusted && (
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.statusButton}
                    >
                      {t(risk.risk_adjusted)}
                    </Button>
                  )}
                </Grid>
                <Grid item={true} xs={6}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography
                      variant="h3"
                      color="textSecondary"
                      gutterBottom={true}
                    >
                      {t('Vendor Dependency')}
                    </Typography>
                    <Tooltip
                      title={t(
                        'Identifies that a vendor resolution is pending, but not yet available.',
                      )}
                    >
                      <Information fontSize="inherit" color="disabled" />
                    </Tooltip>
                    <IconButton
                      size='small'
                      onClick={this.handleEditOpen.bind(this, 'vendor_dependency')}
                    >
                      <Edit fontSize='inherit' />
                    </IconButton>
                  </div>
                  <div className="clearfix" />
                  {this.state.open && this.state.modelName === 'vendor_dependency' ? (
                    <ResourceType
                      variant='outlined'
                      name="vendor_dependency"
                      size='small'
                      onChange={this.handleSubmitField.bind(this)}
                      fullWidth={true}
                      style={{ height: '38.09px' }}
                      containerstyle={{ width: '100%' }}
                    />
                  ) : risk.vendor_dependency && (
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.statusButton}
                    >
                      {t(risk.vendor_dependency)}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Paper>
      </div>
    );
  }
}

RiskDetailsComponent.propTypes = {
  risk: PropTypes.object,
  classes: PropTypes.object,
  t: PropTypes.func,
  fldt: PropTypes.func,
};

const RiskDetails = createFragmentContainer(
  RiskDetailsComponent,
  {
    risk: graphql`
      fragment RiskDetails_risk on Risk {
        id
        statement
        risk_status
        deadline
        false_positive
        risk_adjusted
        accepted
        vendor_dependency
        impacted_control_id
        first_seen
        last_seen
        origins {
          origin_actors {
            actor_type
            actor_ref {
              ... on AssessmentPlatform {
                id
                name
              }
              ... on Component {
                id
                component_type
                name
              }
              ... on OscalParty {
                id
                party_type
                name
              }
            }
          }
        }
      }
    `,
  },
);

export default compose(inject18n, withStyles(styles))(RiskDetails);
