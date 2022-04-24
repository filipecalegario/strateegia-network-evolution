import {
  ChakraProvider, theme
} from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signin from './pages/Signin';
import GraphD3 from './pages/GraphD3';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/graph" element={<GraphD3 />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
