import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import React, { FunctionComponent } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Field, FormikValues } from 'formik';
import { useFormatter } from '../../../components/i18n';
import SelectField from '../../../components/SelectField';
import { SubscriptionFocus } from '../../../components/Subscription';

interface HiddenTypesListProps {
  values: FormikValues,
  handleChangeFocus: (id: string, name: string) => void,
  handleSubmitField: (id: string, name: string, value: string[]) => void,
  id: string,
  editContext: { name: string, focusOn: string },
}

const HiddenTypesList: FunctionComponent<HiddenTypesListProps> = ({ values, handleChangeFocus, handleSubmitField, id, editContext }) => {
  const { t } = useFormatter();

  return (
    <Field
      component={SelectField}
      variant="standard"
      name="platform_hidden_types"
      label={t('Hidden entity types')}
      fullWidth={true}
      multiple={true}
      containerstyle={{
        marginTop: 20,
        width: '100%',
      }}
      onFocus={(name: string) => handleChangeFocus(id, name)}
      onChange={(name: string, value: string[]) => handleSubmitField(id, name, value)}
      helpertext={
        <SubscriptionFocus
          context={editContext}
          fieldName="platform_hidden_types"
        />
      }
      renderValue={(selected: string[]) => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
          }}
        >
          {selected.map((value) => (
            <Chip
              key={value}
              label={t(`entity_${value}`)}
            />
          ))}
        </Box>
      )}
    >
        <MenuItem value="Threats" dense={true}>
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Threats') > -1
          }
        />
        {t('Threats')}
      </MenuItem>
      <MenuItem
        value="Threat-Actor"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Threats')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Threat-Actor') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Threat-Actor')}
      </MenuItem>
      <MenuItem
        value="Intrusion-Set"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Threats')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Intrusion-Set') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Intrusion-Set')}
      </MenuItem>
      <MenuItem
        value="Campaign"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Threats')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Campaign') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Campaign')}
      </MenuItem>
      <MenuItem value="Arsenal" dense={true}>
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Arsenal') > -1
          }
        />
        {t('Arsenal')}
      </MenuItem>
      <MenuItem
        value="Malware"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Arsenal')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Malware') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Malware')}
      </MenuItem>
      <MenuItem
        value="Channel"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Arsenal')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Channel') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Channel')}
      </MenuItem>
      <MenuItem
        value="Tool"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Arsenal')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Tool') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Tool')}
      </MenuItem>
      <MenuItem
        value="Vulnerability"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Arsenal')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Vulnerability') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Vulnerability')}
      </MenuItem>
      <MenuItem value="Techniques" dense={true}>
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Techniques') > -1
          }
        />
        {t('Techniques')}
      </MenuItem>
      <MenuItem
        value="Attack-Pattern"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Techniques')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Attack-Pattern') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Attack-Pattern')}
      </MenuItem>
      <MenuItem
        value="Narrative"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Techniques')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Narrative') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Narrative')}
      </MenuItem>
      <MenuItem
        value="Course-Of-Action"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Techniques')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Course-Of-Action') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Course-Of-Action')}
      </MenuItem>
      <MenuItem
        value="Data-Component"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Techniques')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Data-Component') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Data-Component')}
      </MenuItem>
      <MenuItem
        value="Data-Source"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Techniques')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Data-Source') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Data-Source')}
      </MenuItem>
      <MenuItem value="Entities" dense={true}>
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Entities') > -1
          }
        />
        {t('Entities')}
      </MenuItem>
      <MenuItem
        value="Sector"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Entities')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Sector') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Sector')}
      </MenuItem>
      <MenuItem
        value="Event"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Entities')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Event') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Event')}
      </MenuItem>
      <MenuItem
        value="Organization"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Entities')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Organization') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Organization')}
      </MenuItem>
      <MenuItem
        value="System"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Entities')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('System') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_System')}
      </MenuItem>
      <MenuItem
        value="Individual"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Entities')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Individual') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Individual')}
      </MenuItem>
      <MenuItem value="Locations" dense={true}>
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Locations') > -1
          }
        />
        {t('Locations')}
      </MenuItem>
      <MenuItem
        value="Region"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Locations')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Region') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Region')}
      </MenuItem>
      <MenuItem
        value="Country"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Locations')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Country') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Country')}
      </MenuItem>
      <MenuItem
        value="City"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Locations')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('City') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_City')}
      </MenuItem>
      <MenuItem
        value="Position"
        disabled={(
          values.platform_hidden_types || []
        ).includes('Locations')}
        dense={true}
      >
        <Checkbox
          checked={
            (
              values.platform_hidden_types || []
            ).indexOf('Position') > -1
          }
          style={{ marginLeft: 10 }}
        />
        {t('entity_Position')}
      </MenuItem>
    </Field>
  );
};

export default HiddenTypesList;
