import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import './css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Email ou senha incorretos.');
    }
  };

  return (
    <div className="login-page">
      {/* Substituímos o Container do Bootstrap por uma div simples */}
      <div className="login-box">
        <h2 className="text-center mb-4">Entrar no App Louvor</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Entrar
          </Button>

          <div className="text-center mt-3">
            <Link to="/forgot-password" className="forgot-password-link">
              Esqueceu a senha?
            </Link>
          </div>

          <div className="text-center mt-3">
            <p className="sign-up-text">
              Não tem uma conta?{' '}
              <Link to="/signup" className="sign-up-link">
                Cadastre-se
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
