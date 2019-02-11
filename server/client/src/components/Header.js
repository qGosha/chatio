import React from "react";
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
  const { logout, match } = props;
  return (
  <div style={styles.headerCont}>
      <Segment style={styles.header}>
        <Button
          size='tiny'
          color='blue'
          onClick={() => history.push(match.url + '/settings')}
        >
          <Icon name='setting' /> Settings
        </Button>
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
