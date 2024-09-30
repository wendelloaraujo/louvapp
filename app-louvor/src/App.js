import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Songs from './components/Songs'; // Atualizado
import Poll from './components/Poll';
import Schedule from './components/Schedule';
import ConnectionStatus from './components/ConnectionStatus';
import VoiceKits from './components/VoiceKits'; // Novo componente de kits de voz

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <ConnectionStatus />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/songs"
              element={
                <PrivateRoute>
                  <Songs />
                </PrivateRoute>
              }
            />
            <Route
              path="/poll"
              element={
                <PrivateRoute>
                  <Poll />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute requiredRole="Liderança">
                  <Schedule />
                </PrivateRoute>
              }
            />
            {/* Rota para o novo componente de Kits de Voz */}
            <Route
              path="/voicekits"
              element={
                <PrivateRoute>
                  <VoiceKits />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
