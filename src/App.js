import React, {Component} from 'react'

import {
 Box,
 Heading,
 Grommet,
 ResponsiveContext,
} from 'grommet';

import CheckerForm from './form'

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

const Main = (props) => (
  <Box fill 
    direction="column"
    background='brand'
    align="center"
    justify="center"
  >
    <Box pad="large">
      <Heading margin="none"> Vehicule checker </Heading>
      <CheckerForm/>
    </Box>
  </Box>
)

class App extends Component {
 state = {
   showSidebar: false,
 }

 render(){
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {size => (
            <Main />
          )}
        </ResponsiveContext.Consumer>
  </Grommet>
    );
  }
}

export default App;
