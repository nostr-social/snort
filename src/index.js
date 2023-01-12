import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { NostrSystem } from './nostr/System';
import EventPage from './pages/EventPage';
import Layout from './pages/Layout';
import LoginPage from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import RootPage from './pages/Root';
import Store from "./state/Store";
import NotificationsPage from './pages/Notifications';
import NewUserPage from './pages/NewUserPage';
import SettingsPage from './pages/SettingsPage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';

export const System = new NostrSystem();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" exact element={<RootPage />} />
            <Route path="/login" exact element={<LoginPage />} />
            <Route path="/e/:id" exact element={<EventPage />} />
            <Route path="/p/:id" exact element={<ProfilePage />} />
            <Route path="/notifications" exact element={<NotificationsPage />} />
            <Route path="/messages" exact element={<MessagesPage />} />
            <Route path="/messages/:pubkey" exact element={<ChatPage />} />
            <Route path="/new" exact element={<NewUserPage />} />
            <Route path="/settings" exact element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  </React.StrictMode>
);
