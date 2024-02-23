import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import { Add, Close, TextFieldsOutlined } from '@mui/icons-material';
import { assoc, compose, dissoc, filter, fromPairs, includes, map, pipe, pluck, prop, propOr, sortBy, toLower, toPairs } from 'ramda';
import * as Yup from 'yup';
import { graphql } from 'react-relay';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import makeStyles from '@mui/styles/makeStyles';
import { ListItemButton } from '@mui/material';
import { commitMutation, handleErrorInForm, QueryRenderer, MESSAGING$, commitMutationWithPromise } from '../../../../relay/environment';
import TextField from '../../../../components/TextField';
import SwitchField from '../../../../components/fields/SwitchField';
import CreatedByField from '../../common/form/CreatedByField';
import ObjectLabelField from '../../common/form/ObjectLabelField';
import ObjectMarkingField from '../../common/form/ObjectMarkingField';
import { stixCyberObservablesLinesAttributesQuery, stixCyberObservablesLinesSubTypesQuery } from './StixCyberObservablesLines';
import { parse } from '../../../../utils/Time';
import MarkdownField from '../../../../components/fields/MarkdownField';
import { ExternalReferencesField } from '../../common/form/ExternalReferencesField';
import DateTimePickerField from '../../../../components/DateTimePickerField';
import ArtifactField from '../../common/form/ArtifactField';
import OpenVocabField from '../../common/form/OpenVocabField';
import { fieldSpacingContainerStyle } from '../../../../utils/field';
import { insertNode } from '../../../../utils/store';
import { useFormatter } from '../../../../components/i18n';
import useVocabularyCategory from '../../../../utils/hooks/useVocabularyCategory';
import { convertMarking } from '../../../../utils/edition';
import CustomFileUploader from '../../common/files/CustomFileUploader';
import useAttributes from '../../../../utils/hooks/useAttributes';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    minHeight: '100vh',
    width: '50%',
    position: 'fixed',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    padding: 0,
  },
  createButton: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    transition: theme.transitions.create('right', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  createButtonContextual: {
    position: 'fixed',
    bottom: 30,
    right: 30,
    zIndex: 2000,
  },
  buttons: {
    marginTop: 20,
    textAlign: 'right',
  },
  button: {
    marginLeft: theme.spacing(2),
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
    padding: '10px 20px 20px 20px',
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const stixCyberObservableMutation = graphql`
  mutation StixCyberObservableCreationMutation(
    $type: String!
    $x_opencti_score: Int
    $x_opencti_description: String
    $createIndicator: Boolean
    $createdBy: String
    $objectMarking: [String]
    $objectLabel: [String]
    $externalReferences: [String]
    $AutonomousSystem: AutonomousSystemAddInput
    $Directory: DirectoryAddInput
    $DomainName: DomainNameAddInput
    $EmailAddr: EmailAddrAddInput
    $EmailMessage: EmailMessageAddInput
    $EmailMimePartType: EmailMimePartTypeAddInput
    $Artifact: ArtifactAddInput
    $StixFile: StixFileAddInput
    $X509Certificate: X509CertificateAddInput
    $IPv4Addr: IPv4AddrAddInput
    $IPv6Addr: IPv6AddrAddInput
    $MacAddr: MacAddrAddInput
    $Mutex: MutexAddInput
    $NetworkTraffic: NetworkTrafficAddInput
    $Process: ProcessAddInput
    $Software: SoftwareAddInput
    $Url: UrlAddInput
    $UserAccount: UserAccountAddInput
    $WindowsRegistryKey: WindowsRegistryKeyAddInput
    $WindowsRegistryValueType: WindowsRegistryValueTypeAddInput
    $Hostname: HostnameAddInput
    $CryptographicKey: CryptographicKeyAddInput
    $CryptocurrencyWallet: CryptocurrencyWalletAddInput
    $Text: TextAddInput
    $UserAgent: UserAgentAddInput
    $BankAccount: BankAccountAddInput
    $PhoneNumber: PhoneNumberAddInput
    $PaymentCard: PaymentCardAddInput
    $MediaContent: MediaContentAddInput
    $TrackingNumber: TrackingNumberAddInput
    $Credential: CredentialAddInput
  ) {
    stixCyberObservableAdd(
      type: $type
      x_opencti_score: $x_opencti_score
      x_opencti_description: $x_opencti_description
      createIndicator: $createIndicator
      createdBy: $createdBy
      objectMarking: $objectMarking
      objectLabel: $objectLabel
      externalReferences: $externalReferences
      AutonomousSystem: $AutonomousSystem
      Directory: $Directory
      DomainName: $DomainName
      EmailAddr: $EmailAddr
      EmailMessage: $EmailMessage
      EmailMimePartType: $EmailMimePartType
      Artifact: $Artifact
      StixFile: $StixFile
      X509Certificate: $X509Certificate
      IPv4Addr: $IPv4Addr
      IPv6Addr: $IPv6Addr
      MacAddr: $MacAddr
      Mutex: $Mutex
      NetworkTraffic: $NetworkTraffic
      Process: $Process
      Software: $Software
      Url: $Url
      UserAccount: $UserAccount
      WindowsRegistryKey: $WindowsRegistryKey
      WindowsRegistryValueType: $WindowsRegistryValueType
      Hostname: $Hostname
      CryptographicKey: $CryptographicKey
      CryptocurrencyWallet: $CryptocurrencyWallet
      Text: $Text
      UserAgent: $UserAgent
      BankAccount: $BankAccount
      PhoneNumber: $PhoneNumber
      PaymentCard: $PaymentCard
      MediaContent: $MediaContent
      TrackingNumber: $TrackingNumber
      Credential: $Credential
    ) {
      id
      standard_id
      entity_type
      parent_types
      observable_value
      x_opencti_description
      created_at
      createdBy {
        ... on Identity {
          id
          name
          entity_type
        }
      }
      objectMarking {
        id
        definition_type
        definition
        x_opencti_order
        x_opencti_color
      }
      objectLabel {
        id
        value
        color
      }
      ... on Software {
        name
      }
    }
  }
`;
let validObservables = 0;
let errorObservables = 0;
let totalObservables = 0;
const error_array = [];
// const stixCyberObservableValidation = () => Yup.object().shape({
//   x_opencti_score: Yup.number().nullable(),
//   x_opencti_description: Yup.string().nullable(),
//   createIndicator: Yup.boolean(),
// });
const StixCyberObservableCreation = ({
  contextual,
  open,
  handleClose,
  type,
  display,
  speeddial,
  inputValue,
  paginationKey,
  paginationOptions,
  defaultCreatedBy = null,
  defaultMarkingDefinitions = null,
}) => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const { isVocabularyField, fieldToCategory } = useVocabularyCategory();
  const { booleanAttributes, dateAttributes, multipleAttributes, numberAttributes, ignoredAttributes } = useAttributes();
  const [status, setStatus] = useState({ open: false, type: type ?? null });
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [progressBar, setProgressBar] = React.useState(0);
  const [progressBarMax, setProgressBarMax] = React.useState(100);
  const handleOpen = () => setStatus({ open: true, type: status.type });
  const localHandleClose = () => setStatus({ open: false, type: type ?? null });
  const selectType = (selected) => setStatus({ open: status.open, type: selected });
  const [genericValueFieldDisabled, setGenericValueFieldDisabled] = useState(false);
  const bulkAddMsg = t_i18n('Multiple values entered. Edit with the TT button');

  const progressReset = () => {
    setOpenProgressDialog(false);
    setProgressBarMax(100);
    errorObservables = 0;
    validObservables = 0;
    setProgressBar(0);
  };
  const handleClickCloseProgress = () => {
    setOpenProgressDialog(false);
  };
  const onSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    let adaptedValues = values;
    function handlePromiseResult(valueList) {
      totalObservables = valueList.length;
      let closeFormWithAnySuccess = false;
      errorObservables += error_array.length;
      if (error_array.length > 0) {
        let message_string = '';
        if (validObservables > 0) {
          message_string = `${validObservables}/${totalObservables} ${t_i18n('were added successfully.')}`;
          closeFormWithAnySuccess = true;
        }
        message_string += ` ${errorObservables}/${totalObservables} ${t_i18n('observables contained errors and were not added.')} `;
        const consolidated_errors = { res: { errors: error_array[0] } };
        // Short Error message, just has total success and failure counts with translation support
        consolidated_errors.res.errors[0].message = message_string;
        // Long Error message with all errors
        // consolidated_errors.res.errors[0].message = message_string + error_messages.join('\n');
        // Toast Error Message to Screen - Will not close the form since errors exist for correction.
        // - ##########################################################
        // Reset the error array, for next time user submits content
        error_array.splice(0, error_array.length);
        // - ##########################################################
        handleErrorInForm(consolidated_errors, setErrors);
        const combinedObservables = validObservables + errorObservables;
        if (combinedObservables === totalObservables) {
          progressReset();
        }
      } else {
        let bulk_success_message = `${validObservables}/${totalObservables} ${t_i18n('were added successfully.')}`;
        if (totalObservables === 1) {
          // This is for consistent messaging when adding just (1) Observable
          bulk_success_message = t_i18n('Observable successfully added');
          progressReset();
        }
        // Toast Message on Bulk Add Success
        MESSAGING$.notifySuccess(bulk_success_message);
        closeFormWithAnySuccess = true;
        if (validObservables === totalObservables) {
          progressReset();
        }
      }
      // Close the form if any observables were successfully added.
      if (closeFormWithAnySuccess === true) {
        setGenericValueFieldDisabled(false);
        localHandleClose();
        setOpenProgressDialog(false);
      }
    }
    function updateProgress(position, batchSize) {
      if (position % batchSize === 0) {
        setProgressBar((prevProgress) => prevProgress + 1);
      }
    }
    async function processPromises(chunkValueList, observableType, finalValues, position, batchSize, valueList) {
      const promises = chunkValueList.map((value) => commitMutationWithPromise({
        mutation: stixCyberObservableMutation,
        variables: {
          ...finalValues,
          [observableType]: {
            ...adaptedValues,
            obsContent: values.obsContent?.value,
            value,
          },
        },
        updater: (store) => insertNode(
          store,
          paginationKey,
          paginationOptions,
          'stixCyberObservableAdd',
        ),
        onCompleted: () => {
          setSubmitting(false);
          resetForm();
          localHandleClose();
        },
        onError: () => {
          setSubmitting(false);
        },
      }));
      await Promise.allSettled(promises).then((results) => {
        results.forEach(({ status: promiseStatus, reason }) => {
          if (promiseStatus === 'fulfilled') {
            validObservables += 1;
          } else {
            error_array.push(reason);
          }
        });
      });
      updateProgress(position, batchSize);
      handlePromiseResult(valueList);
    }
    if (adaptedValues) { // Verify not null for DeepScan compliance
      // Bulk Add Modal was used
      if (adaptedValues.value && adaptedValues.bulk_value_field && adaptedValues.value === bulkAddMsg) {
        const array_of_bulk_values = adaptedValues.bulk_value_field.split(/\r?\n/);
        // Trim them just to remove any extra spacing on front or rear of string
        const trimmed_bulk_values = array_of_bulk_values.map((s) => s.trim());
        // Remove any "" or empty resulting elements
        const cleaned_bulk_values = trimmed_bulk_values.reduce((elements, i) => (i ? [...elements, i] : elements), []);
        // De-duplicate by unique then rejoin
        adaptedValues.value = [...new Set(cleaned_bulk_values)].join('\n');
      }

      // Potential dicts
      if (
        adaptedValues.hashes_MD5
        || adaptedValues['hashes_SHA-1']
        || adaptedValues['hashes_SHA-256']
        || adaptedValues['hashes_SHA-512']
      ) {
        adaptedValues.hashes = [];
        if (adaptedValues.hashes_MD5.length > 0) {
          adaptedValues.hashes.push({
            algorithm: 'MD5',
            hash: adaptedValues.hashes_MD5,
          });
        }
        if (adaptedValues['hashes_SHA-1'].length > 0) {
          adaptedValues.hashes.push({
            algorithm: 'SHA-1',
            hash: adaptedValues['hashes_SHA-1'],
          });
        }
        if (adaptedValues['hashes_SHA-256'].length > 0) {
          adaptedValues.hashes.push({
            algorithm: 'SHA-256',
            hash: adaptedValues['hashes_SHA-256'],
          });
        }
        if (adaptedValues['hashes_SHA-512'].length > 0) {
          adaptedValues.hashes.push({
            algorithm: 'SHA-512',
            hash: adaptedValues['hashes_SHA-512'],
          });
        }
      }
      adaptedValues = pipe(
        dissoc('x_opencti_description'),
        dissoc('x_opencti_score'),
        dissoc('createdBy'),
        dissoc('objectMarking'),
        dissoc('objectLabel'),
        dissoc('externalReferences'),
        dissoc('createIndicator'),
        dissoc('hashes_MD5'),
        dissoc('hashes_SHA-1'),
        dissoc('hashes_SHA-256'),
        dissoc('hashes_SHA-512'),
        toPairs,
        map((n) => (includes(n[0], dateAttributes)
          ? [n[0], n[1] ? parse(n[1]).format() : null]
          : n)),
        map((n) => (includes(n[0], numberAttributes)
          ? [n[0], n[1] ? parseInt(n[1], 10) : null]
          : n)),
        map((n) => (includes(n[0], multipleAttributes)
          ? [n[0], n[1] ? n[1].split(',') : null]
          : n)),
        fromPairs,
      )(adaptedValues);
      const observableType = status.type.replace(/(?:^|-|_)(\w)/g, (matches, letter) => letter.toUpperCase());
      const finalValues = {
        type: status.type,
        x_opencti_description:
          values.x_opencti_description.length > 0
            ? values.x_opencti_description
            : null,
        x_opencti_score: parseInt(values.x_opencti_score, 10),
        createdBy: propOr(null, 'value', values.createdBy),
        objectMarking: pluck('value', values.objectMarking),
        objectLabel: pluck('value', values.objectLabel),
        externalReferences: pluck('value', values.externalReferences),
        createIndicator: values.createIndicator,
        [observableType]: {
          ...adaptedValues,
          obsContent: values.obsContent?.value,
        },
      };
      if (values.file) {
        finalValues.file = values.file;
      }
      const commit = async () => {
        const valueList = values?.value !== '' ? values?.value?.split('\n') || values?.value : undefined;
        // Launch Progress Bar, as value data is about to be processed.
        // Only need Progress Bar, if more than 1 element being processed
        if (valueList !== undefined && valueList.length > 1) {
          setOpenProgressDialog(true);
        }
        if (valueList) {
          delete adaptedValues.value;
          delete adaptedValues.bulk_value_field;
          const batchSize = 5;
          let position = 0;
          while (position < valueList.length) {
            setProgressBarMax(Math.ceil(valueList.length / batchSize));
            const chunkValueList = valueList.slice(position, position + batchSize);
            processPromises(chunkValueList, observableType, finalValues, position, batchSize, valueList);
            position += batchSize;
          }
        } else {
          // No 'values' were submitted to save, but other parts of form were possibly filled out for different
          // Observable type like File Hash or something that are not currently bulk addable.
          // No promise required here, just send the data for saving, as it is a singular add
          commitMutation({
            mutation: stixCyberObservableMutation,
            variables: finalValues,
            updater: (store) => insertNode(
              store,
              paginationKey,
              paginationOptions,
              'stixCyberObservableAdd',
            ),
            onError: (error) => {
              handleErrorInForm(error, setErrors);
              setSubmitting(false);
            },
            setSubmitting,
            onCompleted: () => {
              // Toast Message on Add Success
              MESSAGING$.notifySuccess(t_i18n('Observable successfully added'));
              setSubmitting(false);
              resetForm();
              setGenericValueFieldDisabled(false);
              localHandleClose();
            },
          });
        }
      };
      commit();
    }
  };

  const onReset = () => {
    if (speeddial) {
      handleClose();
      setStatus({ open: false, type: null });
    } else {
      localHandleClose();
    }
  };

  const renderList = () => {
    return (
      <QueryRenderer
        query={stixCyberObservablesLinesSubTypesQuery}
        variables={{ type: 'Stix-Cyber-Observable' }}
        render={({ props }) => {
          if (props && props.subTypes) {
            const subTypesEdges = props.subTypes.edges;
            const sortByLabel = sortBy(compose(toLower, prop('tlabel')));
            const translatedOrderedList = pipe(
              map((n) => n.node),
              map((n) => assoc('tlabel', t_i18n(`entity_${n.label}`), n)),
              sortByLabel,
            )(subTypesEdges);
            return (
              <List>
                {translatedOrderedList.map((subType) => (
                  <ListItemButton
                    key={subType.label}
                    divider={true}
                    dense={true}
                    onClick={() => selectType(subType.label)}
                  >
                    <ListItemText primary={subType.tlabel} />
                  </ListItemButton>
                ))}
              </List>
            );
          }
          return <div />;
        }}
      />
    );
  };

  function BulkAddModal(props) {
    const [openBulkModal, setOpenBulkModal] = React.useState(false);
    const handleOpenBulkModal = () => {
      const generic_value_field = document.getElementById('generic_value_field');
      if (generic_value_field != null && generic_value_field.value != null
        && generic_value_field.value.length > 0 && generic_value_field.value !== bulkAddMsg) {
        // Trim the field to avoid inserting whitespace as a default population value
        props.setValue('bulk_value_field', generic_value_field.value.trim());
      }
      setOpenBulkModal(true);
    };
    const handleCloseBulkModal = () => {
      setOpenBulkModal(false);
      const bulk_value_field = document.getElementById('bulk_value_field');
      if (bulk_value_field != null && bulk_value_field.value != null && bulk_value_field.value.length > 0) {
        // START - Clear Attached File from CustomFileUploader
        const spanData = document.getElementById('CustomFileUploaderFileName');
        spanData.innerHTML = t_i18n('No file selected.');
        props.setValue('file', null);
        // END - Clear Attached File from CustomFileUploader
        // This will disable the file upload button in addition disabling the value box for direct input.
        setGenericValueFieldDisabled(true);
        // Swap value box message to display that TT was used to input multiple values.
        props.setValue('value', bulkAddMsg);
      } else {
        props.setValue('value', '');
        setGenericValueFieldDisabled(false);
      }
    };
    const localHandleCancelClearBulkModal = () => {
      setOpenBulkModal(false);
      if (!genericValueFieldDisabled) {
        // If one-liner field isn't disabled, then you are it seems deciding
        // not to use the bulk add feature, so we will clear the field, since its population
        // is used to process the bul_value_field versus the generic_value_field
        props.setValue('bulk_value_field', '');
      }
      // else - you previously entered data and you just are canceling out of the popup window
      // but keeping your entry in the form.
    };
    return (
      <React.Fragment>
        <IconButton
          onClick={handleOpenBulkModal}
          size="large"
          color="primary" style={{ float: 'right', marginRight: 25 }}
        >
          <TextFieldsOutlined />
        </IconButton>
        <Dialog
          PaperProps={{ elevation: 3 }}
          open={openBulkModal}
          onClose={handleCloseBulkModal}
          fullWidth={true}
        >
          <DialogTitle>{t_i18n('Bulk Observable Creation')}</DialogTitle>
          <DialogContent style={{ marginTop: 0, paddingTop: 0 }}>
            <Typography id="add-bulk-observable-instructions" variant="subtitle1" component="subtitle1" style={{ whiteSpace: 'pre-line' }}>
              <div style={{ fontSize: '13px', paddingBottom: '20px' }}>
                {t_i18n('Enter one observable per line. Observables must be the same type.')}
                <br></br>
                {t_i18n('If you are adding more than 50 entries, please consider using another data import capability for faster processing.')}
              </div>
            </Typography>
            <Field
              component={TextField}
              id="bulk_value_field"
              label={t_i18n('Bulk Content')}
              variant="outlined"
              key="bulk_value_field"
              name="bulk_value_field"
              fullWidth={true}
              multiline={true}
              rows="5"
            />
            <DialogActions>
              <Button onClick={localHandleCancelClearBulkModal}>
                {t_i18n('Cancel')}
              </Button>
              <Button color="secondary" onClick={handleCloseBulkModal}>
                {t_i18n('Continue')}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
  BulkAddModal.propTypes = {
    setValue: PropTypes.func,
  };
  const renderForm = () => {
    return (
      <QueryRenderer
        query={stixCyberObservablesLinesAttributesQuery}
        variables={{ elementType: [status.type] }}
        render={({ props }) => {
          if (props && props.schemaAttributeNames) {
            const baseCreatedBy = defaultCreatedBy
              ? { value: defaultCreatedBy.id, label: defaultCreatedBy.name }
              : undefined;
            const baseMarkingDefinitions = (
              defaultMarkingDefinitions ?? []
            ).map((n) => convertMarking(n));
            const initialValues = {
              x_opencti_description: '',
              x_opencti_score: 50,
              createdBy: baseCreatedBy,
              objectMarking: baseMarkingDefinitions,
              objectLabel: [],
              externalReferences: [],
              createIndicator: false,
              file: undefined,
            };
            const attributes = pipe(
              map((n) => n.node),
              filter(
                (n) => !includes(n.value, ignoredAttributes)
                  && !n.value.startsWith('i_'),
              ),
            )(props.schemaAttributeNames.edges);

            let extraFieldsToValidate = null;
            for (const attribute of attributes) {
              if (isVocabularyField(status.type, attribute.value)) {
                initialValues[attribute.value] = null;
              } else if (includes(attribute.value, dateAttributes)) {
                initialValues[attribute.value] = null;
              } else if (includes(attribute.value, booleanAttributes)) {
                initialValues[attribute.value] = false;
              } else if (attribute.value === 'hashes') {
                initialValues.hashes_MD5 = '';
                initialValues['hashes_SHA-1'] = '';
                initialValues['hashes_SHA-256'] = '';
                initialValues['hashes_SHA-512'] = '';
              } else if (attribute.value === 'value') {
                initialValues[attribute.value] = inputValue || '';
                // Dynamically include value field for Singular Observable type Object form validation
                extraFieldsToValidate = { [attribute.value]: Yup.string().nullable().required() };
              } else {
                initialValues[attribute.value] = '';
              }
            }
            const stixCyberObservableValidationBaseFields = {
              x_opencti_score: Yup.number().nullable(),
              x_opencti_description: Yup.string().nullable(),
              createIndicator: Yup.boolean(),
            };
            const stixCyberObservableValidationFinal = (extraRequiredFields = null) => Yup.object().shape({
              ...stixCyberObservableValidationBaseFields,
              ...extraRequiredFields,
            });

            return (
              <Formik
                initialValues={initialValues}
                validationSchema={stixCyberObservableValidationFinal(extraFieldsToValidate)}
                onSubmit={onSubmit}
                onReset={onReset}
              >
                {({
                  submitForm,
                  handleReset,
                  isSubmitting,
                  setFieldValue,
                  isValid,
                  values,
                }) => (
                  <Form
                    style={{
                      margin: contextual ? '10px 0 0 0' : '20px 0 20px 0',
                    }}
                  >
                    <div>
                      <Field
                        component={TextField}
                        variant="standard"
                        name="x_opencti_score"
                        label={t_i18n('Score')}
                        fullWidth={true}
                        type="number"
                      />
                      <Field
                        component={MarkdownField}
                        name="x_opencti_description"
                        label={t_i18n('Description')}
                        fullWidth={true}
                        multiline={true}
                        rows="4"
                        style={{ marginTop: 20 }}
                      />
                      {attributes.map((attribute) => {
                        if (attribute.value === 'hashes') {
                          return (
                            <div key={attribute.value}>
                              <Field
                                component={TextField}
                                variant="standard"
                                name="hashes_MD5"
                                label={t_i18n('hash_md5')}
                                fullWidth={true}
                                style={{ marginTop: 20 }}
                              />
                              <Field
                                component={TextField}
                                variant="standard"
                                name="hashes_SHA-1"
                                label={t_i18n('hash_sha-1')}
                                fullWidth={true}
                                style={{ marginTop: 20 }}
                              />
                              <Field
                                component={TextField}
                                variant="standard"
                                name="hashes_SHA-256"
                                label={t_i18n('hash_sha-256')}
                                fullWidth={true}
                                style={{ marginTop: 20 }}
                              />
                              <Field
                                component={TextField}
                                variant="standard"
                                name="hashes_SHA-512"
                                label={t_i18n('hash_sha-512')}
                                fullWidth={true}
                                style={{ marginTop: 20 }}
                              />
                            </div>
                          );
                        }
                        if (isVocabularyField(status.type, attribute.value)) {
                          return (
                            <OpenVocabField
                              key={attribute.value}
                              label={t_i18n(attribute.value)}
                              type={fieldToCategory(
                                status.type,
                                attribute.value,
                              )}
                              name={attribute.value}
                              onChange={(name, value) => setFieldValue(name, value)
                              }
                              containerStyle={fieldSpacingContainerStyle}
                              multiple={false}
                            />
                          );
                        }
                        if (includes(attribute.value, dateAttributes)) {
                          return (
                            <Field
                              component={DateTimePickerField}
                              key={attribute.value}
                              name={attribute.value}
                              withSeconds={true}
                              textFieldProps={{
                                label: attribute.value,
                                variant: 'standard',
                                fullWidth: true,
                                style: { marginTop: 20 },
                              }}
                            />
                          );
                        }
                        if (includes(attribute.value, numberAttributes)) {
                          return (
                            <Field
                              component={TextField}
                              variant="standard"
                              key={attribute.value}
                              name={attribute.value}
                              label={attribute.value}
                              fullWidth={true}
                              type="number"
                              style={{ marginTop: 20 }}
                            />
                          );
                        }
                        if (includes(attribute.value, booleanAttributes)) {
                          return (
                            <Field
                              component={SwitchField}
                              type="checkbox"
                              key={attribute.value}
                              name={attribute.value}
                              label={attribute.value}
                              fullWidth={true}
                              containerstyle={{ marginTop: 20 }}
                            />
                          );
                        }
                        if (attribute.value === 'obsContent') {
                          return (
                            <ArtifactField
                              key={attribute.value}
                              attributeName={attribute.value}
                              onChange={setFieldValue}
                            />
                          );
                        }
                        if (attribute.value === 'value') {
                          return (
                            <div key={attribute.value}>
                              <Tooltip title="Copy/paste text content">
                                <BulkAddModal
                                  setValue={(field_name, new_value) => setFieldValue(field_name, new_value)}
                                />
                              </Tooltip>

                              <Field
                                id="generic_value_field"
                                label="value" // For unit test to locate and preserves initial name before bulk capability supported
                                disabled={genericValueFieldDisabled}
                                component={TextField}
                                variant="standard"
                                key={attribute.value}
                                name={attribute.value}
                                fullWidth={true}
                                multiline={true}
                                rows="1"
                              />
                            </div>
                          );
                        }
                        return (
                          <Field
                            component={TextField}
                            variant="standard"
                            key={attribute.value}
                            name={attribute.value}
                            label={attribute.value}
                            fullWidth={true}
                            style={{ marginTop: 20 }}
                          />);
                      })}
                    </div>
                    <CreatedByField
                      name="createdBy"
                      style={fieldSpacingContainerStyle}
                      setFieldValue={setFieldValue}
                    />
                    <ObjectLabelField
                      name="objectLabel"
                      style={fieldSpacingContainerStyle}
                      setFieldValue={setFieldValue}
                      values={values.objectLabel}
                    />
                    <ObjectMarkingField
                      name="objectMarking"
                      style={fieldSpacingContainerStyle}
                    />
                    <ExternalReferencesField
                      name="externalReferences"
                      style={fieldSpacingContainerStyle}
                      setFieldValue={setFieldValue}
                      values={values.externalReferences}
                    />
                    <CustomFileUploader
                      setFieldValue={setFieldValue}
                      disabled={genericValueFieldDisabled}
                    />
                    <Field
                      component={SwitchField}
                      type="checkbox"
                      name="createIndicator"
                      label={t_i18n('Create an indicator from this observable')}
                      containerstyle={{ marginTop: 20 }}
                    />
                    <div>
                    </div>
                    <div className={classes.buttons}>
                      <Button
                        variant={contextual ? 'text' : 'contained'}
                        onClick={handleReset}
                        disabled={isSubmitting}
                        classes={{ root: classes.button }}
                      >
                        {t_i18n('Cancel')}
                      </Button>
                      <Button
                        variant={contextual ? 'text' : 'contained'}
                        color="secondary"
                        disabled={isSubmitting && isValid}
                        onClick={() => { submitForm(); }}
                        classes={{ root: classes.button }}
                      >
                        {t_i18n('Create')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            );
          }
          return <div />;
        }}
      />
    );
  };

  const renderClassic = () => {
    return (
      <>
        <Fab
          onClick={handleOpen}
          color="primary"
          aria-label="Add"
          className={classes.createButton}
        >
          <Add />
        </Fab>
        <Drawer
          open={status.open}
          anchor="right"
          sx={{ zIndex: 1202 }}
          elevation={1}
          classes={{ paper: classes.drawerPaper }}
          onClose={localHandleClose}
        >
          <div className={classes.header}>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={localHandleClose}
              size="large"
              color="primary"
            >
              <Close fontSize="small" color="primary" />
            </IconButton>
            <Typography variant="h6">{t_i18n('Create an observable')}</Typography>
          </div>
          <div className={classes.container}>
            {!status.type ? renderList() : renderForm()}
          </div>
        </Drawer>
        <React.Fragment>
          <Dialog
            open={openProgressDialog}
          >
            <DialogTitle id="alert-dialog-title">
              {'Progress'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ minWidth: '500px', width: '100%' }}>
                <LinearProgressWithLabel
                  classes={{ root: classes.progress }}
                  variant="determinate"
                  value={100 * (progressBar / progressBarMax)}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClickCloseProgress}>
                {t_i18n('Close')}
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </>
    );
  };

  const renderContextual = () => {
    return (
      <div style={{ display: display ? 'block' : 'none' }}>
        {!speeddial && (
          <Fab
            onClick={handleOpen}
            color="primary"
            aria-label="Add"
            className={classes.createButtonContextual}
          >
            <Add />
          </Fab>
        )}
        <Dialog
          open={speeddial ? open : status.open}
          PaperProps={{ elevation: 1 }}
          onClose={speeddial ? handleClose : localHandleClose}
          fullWidth={true}
        >
          <DialogTitle>{t_i18n('Create an observable')}</DialogTitle>
          <DialogContent style={{ paddingTop: 0 }}>
            {!status.type ? renderList() : renderForm()}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  if (contextual) {
    return renderContextual();
  }
  return renderClassic();
};

export default StixCyberObservableCreation;
