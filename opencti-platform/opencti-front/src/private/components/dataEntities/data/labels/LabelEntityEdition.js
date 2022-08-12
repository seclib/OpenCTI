import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles/index';
import { QueryRenderer as QR } from 'react-relay';
import Slide from '@material-ui/core/Slide';
import inject18n from '../../../../../components/i18n';
import QueryRendererDarkLight from '../../../../../relay/environmentDarkLight';
import LabelEntityEditionContainer from './LabelEntityEditionContainer';
import { toastGenericError } from '../../../../../utils/bakedToast';

const styles = (theme) => ({
  container: {
    margin: 0,
  },
  drawerPaper: {
    minHeight: '100vh',
    width: '50%',
    position: 'fixed',
    overflow: 'auto',
    backgroundColor: theme.palette.navAlt.background,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    padding: 0,
  },
  popoverDialog: {
    fontSize: '18px',
    lineHeight: '24px',
    color: theme.palette.header.text,
  },
  dialogActions: {
    justifyContent: 'flex-start',
    padding: '10px 0 20px 22px',
  },
  buttonPopover: {
    textTransform: 'capitalize',
  },
  menuItem: {
    padding: '15px 0',
    width: '152px',
    margin: '0 20px',
    justifyContent: 'center',
  },
});

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = 'TransitionSlide';

const labelEntityEditionQuery = graphql`
  query LabelEntityEditionQuery($id: ID!) {
    cyioLabel(id: $id) {
      id
      name
      color
      description
    }
  }
`;

class RoleEntityEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  render() {
    const {
      classes, displayEdit, handleDisplayEdit, history, labelId,
    } = this.props;
    return (
      <div className={classes.container}>
        <QR
          environment={QueryRendererDarkLight}
          query={labelEntityEditionQuery}
          variables={{ id: labelId }}
          render={({ error, props }) => {
            if (error) {
              toastGenericError('Failed to edit Label');
            }
            if (props) {
              return (
                <LabelEntityEditionContainer
                  displayEdit={displayEdit}
                  history={history}
                  label={props.cyioLabel}
                  handleDisplayEdit={handleDisplayEdit}
                />
              );
            }
            return <></>;
          }}
        />
      </div>
    );
  }
}

RoleEntityEdition.propTypes = {
  labelId: PropTypes.string,
  displayEdit: PropTypes.bool,
  handleDisplayEdit: PropTypes.func,
  classes: PropTypes.object,
  t: PropTypes.func,
  history: PropTypes.object,
};

export default compose(
  inject18n,
  withStyles(styles),
)(RoleEntityEdition);
