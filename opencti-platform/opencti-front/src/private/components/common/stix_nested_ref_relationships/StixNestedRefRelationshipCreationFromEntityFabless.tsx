import React, { FunctionComponent, useContext, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useFormatter } from 'src/components/i18n';
import { QueryRenderer } from 'src/relay/environment';
import ListLines from 'src/components/list_lines/ListLines';
import { emptyFilterGroup, removeIdFromFilterGroupObject } from 'src/utils/filters/filtersUtils';
import useFiltersState from 'src/utils/filters/useFiltersState';
import useEntityToggle from 'src/utils/hooks/useEntityToggle';
import { ChevronRightOutlined } from '@mui/icons-material';
import { TargetEntity } from '../stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import Drawer from '../drawer/Drawer';
import {
  ContinueButton,
  CreateRelationshipControlledDial,
  Header,
  SelectEntityContainer,
  ViewContainer,
  renderLoader,
} from '../stix_core_relationships/StixCoreRelationshipCreationFromControlledDial';
import { stixNestedRefRelationshipResolveTypes } from './StixNestedRefRelationshipCreationFromEntity';
import { StixNestedRefRelationshipCreationFromEntityResolveQuery$data } from './__generated__/StixNestedRefRelationshipCreationFromEntityResolveQuery.graphql';
import { CreateRelationshipContext } from '../menus/CreateRelationshipContextProvider';
import StixNestedRefRelationshipCreationFromEntityLines, { stixNestedRefRelationshipCreationFromEntityLinesQuery } from './StixNestedRefRelationshipCreationFromEntityLines';
import { StixNestedRefRelationshipCreationFromEntityLinesQuery$data } from './__generated__/StixNestedRefRelationshipCreationFromEntityLinesQuery.graphql';
import StixNestedRefRelationshipCreationForm from './StixNestedRefRelationshipCreationForm';

/**
 * The first page of the create relationship drawer: selecting the entity/entites
 * @param props.id The source entity's id
 * @param props.entityType The source entity's type
 * @param props.setTargetEntities Dispatch to set relationship target entities
 * @param props.handleNextStep Function to continue on to the next step
 * @returns JSX.Element
 */
