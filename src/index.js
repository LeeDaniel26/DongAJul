import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Chat from './Chat';
import Test from './Test'

// const root = ReactDOM.createRoot(document.getElementById('root'));
ReactDOM.render(
  // <Test />,
  <Chat />,
  // <GoogleOAuthProvider clientId="907824685069-6mlq4rgbjs5g4f9a075thftst08eur4v.apps.googleusercontent.com">
  //   <React.StrictMode>
  //     <Router>
  //       <App />
  //     </Router>
  //   </React.StrictMode>
  // </GoogleOAuthProvider>,
  document.getElementById('root')
);