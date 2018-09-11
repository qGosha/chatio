import React from "react";
import { BrowserRouter, Route } from 'react-router-dom';

const Header = () => {
  return(
    <div>header</div>
  )
};

const App = () => {
  return(
    <div>
      <BrowserRouter>
       <div>
        <Route path='/' component={Header}>
        <Route>
       </div>
      </BrowserRouter>
    </div>
  )
};

export default App;
