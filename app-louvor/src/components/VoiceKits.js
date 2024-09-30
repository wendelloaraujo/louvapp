import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import './css/VoiceKits.css'; // Estilos personalizados

function VoiceKits() {
  const [fileUpload, setFileUpload] = useState(null);
  const [voiceKits, setVoiceKits] = useState([]);

  // Função para realizar o upload de um arquivo
  const handleUpload = async () => {
    if (fileUpload == null) return;
    const fileRef = ref(storage, `voiceKits/${fileUpload.name}`);
    try {
      await uploadBytes(fileRef, fileUpload);
      alert('Arquivo enviado com sucesso!');
      fetchVoiceKits(); // Atualiza a lista após o upload
      setFileUpload(null); // Reseta o campo de upload
    } catch (error) {
      alert(error.message);
    }
  };

  // Função para buscar os kits de voz
  const fetchVoiceKits = async () => {
    const listRef = ref(storage, 'voiceKits/');
    try {
      const res = await listAll(listRef);
      const urls = await Promise.all(
        res.items.map((item) => getDownloadURL(item))
      );
      setVoiceKits(urls);
    } catch (error) {
      alert(error.message);
    }
  };

  // Carregar os kits de voz quando o componente for montado
  useEffect(() => {
    fetchVoiceKits();
  }, []);

  return (
    <Container className="voice-kits-page mt-5">
      <h1>Repositório de Kits de Voz</h1>
      <Row className="mb-4">
        {voiceKits.map((url, index) => (
          <Col md={4} key={index}>
            <Card className="voice-kit-card mb-4">
              <Card.Body>
                <Card.Title>Kit de Voz {index + 1}</Card.Title>
                <Card.Text>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Acessar Kit de Voz
                  </a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Form className="add-kit-form mt-4">
        <Form.Group controlId="formNewKit">
          <Form.Label>Adicionar Novo Kit de Voz</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFileUpload(e.target.files[0])}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleUpload} className="mt-3">
          Enviar Kit de Voz
        </Button>
      </Form>
    </Container>
  );
}

export default VoiceKits;