const SelectEntity = ({
  id,
  entityType,
  setTargetEntities,
  handleNextStep,
}: {
  id: string,
  entityType: string,
  setTargetEntities: React.Dispatch<TargetEntity[]>,
  handleNextStep: () => void,
}) => {
  const { t_i18n } = useFormatter();
  const { state: { stixCoreObjectTypes } } = useContext(CreateRelationshipContext);
  const typeFilters = (stixCoreObjectTypes ?? []).length > 0
    ? {
      mode: 'and',
      filterGroups: [],
      filters: [{
        id: uuid(),
        key: 'entity_type',
        values: stixCoreObjectTypes ?? [],
        operator: 'eq',
        mode: 'or',
      }],
    }
    : emptyFilterGroup;
  const [filters, helpers] = useFiltersState(typeFilters, typeFilters);
  const [sortBy, setSortBy] = useState<string>('_score');
  const [orderAsc, setOrderAsc] = useState<boolean>(false);
  const [numberOfElements, setNumberOfElements] = useState({
    number: 0,
    symbol: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const containerRef = useRef(null);
  const {
    onToggleEntity,
    selectedElements,
    deSelectedElements,
  } = useEntityToggle<TargetEntity>(`${id}_stixNestedRefRelationshipCreationFromEntity`);
  const onInstanceToggleEntity = (entity: TargetEntity) => {
    onToggleEntity(entity);
    if (entity.id in (selectedElements || {})) {
      const newSelectedElements = { ...selectedElements };
      delete newSelectedElements[entity.id];
      setTargetEntities(Object.values(newSelectedElements));
    } else {
      setTargetEntities(Object.values({
        [entity.id]: entity,
        ...(selectedElements ?? {}),
      }));
    }
  };
  const searchPaginationOptions = {
    searchTerm,
    filters: removeIdFromFilterGroupObject(filters),
    orderBy: searchTerm.length > 0 ? null : 'created_at',
    orderMode: searchTerm.length > 0 ? null : 'desc',
    types: stixCoreObjectTypes,
  };
  const handleSort = (field: string, sortOrderAsc: boolean) => {
    setSortBy(field);
    setOrderAsc(sortOrderAsc);
  };
  const dataColumns = {
    entity_type: {
      label: 'Type',
      width: '15%',
      isSortable: true,
    },
    value: {
      label: 'Value',
      width: '32%',
      isSortable: false,
    },
    createdBy: {
      label: 'Author',
      width: '15%',
      isSortable: false,
    },
    objectLabel: {
      label: 'Labels',
      width: '22%',
      isSortable: false,
    },
    objectMarking: {
      label: 'Marking',
      width: '15%',
      isSortable: false,
    },
  };
  return (
    <SelectEntityContainer>
      <ListLines
        sortBy={sortBy}
        orderAsc={orderAsc}
        dataColumns={dataColumns}
        keyword={searchTerm}
        disableCards={true}
        handleSearch={setSearchTerm}
        disableExport={true}
        helpers={helpers}
        handleSort={handleSort}
        numberOfElements={numberOfElements}
        paginationOptions={searchPaginationOptions}
        iconExtension={true}
        filters={filters}
        parametersWithPadding={true}
        handleToggleSelectAll="no"
        availableFilterKeys={[
          'entity_type',
          'objectMarking',
          'objectLabel',
          'createdBy',
          'confidence',
          'x_opencti_organization_type',
          'created',
          'created_at',
          'creator_id',
        ]}
      >
        <QueryRenderer
          query={stixNestedRefRelationshipCreationFromEntityLinesQuery}
          variables={{ count: 25, ...searchPaginationOptions }}
          render={({ props }: { props: StixNestedRefRelationshipCreationFromEntityLinesQuery$data }) => {
            if (props) {
              return (
                <StixNestedRefRelationshipCreationFromEntityLines
                  entityType={entityType}
                  data={props}
                  dataColumns={dataColumns}
                  initialLoading={false}
                  setNumberOfElements={setNumberOfElements}
                  onToggleEntity={onInstanceToggleEntity}
                  containerRef={containerRef}
                  selectedElements={selectedElements}
                  deSelectedElements={deSelectedElements}
                  selectAll={false}
                />
              );
            } return (<></>);
          }}
        />
      </ListLines>
      <ContinueButton
        variant="extended"
        size="small"
        color="primary"
        onClick={() => handleNextStep()}
        disabled={Object.values(selectedElements).length < 1}
      >
        {t_i18n('Continue')} <ChevronRightOutlined />
      </ContinueButton>
    </SelectEntityContainer>
  );
};

/**
 * The second page of the create relationship drawer: filling out the relationship
 * @param props.data The source entity
 * @param props.targetEntities The target entities
 * @param props.handleClose Function called on close
 * @param props.isReversable Whether this relationship can be reversed
 * @param props.defaultStartTime The default start time
 * @param props.defaultStopTime The default stop time
 * @returns JSX.Element
 */
const RenderForm = ({
  data,
  targetEntities,
  handleClose,
  handleBack,
  isReversable,
  defaultStartTime,
  defaultStopTime,
}: {
  data: StixNestedRefRelationshipCreationFromEntityResolveQuery$data,
  targetEntities: TargetEntity[],
  handleClose: () => void,
  handleBack: () => void,
  isReversable?: boolean
  defaultStartTime?: string,
  defaultStopTime?: string,
}) => {
  if (data?.stixSchemaRefRelationships === null || data?.stixSchemaRefRelationships === undefined) return <></>;
  const { state: {
    reversed: initiallyReversed,
    // onCreate,
    // connectionKey,
    // paginationOptions,
  } } = useContext(CreateRelationshipContext);
  const [reversed, setReversed] = useState<boolean>(initiallyReversed ?? false);

  const handleReverse = () => setReversed(!reversed);

  const sourceEntity = data.stixSchemaRefRelationships.entity as TargetEntity;
  let fromEntities = [sourceEntity];
  let toEntities = targetEntities;
  if (reversed) {
    fromEntities = targetEntities;
    toEntities = [sourceEntity];
  }
  let relationshipTypes: string[] = [];
  if ((!data.stixSchemaRefRelationships.from
    || data.stixSchemaRefRelationships.from.length === 0)
    && (!data.stixSchemaRefRelationships.to
      || data.stixSchemaRefRelationships.to.length !== 0)) {
    if (reversed) {
      relationshipTypes = data.stixSchemaRefRelationships.to as string[] ?? [];
    }
  } else {
    relationshipTypes = data.stixSchemaRefRelationships.from as string[] ?? [];
  }
  const startTime = defaultStartTime ?? (new Date()).toISOString();
  const stopTime = defaultStopTime ?? (new Date()).toISOString();

  return (
    <StixNestedRefRelationshipCreationForm
      sourceEntity={fromEntities[0]}
      targetEntities={toEntities}
      relationshipTypes={relationshipTypes}
      defaultStartTime={startTime}
      defaultStopTime={stopTime}
      onSubmit={() => {}} // TODO: Write onSubmit function
      handleClose={handleClose}
      handleBack={handleBack}
      handleReverse={isReversable ? handleReverse : undefined}
    />
  );
};

interface StixNestedRefRelationshipCreationFromEntityFablessProps {
  id: string,
  entityType: string,
  isReversable?: boolean,
  defaultStartTime?: string,
  defaultStopTime?: string,
  controlledDial?: ({ onOpen }: { onOpen: () => void }) => React.ReactElement,
}

const StixNestedRefRelationshipCreationFromEntityFabless: FunctionComponent<
StixNestedRefRelationshipCreationFromEntityFablessProps
> = ({
  id,
  entityType,
  isReversable,
  defaultStartTime,
  defaultStopTime,
  controlledDial,
}) => {
  const [step, setStep] = useState<number>(0);
  const [targetEntities, setTargetEntities] = useState<TargetEntity[]>([]);

  const reset = () => {
    setStep(0);
    setTargetEntities([]);
  };

  return (
    <Drawer
      title={''} // Defined in custom header prop
      controlledDial={controlledDial ?? CreateRelationshipControlledDial}
      onClose={reset}
      header={<Header showCreates={step === 0} />}
    >
      <ViewContainer>
        {step === 0 && (
          <SelectEntity
            id={id}
            entityType={entityType}
            setTargetEntities={setTargetEntities}
            handleNextStep={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <QueryRenderer
            query={stixNestedRefRelationshipResolveTypes}
            variables={{ id, toType: targetEntities[0].entity_type }}
            render={({ props }: { props: StixNestedRefRelationshipCreationFromEntityResolveQuery$data }) => {
              if (props?.stixSchemaRefRelationships) {
                return (
                  <RenderForm
                    data={props}
                    targetEntities={targetEntities}
                    handleClose={reset}
                    handleBack={() => setStep(0)}
                    isReversable={isReversable}
                    defaultStartTime={defaultStartTime}
                    defaultStopTime={defaultStopTime}
                  />
                );
              }
              return renderLoader();
            }}
          />
        )}
      </ViewContainer>
    </Drawer>
  );
};

export default StixNestedRefRelationshipCreationFromEntityFabless;
