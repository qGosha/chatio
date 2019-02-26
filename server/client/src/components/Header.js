import React, { Fragment } from "react";
import { Segment, Button, Icon } from 'semantic-ui-react';
import history from '../helpers/history';

const styles = {
  header: {
   display: 'flex',
   padding: '10px',
   backgroundColor: '#bdd2e6',
   borderRadius: 0
 }
}

const PageHeader = (props) => {
  const { logout, location, auth, closeDialog, topStyle } = props;
  return (
  <div style={{...topStyle.header }}>
      <Segment style={{...styles.header, ...topStyle.headerButtonJustify}}>
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
export default PageHeader;
