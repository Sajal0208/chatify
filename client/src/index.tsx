import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { ChakraProvider } from "@chakra-ui/react";
import store from './store/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <ChakraProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ChakraProvider>
);
