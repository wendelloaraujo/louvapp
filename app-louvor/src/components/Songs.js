import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';

function Songs() {
  const [songs, setSongs] = useState([]);
  const [newSongUrl, setNewSongUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Carregar as músicas ao carregar a página
  useEffect(() => {
    fetchSongs();
  }, []);

  // Função para carregar as músicas do Firestore
  const fetchSongs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'songs'));
      setSongs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar as músicas.');
      setLoading(false);
    }
  };

  // Função para adicionar uma nova música
  const handleAddSong = async () => {
    try {
      // Extrai o ID do vídeo do URL
      const urlParams = new URLSearchParams(new URL(newSongUrl).search);
      const videoId = urlParams.get('v');
      if (!videoId) {
        setError('URL inválida. Por favor, insira um link válido do YouTube.');
        return;
      }

      await addDoc(collection(db, 'songs'), {
        videoId: videoId,
        url: newSongUrl,
      });

      setNewSongUrl(''); // Limpa o campo de entrada
      setMessage('Música adicionada com sucesso!');
      setError(''); // Limpa os erros anteriores, se houver
      fetchSongs(); // Atualiza a lista de músicas
    } catch (error) {
      setError('Erro ao adicionar a música: ' + error.message);
      setMessage(''); // Limpa a mensagem de sucesso, se houver
    }
  };

  // Função para remover uma música
  const handleDeleteSong = async (id) => {
    try {
      await deleteDoc(doc(db, 'songs', id));
      setMessage('Música removida com sucesso!');
      setError(''); // Limpa os erros anteriores, se houver
      fetchSongs(); // Atualiza a lista de músicas
    } catch (error) {
      setError('Erro ao remover a música: ' + error.message);
      setMessage(''); // Limpa a mensagem de sucesso, se houver
    }
  };

  return (
    <Container>
      <h2>Repertório de Músicas</h2>

      {/* Feedback de sucesso ou erro */}
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Formulário para adicionar uma nova música */}
      <Form>
        <Form.Group controlId="formSongUrl">
          <Form.Label>Adicionar Música (Link do YouTube)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Cole o link do YouTube aqui"
            value={newSongUrl}
            onChange={(e) => setNewSongUrl(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" className="mt-2" onClick={handleAddSong}>
          Adicionar Música
        </Button>
      </Form>

      {/* Exibição das músicas em formato de galeria */}
      <Row className="mt-4">
        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Carregando...</span>
            </Spinner>
          </Col>
        ) : (
          songs.length > 0 ? (
            songs.map((song) => (
              <Col key={song.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className="video-responsive">
                      <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${song.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <Button
                      variant="danger"
                      className="mt-2"
                      onClick={() => handleDeleteSong(song.id)}
                    >
                      Remover
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center">Nenhuma música adicionada ainda.</p>
            </Col>
          )
        )}
      </Row>
    </Container>
  );
}

export default Songs;
