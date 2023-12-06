import React from 'react';
import Transition from 'src/components/Transition';
import { useFormatter } from 'src/components/i18n';
import useDeletion from 'src/utils/hooks/useDeletion';
import { graphql, useMutation } from 'react-relay';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { MESSAGING$ } from 'src/relay/environment';

const AdministrativeAreaDeleteMutation = graphql`
  mutation AdministrativeAreaDeleteMutation($id: ID!) {
    administrativeAreaDelete(id: $id)
  }
`;

const AdministrativeAreaDelete = ({ id, handleClose }: {
  id: string,
  handleClose?: () => void,
}) => {
  const { t_i18n } = useFormatter();
  const navigate = useNavigate();
  const [commit] = useMutation(AdministrativeAreaDeleteMutation);
  const {
    deleting,
    handleOpenDelete,
    displayDelete,
    handleCloseDelete,
    setDeleting,
  } = useDeletion({ handleClose });

  const submitDelete = () => {
    setDeleting(true);
    commit({
      variables: { id },
      configs: [{
        type: 'NODE_DELETE',
        deletedIDFieldName: 'id',
      }],
      onError: (error: Error) => {
        MESSAGING$.notifyError(`${error}`);
      },
      onCompleted: () => {
        setDeleting(false);
        MESSAGING$.notifySuccess(`${t_i18n('entity_Administrative-Area')} ${t_i18n('successfully deleted')}`);
        navigate('/dashboard/techniques/administrative_areas');
      },
    });
  };

  return (<>
    <Button
      onClick={handleOpenDelete}
      variant='contained'
      color='error'
    >
      {t_i18n('Delete')}
    </Button>
    <Dialog
      open={displayDelete}
      PaperProps={{ elevation: 1 }}
      keepMounted={true}
      TransitionComponent={Transition}
      onClose={handleCloseDelete}
    >
      <DialogContent>
        <DialogContentText>
          {t_i18n('Do you want to delete this area?')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDelete} disabled={deleting}>
          {t_i18n('Cancel')}
        </Button>
        <Button color="secondary" onClick={submitDelete} disabled={deleting}>
          {t_i18n('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  </>);
};

export default AdministrativeAreaDelete;
