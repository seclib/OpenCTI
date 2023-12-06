import React from 'react';
import { graphql, useMutation } from 'react-relay';
import { Button } from '@mui/material';
import { Create } from '@mui/icons-material';
import { useFormatter } from 'src/components/i18n';
import NoteEditionContainer from './NoteEditionContainer';
import { QueryRenderer } from '../../../../relay/environment';
import { noteEditionOverviewFocus } from './NoteEditionOverview';
import Loader, { LoaderVariant } from '../../../../components/Loader';
import { KNOWLEDGE_KNUPDATE } from '../../../../utils/hooks/useGranted';
import { NoteEditionContainerQuery$data } from './__generated__/NoteEditionContainerQuery.graphql';
import { CollaborativeSecurity } from '../../../../utils/Security';

export const noteEditionQuery = graphql`
  query NoteEditionContainerQuery($id: String!) {
    note(id: $id) {
      createdBy {
        id
      }
      ...NoteEditionContainer_note
    }
  }
`;

const NoteEdition = ({ noteId }: { noteId: string }) => {
  const { t_i18n } = useFormatter();
  const [commit] = useMutation(noteEditionOverviewFocus);

  const handleClose = () => {
    commit({
      variables: {
        id: noteId,
        input: { focusOn: '' },
      },
    });
  };

  return (
    <div>
      <QueryRenderer
        query={noteEditionQuery}
        variables={{ id: noteId }}
        render={({ props }: { props: NoteEditionContainerQuery$data }) => {
          if (props && props.note) {
            return (
              <CollaborativeSecurity
                data={props.note}
                needs={[KNOWLEDGE_KNUPDATE]}
              >
                <NoteEditionContainer
                  note={props.note}
                  handleClose={handleClose}
                  controlledDial={({ onOpen }) => (
                    <Button
                      style={{
                        marginLeft: '3px',
                        fontSize: 'small',
                      }}
                      variant='contained'
                      onClick={onOpen}
                      disableElevation
                    >
                      {t_i18n('Edit')} <Create />
                    </Button>
                  )}
                />
              </CollaborativeSecurity>
            );
          }
          return <Loader variant={LoaderVariant.inElement} />;
        }}
      />
    </div>
  );
};

export default NoteEdition;
