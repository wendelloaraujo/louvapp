import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    minister: '',
    songs: '',
  });

  // Carregar as escalas do Firestore
  useEffect(() => {
    const fetchSchedules = async () => {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      setSchedules(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchSchedules();
  }, []);

  const handleAddSchedule = async () => {
    if (!newSchedule.date || !newSchedule.minister || !newSchedule.songs) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    try {
      await addDoc(collection(db, 'schedules'), newSchedule);
      setNewSchedule({ date: '', minister: '', songs: '' });
      alert('Escala adicionada com sucesso!');
      
      // Atualizar a lista de escalas
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      setSchedules(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
      alert('Escala removida com sucesso!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container>
      <h2>Montar Escala</h2>
      <Form>
        <Form.Group controlId="formScheduleDate">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            value={newSchedule.date}
            onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formMinisterName">
          <Form.Label>Nome do Ministro</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome do Ministro"
            value={newSchedule.minister}
            onChange={(e) => setNewSchedule({ ...newSchedule, minister: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formSongsList">
          <Form.Label>Músicas (separadas por vírgula)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Músicas"
            value={newSchedule.songs}
            onChange={(e) => setNewSchedule({ ...newSchedule, songs: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" className="mt-3" onClick={handleAddSchedule}>
          Adicionar Escala
        </Button>
      </Form>
      <Row className="mt-4">
        {schedules.map((schedule) => (
          <Col key={schedule.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Escala - {schedule.date}</Card.Title>
                <Card.Text>
                  <strong>Ministro:</strong> {schedule.minister}<br />
                  <strong>Músicas:</strong> {schedule.songs}
                </Card.Text>
                <Button
                  variant="danger"
                  className="mt-2"
                  onClick={() => handleDeleteSchedule(schedule.id)}
                >
                  Remover
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Schedule;
