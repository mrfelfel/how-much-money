import React from 'react';
import { StatusBar } from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
console.disableYellowBox = true;

import Main from './app/router/Main';
import Add from './app/router/Add';

class App extends React.Component {
  constructor() {
    super();
    StatusBar.setBackgroundColor('white');
    StatusBar.setBarStyle('dark-content');
  }


  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene key="main" component={Main} hideNavBar={true} />
          <Scene key="add" component={Add} hideNavBar={true} />
        </Stack>
      </Router>
    )
  }
}

export default App;