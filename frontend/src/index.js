import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';   
import {BrowserRouter}  from 'react-router-dom' 
import { ToastContainer, toast } from 'react-toastify'; 



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
   <BrowserRouter>
    <App /> 
    <ToastContainer  
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
   </BrowserRouter>

  
);


reportWebVitals();
