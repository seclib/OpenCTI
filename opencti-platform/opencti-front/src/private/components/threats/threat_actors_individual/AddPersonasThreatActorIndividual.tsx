import Drawer from '@components/common/drawer/Drawer';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import SearchInput from 'src/components/SearchInput';
import { useFormatter } from 'src/components/i18n';
import AddPersonasThreatActorIndividualLines, { addPersonasThreatActorIndividualLinesQuery } from './AddPersonasThreatActorIndividualLines';
import { AddPersonasThreatActorIndividualLinesQuery } from './__generated__/AddPersonasThreatActorIndividualLinesQuery.graphql';
import { ThreatActorIndividualDetails_ThreatActorIndividual$data } from './__generated__/ThreatActorIndividualDetails_ThreatActorIndividual.graphql';

const AddPersonaThreatActorIndividual = ({
  threatActorIndividual,
}: {
  threatActorIndividual: ThreatActorIndividualDetails_ThreatActorIndividual$data,
}) => {
  const { t_i18n } = useFormatter();
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const paginationOptions = { search };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSearch = (term: string) => setSearch(term);

  const data = useLazyLoadQuery<AddPersonasThreatActorIndividualLinesQuery>(
    addPersonasThreatActorIndividualLinesQuery,
    {
      ...paginationOptions,
      count: 50,
    },
  );

  const getRelationships = () => {
    const relations = [];
    for (const { node } of threatActorIndividual.stixCoreRelationships?.edges ?? []) {
      const { relationship_type } = node ?? {};
      if (relationship_type === 'known-as') relations.push(node);
    }
    return relations;
  };

  return (<div>
    {(getRelationships().length > 0) && (
      <IconButton
        color='primary'
        style={{ marginTop: '-11px' }}
        onClick={handleOpen}
      >
        <Add fontSize="small" />
      </IconButton>
    )}
    <Drawer
      open={open}
      onClose={handleClose}
      title={t_i18n('Add persona')}
      header={
        <div
          style={{
            marginLeft: 'auto',
            marginRight: '20px',
          }}
        >
          <SearchInput
            variant='inDrawer'
            onSubmit={handleSearch}
          />
        </div>
      }
    >
      <AddPersonasThreatActorIndividualLines
        threatActorIndividual={threatActorIndividual}
        fragmentKey={data}
      />
    </Drawer>
  </div>);
};

export default AddPersonaThreatActorIndividual;
