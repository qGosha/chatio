import React from "react";
import { Segment  } from 'semantic-ui-react'


const NoMatch = () => {
  return(
  <Segment style={{position: 'absolute', top:'50%', left: '50%'}}>
   <span>404 Missing</span>
  </Segment>
  )
}


export default NoMatch;
