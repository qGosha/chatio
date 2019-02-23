import React, { Fragment } from "react";
import { Segment, Button, Icon } from 'semantic-ui-react';
import history from '../helpers/history';

const styles = {
  header: {
   display: 'flex',
   justifyContent: 'flex-end',
   padding: '10px',
   backgroundColor: '#bdd2e6',
   borderRadius: 0
 },
 headerCont: {
   gridArea: 'menu / menu / header/ header'
 }
}

const PageHeader = (props) => {
  const { logout, location, extraStyle, auth, closeDialog } = props;
  return (
  <div style={{ ...styles.headerCont, ...extraStyle }}>
      <Segment style={styles.header}>
        { auth.user.isConfirmed ?
        <Fragment>
          <Button
          size='tiny'
          color='blue'
          active={location.pathname === '/dashboard'}
          onClick={() => {
            if (location.pathname === '/dashboard') return;
            history.push('/dashboard')}
          }
        >
          <Icon name='dashboard' /> Dashboard
        </Button>
        <Button
          size='tiny'
          active={location.pathname === '/dashboard/settings'}
          color='blue'
          onClick={() => {
            if (location.pathname === '/dashboard/settings') return;
            history.push('/dashboard/settings');
            closeDialog();
          }

          }
        >
          <Icon name='setting' /> Settings
        </Button>
       </Fragment> :
       null }
        <Button
          size='tiny'
          color='grey'
          onClick={logout}
        >
          <Icon name='log out' /> Sign out
        </Button>
      </Segment>
    </div>

  )
}
// <Button onClick={openModal}>Delete profile</Button>

export default PageHeader;
