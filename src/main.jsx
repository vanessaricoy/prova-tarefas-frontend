import React from 'react';
import {createRoot} from 'react-dom/client';
import {Auth0Provider} from '@auth0/auth0-react';
import App from './App.jsx';
import './style.css';
const e=import.meta.env;
const ready=['VITE_AUTH0_DOMAIN','VITE_AUTH0_CLIENT_ID','VITE_AUTH0_AUDIENCE'].every(k=>e[k]&&!/SEU-TENANT|PREENCHA/.test(e[k]));
createRoot(document.getElementById('root')).render(ready?<Auth0Provider domain={e.VITE_AUTH0_DOMAIN} clientId={e.VITE_AUTH0_CLIENT_ID} authorizationParams={{redirect_uri:window.location.origin,audience:e.VITE_AUTH0_AUDIENCE,scope:'openid profile email'}}><App/></Auth0Provider>:<main><h1>Configure o Auth0</h1><p>Preencha as três variáveis VITE_AUTH0_* em frontend/.env ou na Vercel e reinicie/refaça o deploy.</p></main>);
