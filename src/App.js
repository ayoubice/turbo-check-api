import React, {Component} from 'react';


import {
 Box,
 Heading,
 TextInput,
 Button,
 Grommet,
 ResponsiveContext,
} from 'grommet';



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
    <Box
      // wrap="true"
    >
      <Heading margin="none"> Vehicule checker </Heading>
      <TextInput
        id="text-input"
        placeholder="placeholder"
        value="Some value"
      />
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
