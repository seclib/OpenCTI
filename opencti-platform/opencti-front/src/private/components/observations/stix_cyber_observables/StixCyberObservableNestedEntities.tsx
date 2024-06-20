import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { ListItemSecondaryAction, ListItemText, Paper, styled } from '@mui/material';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useFormatter } from 'src/components/i18n';
import useHelper from 'src/utils/hooks/useHelper';
import Security from 'src/utils/Security';
import { KNOWLEDGE_KNUPDATE } from 'src/utils/hooks/useGranted';
import StixNestedRefRelationshipCreationFromEntity from '@components/common/stix_nested_ref_relationships/StixNestedRefRelationshipCreationFromEntity';
import SearchInput from 'src/components/SearchInput';
import { QueryRenderer } from 'src/relay/environment';
import StixNestedRefRelationshipCreationFromEntityFabless from '@components/common/stix_nested_ref_relationships/StixNestedRefRelationshipCreationFromEntityFabless';
import { CreateRelationshipContext } from '@components/common/menus/CreateRelationshipContextProvider';
import { StixCyberObservableNestedEntitiesLines_data$data } from './__generated__/StixCyberObservableNestedEntitiesLines_data.graphql';
import {
  FullHeightContainer,
  InLineControlledDial,
  PlaceholderSecurity,
  StyledInlineHeader,
  StyledLabel,
  StyledList,
  StyledListItem,
  StyledListItemIcon,
  StyledSearchContainer,
} from './StixCyberObservableEntities';
import StixCyberObservableNestedEntitiesLines, { stixCyberObservableNestedEntitiesLinesQuery } from './StixCyberObservableNestedEntitiesLines';

interface StixCyberObservableNestedEntitiesProps {
  entityId: string,
  entityType: string,
}

const StixCyberObservableNestedEntities: FunctionComponent<StixCyberObservableNestedEntitiesProps> = ({
  entityId,
  entityType,
}) => {
  const { t_i18n } = useFormatter();
  const { setState } = useContext(CreateRelationshipContext);
  const { isFeatureEnable } = useHelper();
  const FABReplaced = isFeatureEnable('FAB_REPLACEMENT');
  const [sortBy, setSortBy] = useState<string>();
  const [orderAsc, setOrderAsc] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSort = (field: string) => {
    setSortBy(field);
    setOrderAsc(!orderAsc);
  };
  const handleSearch = (term: string) => setSearchTerm(term);
  const sortHeader = (field: string, label: string, isSortable: boolean) => {
    const fieldWidths: Record<string, string> = {
      relationship_type: '10%',
      entity_type: '10%',
      name: '22%',
      creator: '12%',
      start_time: '15%',
      stop_time: '15%',
    };
    const SortComponent = styled(orderAsc ? ArrowDropDown : ArrowDropUp)({
      position: 'absolute',
      margin: '0 0 0 5px',
      padding: 0,
      top: '0px',
    });
    return <StyledInlineHeader
      width={fieldWidths[field]}
      isSortable={isSortable}
      onClick={isSortable ? () => handleSort(field) : undefined}
           >
      <span>{t_i18n(label)}</span>
      {sortBy === field ? <SortComponent /> : ''}
    </StyledInlineHeader>;
  };

  const paginationOptions = {
    fromOrToId: entityId,
    search: searchTerm,
    orderBy: sortBy,
    orderMode: orderAsc ? 'asc' : 'desc',
  };

  useEffect(() => setState({
    paginationOptions,
  }), []);

  return (<FullHeightContainer>
    <StyledLabel variant="h4" gutterBottom={true}>
      {t_i18n('Nested objects')}
    </StyledLabel>
    <Security
      needs={[KNOWLEDGE_KNUPDATE]}
      placeholder={<PlaceholderSecurity />}
    >
      {FABReplaced
        ? <StixNestedRefRelationshipCreationFromEntityFabless
            id={entityId}
            entityType={entityType}
            isReversable={false}
            controlledDial={InLineControlledDial}
          />
        : <StixNestedRefRelationshipCreationFromEntity
            paginationOptions={paginationOptions}
            entityId={entityId}
            variant="inLine"
            entityType={entityType}
            targetStixCoreObjectTypes={undefined}
            isRelationReversed={false}
          />
      }
    </Security>
    <StyledSearchContainer>
      <SearchInput
        variant="thin"
        onSubmit={handleSearch}
        keyword={searchTerm}
      />
    </StyledSearchContainer>
    <div className="clearfix" />
    <Paper variant="outlined">
      <StyledList>
        <StyledListItem
          divider={false}
        >
          <StyledListItemIcon>&nbsp;</StyledListItemIcon>
          <ListItemText
            primary={<div>
              {sortHeader('relationship_type', 'Attribute', true)}
              {sortHeader('entity_type', 'Entity Type', false)}
              {sortHeader('name', 'Name', false)}
              {sortHeader('creator', 'Creator', false)}
              {sortHeader('start_time', 'First obs.', true)}
              {sortHeader('stop_time', 'Last obs.', true)}
            </div>}
          />
          <ListItemSecondaryAction> &nbsp; </ListItemSecondaryAction>
        </StyledListItem>
        <QueryRenderer
          query={stixCyberObservableNestedEntitiesLinesQuery}
          variables={{ count: 200, ...paginationOptions }}
          render={({ props }: { props: StixCyberObservableNestedEntitiesLines_data$data }) => (
            <StixCyberObservableNestedEntitiesLines
              data={props}
              paginationOptions={paginationOptions}
              stixCyberObservableId={entityId}
            />
          )}
        />
      </StyledList>
    </Paper>
  </FullHeightContainer>);
};

export default StixCyberObservableNestedEntities;
