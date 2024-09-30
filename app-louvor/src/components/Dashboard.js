import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext'; // Importar o contexto de autenticação
import './css/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const { userRole } = useAuth(); // Obter o papel do usuário
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <Container className="mt-5">
        {user && (
          <div className="welcome-section text-center mb-4">
            <h1>Painel de Controle</h1>
            <p>Bem-vindo, <strong>{user.email}</strong></p>
          </div>
        )}

        <Row className="mb-4">
          {userRole === 'Liderança' && (
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Montar Escala</Card.Title>
                  <Card.Text>
                    Organize a escala de louvor de forma eficiente.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/schedule">Acessar</Button>
                </Card.Body>
              </Card>
            </Col>
          )}

          <Col md={4}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title>Repertório de Músicas</Card.Title>
                <Card.Text>
                  Gerencie as músicas do louvor.
                </Card.Text>
                <Button variant="primary" as={Link} to="/songs">Acessar</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title>Enquete de Disponibilidade</Card.Title>
                <Card.Text>
                  Verifique a disponibilidade da equipe.
                </Card.Text>
                <Button variant="primary" as={Link} to="/poll">Acessar</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4 sair">
          <Button variant="danger" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Dashboard;
