import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, Typography, styled } from '@mui/material';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import useHelper from 'src/utils/hooks/useHelper';
import Security from 'src/utils/Security';
import { KNOWLEDGE_KNUPDATE } from 'src/utils/hooks/useGranted';
import SearchInput from 'src/components/SearchInput';
import StixCoreRelationshipCreationFromEntity from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromEntity';
import StixCoreRelationshipCreationFromControlledDial from '@components/common/stix_core_relationships/StixCoreRelationshipCreationFromControlledDial';
import { Add, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { QueryRenderer } from 'src/relay/environment';
import { CreateRelationshipContext } from '@components/common/menus/CreateRelationshipContextProvider';
import StixCyberObservableEntitiesLines, { stixCyberObservableEntitiesLinesQuery } from './StixCyberObservableEntitiesLines';
import { StixCyberObservableEntitiesLinesPaginationQuery$data } from './__generated__/StixCyberObservableEntitiesLinesPaginationQuery.graphql';
import { useFormatter } from '../../../../components/i18n';

export const FullHeightContainer = styled('div')({
  height: '100%',
});

export const StyledLabel = styled(Typography)({
  float: 'left',
});

export const PlaceholderSecurity = styled('div')({
  height: 29,
});

export const StyledSearchContainer = styled('div')({
  float: 'right',
  marginTop: -10,
});

export const StyledList = styled(List)({
  height: '100%',
  minHeight: '100%',
  margin: 0,
  padding: '23px 7px 23px 7px',
  borderRadius: 4,
  marginTop: -10,
});

export const StyledListItem = styled(ListItem)({
  paddingTop: 0,
});

export const StyledListItemIcon = styled(ListItemIcon)({
  padding: '0 8px 0 8px',
  fontWeight: 700,
  fontSize: 12,
});

export const InLineControlledDial = ({ onOpen }: { onOpen: () => void }) => {
  const { t_i18n } = useFormatter();

  const StyledIconButton = styled(IconButton)({
    float: 'left',
    margin: '-15px 0 0 -2px',
  });

  return <StyledIconButton
    color="primary"
    aria-label={t_i18n('Label')}
    onClick={onOpen}
    size="large"
         >
    <Add fontSize="small" />
  </StyledIconButton>;
};

export const StyledInlineHeader = styled('div')<{ width: string, isSortable: boolean }>(({
  width,
  isSortable,
}) => ({
  float: 'left',
  fontSize: 12,
  fontWeight: '700',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingRight: 10,
  width,
  cursor: isSortable ? 'pointer' : undefined,
  textTransform: 'uppercase',
}));

interface StixCyberObservableEntitiesProps {
  entityId: string,
  defaultStartTime: string,
  defaultStopTime: string,
}

const StixCyberObservableEntities: FunctionComponent<StixCyberObservableEntitiesProps> = ({
  entityId,
  defaultStartTime,
  defaultStopTime,
}) => {
  const { t_i18n } = useFormatter();
  const { setState } = useContext(CreateRelationshipContext);
  const { isFeatureEnable } = useHelper();
  const FABReplaced = isFeatureEnable('FAB_REPLACEMENT');

  const [sortBy, setSortBy] = useState<string>();
  const [orderAsc, setOrderAsc] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [relationReversed, setRelationReversed] = useState<boolean>(false);

  const handleSort = (field: string) => {
    setSortBy(field);
    setOrderAsc(!orderAsc);
  };
  const handleSearch = (term: string) => setSearchTerm(term);
  const handleReverseRelation = () => setRelationReversed(!relationReversed);
  const sortHeader = (field: string, label: string, isSortable: boolean) => {
    const fieldWidths: Record<string, string> = {
      relationship_type: '10%',
      entity_type: '10%',
      name: '22%',
      createdBy: '12%',
      creator: '12%',
      start_time: '10%',
      stop_time: '10%',
      confidence: '12%',
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
      {t_i18n('Relations')}
    </StyledLabel>
    <Security
      needs={[KNOWLEDGE_KNUPDATE]}
      placeholder={<PlaceholderSecurity />}
    >
      {FABReplaced
        ? <StixCoreRelationshipCreationFromControlledDial
            id={entityId}
            defaultStartTime={defaultStartTime}
            defaultStopTime={defaultStopTime}
            controlledDial={InLineControlledDial}
          />
        : <StixCoreRelationshipCreationFromEntity
            paginationOptions={paginationOptions}
            handleReverseRelation={handleReverseRelation}
            entityId={entityId}
            variant="inLine"
            isRelationReversed={relationReversed}
            targetStixDomainObjectTypes={['Stix-Domain-Object']}
            targetStixCyberObservableTypes={['Stix-Cyber-Observable']}
            defaultStartTime={defaultStartTime}
            defaultStopTime={defaultStopTime}
            paddingRight={0}
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
              {sortHeader('relationship_type', 'Relationship', true)}
              {sortHeader('entity_type', 'Entity Type', false)}
              {sortHeader('name', 'Name', false)}
              {sortHeader('createdBy', 'Author', false)}
              {sortHeader('creator', 'Creator', false)}
              {sortHeader('start_time', 'First obs.', true)}
              {sortHeader('stop_time', 'Last obs.', true)}
              {sortHeader('confidence', 'Confidence level', true)}
            </div>}
          />
          <ListItemSecondaryAction> &nbsp; </ListItemSecondaryAction>
        </StyledListItem>
        <QueryRenderer
          query={stixCyberObservableEntitiesLinesQuery}
          variables={{ count: 200, ...paginationOptions }}
          render={({ props }: { props: StixCyberObservableEntitiesLinesPaginationQuery$data }) => (
            <StixCyberObservableEntitiesLines
              data={props}
              paginationOptions={paginationOptions}
              displayRelation={true}
              stixCyberObservableId={entityId}
            />
          )}
        />
      </StyledList>
    </Paper>
  </FullHeightContainer>);
};

export default StixCyberObservableEntities;
