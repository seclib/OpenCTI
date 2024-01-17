import React, { FunctionComponent, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { graphql, useMutation } from 'react-relay';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';
import { IngestionCsvLinesPaginationQuery$variables } from '@components/data/ingestionCsv/__generated__/IngestionCsvLinesPaginationQuery.graphql';
import { FormikConfig } from 'formik/dist/types';
import { Option } from '@components/common/form/ReferenceField';
import { CsvAuthType } from '@components/data/ingestionCsv/__generated__/IngestionCsvCreationMutation.graphql';
import CsvMapperField from '@components/common/form/CsvMapperField';
import IngestionCsvMapperTestDialog from '@components/data/ingestionCsv/IngestionCsvMapperTestDialog';
import Drawer, { DrawerVariant } from '../../common/drawer/Drawer';
import { useFormatter } from '../../../../components/i18n';
import TextField from '../../../../components/TextField';
import CreatorField from '../../common/form/CreatorField';
import { fieldSpacingContainerStyle } from '../../../../utils/field';
import { insertNode } from '../../../../utils/store';
import SelectField from '../../../../components/SelectField';
import type { Theme } from '../../../../components/Theme';
import DateTimePickerField from '../../../../components/DateTimePickerField';

const useStyles = makeStyles<Theme>((theme) => ({
  buttons: {
    marginTop: 20,
    textAlign: 'right',
  },
  button: {
    marginLeft: theme.spacing(2),
  },
}));

const ingestionCsvCreationMutation = graphql`
  mutation IngestionCsvCreationMutation($input: IngestionCsvAddInput!) {
    ingestionCsvAdd(input: $input) {
      ...IngestionCsvLine_node
    }
  }
`;

interface IngestionCsvCreationProps {
  paginationOptions: IngestionCsvLinesPaginationQuery$variables;
}

export interface IngestionCsvCreationForm {
  name: string
  description: string
  uri: string
  csvMapper_id: string | Option
  authentication_type: CsvAuthType
  authentication_value: string
  current_state_date: Date | null
  user_id: string | Option
  username?: string
  password?: string
  cert?: string
  key?: string
  ca?: string
}

const IngestionCsvCreation: FunctionComponent<IngestionCsvCreationProps> = ({ paginationOptions }) => {
  const { t_i18n } = useFormatter();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);

  const ingestionCsvCreationValidation = () => Yup.object().shape({
    name: Yup.string().required(t_i18n('This field is required')),
    description: Yup.string().nullable(),
    uri: Yup.string().required(t_i18n('This field is required')),
    authentication_type: Yup.string().required(t_i18n('This field is required')),
    authentication_value: Yup.string().nullable(),
    current_state_date: Yup.date()
      .typeError(t_i18n('The value must be a datetime (yyyy-MM-dd hh:mm (a|p)m)'))
      .nullable(),
    csvMapper_id: Yup.object().required(t_i18n('This field is required')),
    username: Yup.string().nullable(),
    password: Yup.string().nullable(),
    cert: Yup.string().nullable(),
    key: Yup.string().nullable(),
    ca: Yup.string().nullable(),
    user_id: Yup.object().nullable(),
  });

  const [commit] = useMutation(ingestionCsvCreationMutation);
  const onSubmit: FormikConfig<IngestionCsvCreationForm>['onSubmit'] = (
    values,
    { setSubmitting, resetForm },
  ) => {
    let authenticationValue = values.authentication_value;
    if (values.authentication_type === 'basic') {
      authenticationValue = `${values.username}:${values.password}`;
    } else if (values.authentication_type === 'certificate') {
      authenticationValue = `${values.cert}:${values.key}:${values.ca}`;
    }
    const userId = typeof values.user_id === 'string' ? values.user_id : values.user_id.value;
    const input = {
      name: values.name,
      description: values.description,
      uri: values.uri,
      csvMapper_id: typeof values.csvMapper_id === 'string' ? values.csvMapper_id : values.csvMapper_id.value,
      authentication_type: values.authentication_type,
      authentication_value: authenticationValue,
      current_state_date: values.current_state_date,
      user_id: userId,
    };
    commit({
      variables: {
        input,
      },
      updater: (store) => {
        insertNode(
          store,
          'Pagination_ingestionCsvs',
          paginationOptions,
          'ingestionCsvAdd',
        );
      },
      onCompleted: () => {
        setSubmitting(false);
        resetForm();
      },
    });
  };

  return (
    <Drawer
      title={t_i18n('Create a CSV ingester')}
      variant={DrawerVariant.createWithPanel}
    >
      {({ onClose }) => (
        <Formik<IngestionCsvCreationForm>
          initialValues={{
            name: '',
            description: '',
            uri: '',
            csvMapper_id: '',
            authentication_type: 'none',
            authentication_value: '',
            current_state_date: null,
            user_id: '',
            username: '',
            password: '',
            cert: '',
            key: '',
            ca: '',
          }}
          validationSchema={ingestionCsvCreationValidation}
          onSubmit={onSubmit}
          onReset={onClose}
        >
          {({ submitForm, handleReset, isSubmitting, values }) => (
            <Form style={{ margin: '20px 0 20px 0' }}>
              <Field
                component={TextField}
                variant="standard"
                name="name"
                label={t_i18n('Name')}
                fullWidth={true}
              />
              <Field
                component={TextField}
                variant="standard"
                name="description"
                label={t_i18n('Description')}
                fullWidth={true}
                style={fieldSpacingContainerStyle}
              />
              <Field
                component={DateTimePickerField}
                name="current_state_date"
                TextFieldProps={{
                  label: t_i18n('Import from date (empty = all Csv possible items)'),
                  variant: 'standard',
                  fullWidth: true,
                }}
              />
              <Field
                component={TextField}
                variant="standard"
                name="uri"
                label={t_i18n('CSV URL')}
                fullWidth={true}
                style={fieldSpacingContainerStyle}
              />
              <CsvMapperField
                name="csvMapper_id"
                isOptionEqualToValue={(option: Option, value: string) => option.value === value}
              />
              <Field
                component={SelectField}
                variant="standard"
                name="authentication_type"
                label={t_i18n('Authentication type')}
                fullWidth={true}
                containerstyle={{
                  width: '100%',
                  marginTop: 20,
                }}
              >
                <MenuItem value="none">{t_i18n('None')}</MenuItem>
                <MenuItem value="basic">
                  {t_i18n('Basic user / password')}
                </MenuItem>
                <MenuItem value="bearer">{t_i18n('Bearer token')}</MenuItem>
                <MenuItem value="certificate">
                  {t_i18n('Client certificate')}
                </MenuItem>
              </Field>
              {values.authentication_type === 'basic' && (
                <>
                  <Field
                    component={TextField}
                    variant="standard"
                    name="username"
                    label={t_i18n('Username')}
                    fullWidth={true}
                    style={fieldSpacingContainerStyle}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="password"
                    label={t_i18n('Password')}
                    fullWidth={true}
                    style={fieldSpacingContainerStyle}
                  />
                </>
              )}
              {values.authentication_type === 'bearer' && (
                <Field
                  component={TextField}
                  variant="standard"
                  name="authentication_value"
                  label={t_i18n('Token')}
                  fullWidth={true}
                  style={fieldSpacingContainerStyle}
                />
              )}
              {values.authentication_type === 'certificate' && (
                <>
                  <Field
                    component={TextField}
                    variant="standard"
                    name="cert"
                    label={t_i18n('Certificate (base64)')}
                    fullWidth={true}
                    style={fieldSpacingContainerStyle}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="key"
                    label={t_i18n('Key (base64)')}
                    fullWidth={true}
                    style={fieldSpacingContainerStyle}
                  />
                  <Field
                    component={TextField}
                    variant="standard"
                    name="ca"
                    label={t_i18n('CA certificate (base64)')}
                    fullWidth={true}
                    style={fieldSpacingContainerStyle}
                  />
                </>
              )}
              <CreatorField
                name="user_id"
                label={t_i18n(
                  'User responsible for data creation (empty = System)',
                )}
                isOptionEqualToValue={(option: Option, value: string) => option.value === value}
                containerStyle={fieldSpacingContainerStyle}
              />
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  classes={{ root: classes.button }}
                >
                  {t_i18n('Cancel')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                  classes={{ root: classes.button }}
                  disabled={!(values.uri && values.csvMapper_id)}
                >
                  {t_i18n('Verify')}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={submitForm}
                  disabled={isSubmitting || isCreateDisabled}
                  classes={{ root: classes.button }}
                >
                  {t_i18n('Create')}
                </Button>
              </div>
              <IngestionCsvMapperTestDialog
                open={open}
                onClose={() => setOpen(false)}
                uri={values.uri}
                csvMapperId={values.csvMapper_id}
                setIsCreateDisabled={setIsCreateDisabled}
              />
            </Form>
          )}
        </Formik>
      )}
    </Drawer>
  );
};

export default IngestionCsvCreation;
