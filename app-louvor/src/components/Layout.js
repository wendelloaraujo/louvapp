import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../AuthContext";
import { auth } from "../firebase";
import "./css/Layout.css"; // Estilos personalizados para a Navbar e o Footer

function Layout({ children }) {
  const { currentUser, userRole } = useAuth(); // Obter o papel do usuário

  return (
    <div className="layout-container">
      {/* Navbar */}
      <Navbar fixed="top" bg="light" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="/">LouvApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              {currentUser ? (
                <>
                  <LinkContainer to="/dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/songs">
                    <Nav.Link>Repertório de Músicas</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/voicekits">
                    <Nav.Link>Kits de Voz</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/poll">
                    <Nav.Link>Enquete de Disponibilidade</Nav.Link>
                  </LinkContainer>

                  {/* Mostrar Montar Escala apenas para usuários com papel de Liderança */}
                  {userRole === "Liderança" && (
                    <LinkContainer to="/schedule">
                      <Nav.Link>Montar Escala</Nav.Link>
                    </LinkContainer>
                  )}

                  <Nav.Link onClick={() => auth.signOut()}>Sair</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Cadastrar</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Conteúdo da Página */}
      <Container className="content mt-5">{children}</Container>

      {/* Footer */}
      <footer className="footer mt-auto py-3">
        <Container>
          <span className="footer-text">© 2024 App Louvor</span>
        </Container>
      </footer>
    </div>
  );
}

export default Layout;
