import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './Hero'; // Importando o componente Hero
import './css/Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero: Seção de Destaque */}
      <Hero
        title="Bem-vindo ao Gerenciador de Escalas de Louvor"
        subtitle="Organize sua equipe de louvor de maneira simples e eficiente!"
        buttonText1="Cadastrar"
        buttonText2="Login"
      />

      {/* Seção de Benefícios com Ícones */}
      <Container className="benefits-section text-center mt-5">
        <Row>
          <Col md={4} className="benefit">
            <div className="benefit-icon">
              <i className="fas fa-music"></i> {/* Ícone de música */}
            </div>
            <h3>Fácil de Usar</h3>
            <p>Gerencie escalas de louvor com apenas alguns cliques.</p>
          </Col>
          <Col md={4} className="benefit">
            <div className="benefit-icon">
              <i className="fas fa-users"></i> {/* Ícone de usuários */}
            </div>
            <h3>Colaboração Eficiente</h3>
            <p>Permita que todos os membros participem de maneira organizada.</p>
          </Col>
          <Col md={4} className="benefit">
            <div className="benefit-icon">
              <i className="fas fa-book"></i> {/* Ícone de livro/repertório */}
            </div>
            <h3>Repertório Organizado</h3>
            <p>Mantenha todas as músicas e escalas acessíveis em um só lugar.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
