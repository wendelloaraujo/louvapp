import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import './css/Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Back');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role, // Armazena o papel escolhido
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Erro ao cadastrar. Verifique as informações e tente novamente.');
    }
  };

  return (
    <div className="signup-page">
      <Container className="signup-box">
        <h2 className="text-center mb-4">Cadastrar</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSignup}>
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

          <Form.Group controlId="formRole" className="mt-3">
            <Form.Label>Papel</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Ministro">Ministro</option>
              <option value="Back">Back</option>
              <option value="Ambos">Ambos</option>
              {/* A liderança será atribuída de outra forma, portanto, não aparece no select */}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Cadastrar
          </Button>
        </Form>

        <div className="text-center mt-3">
          <p className="sign-up-text">
            Já tem uma conta?{' '}
            <Link to="/login" className="login-link">
              Entrar
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default Signup;
