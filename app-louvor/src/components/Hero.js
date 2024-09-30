import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './css/Home.css'; // Arquivo de estilos personalizado

function Hero({ title, subtitle, buttonText1, buttonText2 }) {
  return (
    <div className="hero-container">
      {/* Sobreposição para melhorar a legibilidade do texto sobre a imagem de fundo */}
      <div className="overlay"></div>
      <Container className="text-center text-light hero-content">
        <h1 className="display-4 animated-title">{title}</h1>
        <p className="lead animated-subtitle">{subtitle}</p>
        <div className="button-group">
          <Button variant="primary" size="lg" as={Link} to="/signup" className="mr-3 animated-button">
            {buttonText1}
          </Button>
          <Button variant="light" size="lg" as={Link} to="/login" className="animated-button">
            {buttonText2}
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Hero;
