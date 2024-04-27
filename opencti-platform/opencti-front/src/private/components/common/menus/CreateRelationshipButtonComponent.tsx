import React, { FunctionComponent, useContext } from "react";
import Security from "src/utils/Security";
import { KNOWLEDGE_KNUPDATE } from "src/utils/hooks/useGranted";
import StixCoreRelationshipCreationFromEntity from "../stix_core_relationships/StixCoreRelationshipCreationFromEntity";
import { useFormatter } from "src/components/i18n";
import { Button, styled } from "@mui/material";
import { Add } from "@mui/icons-material";
import { CreateRelationshipContext } from "./CreateRelationshipContextProvider";
import { computeTargetStixCyberObservableTypes, computeTargetStixDomainObjectTypes } from "src/utils/stixTypeUtils";

const CreateRelationshipButton = styled(Button)({
  marginLeft: '3px',
  fontSize: 'small',
});

const CreateRelationshipControlledDial = ({ onOpen }: {
  onOpen: () => void
}) => {
  const { t_i18n } = useFormatter();
  return (
    <CreateRelationshipButton
      onClick={onOpen}
      variant='contained'
      disableElevation
      aria-label={t_i18n('Create Relationship')}
    >
      {t_i18n('Create Relationship')} <Add />
    </CreateRelationshipButton>
  );
};

interface CreateRelationshipButtonComponentProps {
  id: string,
  defaultStartTime?: string | number | Date,
  defaultStopTime?: string | number | Date,
}

const CreateRelationshipButtonComponent: FunctionComponent<CreateRelationshipButtonComponentProps> = ({
  id,
  defaultStartTime,
  defaultStopTime,
}) => {
  const { state: { stixCoreObjectTypes, connectionKey, paginationOptions, reversed }} = useContext(CreateRelationshipContext);
  const startTime = new Date(defaultStartTime ?? new Date()).toISOString();
  const stopTime = new Date(defaultStopTime ?? new Date()).toISOString();
  return (
    <Security needs={[KNOWLEDGE_KNUPDATE]}>
      <StixCoreRelationshipCreationFromEntity
        entityId={id}
        paginationOptions={paginationOptions ?? {}}
        defaultStartTime={startTime}
        defaultStopTime={stopTime}
        targetStixDomainObjectTypes={computeTargetStixDomainObjectTypes(stixCoreObjectTypes)}
        targetStixCyberObservableTypes={computeTargetStixCyberObservableTypes(stixCoreObjectTypes)}
        connectionKey={connectionKey ?? undefined}
        isRelationReversed={reversed ?? false}
        paddingRight={0}
        controlledDial={CreateRelationshipControlledDial}
      />
    </Security>
  );
};

export default CreateRelationshipButtonComponent;
