import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import './css/Poll.css';

function Poll() {
  const { userRole, currentUser } = useAuth();
  const [polls, setPolls] = useState([]);
  const [users, setUsers] = useState({});
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: [{ date: '', label: '' }],
    votes: {},
  });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [message, setMessage] = useState('');

  // Carregar as enquetes e usuários do Firestore
  useEffect(() => {
    const fetchPollsAndUsers = async () => {
      const pollSnapshot = await getDocs(collection(db, 'polls'));
      const userSnapshot = await getDocs(collection(db, 'users'));

      setPolls(pollSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const usersData = {};
      userSnapshot.docs.forEach((doc) => {
        usersData[doc.id] = doc.data(); // Armazenar o UID com os dados do usuário
      });
      setUsers(usersData);
    };

    fetchPollsAndUsers();
  }, []);

  const handleAddPoll = async () => {
    if (!newPoll.title || newPoll.options.length === 0) {
      setMessage('Título e opções são obrigatórios.');
      return;
    }

    try {
      await addDoc(collection(db, 'polls'), {
        ...newPoll,
        votes: {},
        usersWhoVoted: []
      });
      setNewPoll({ title: '', description: '', options: [{ date: '', label: '' }], votes: {} });
      setMessage('Enquete adicionada com sucesso!');
      
      // Atualizar a lista de enquetes
      const pollSnapshot = await getDocs(collection(db, 'polls'));
      setPolls(pollSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVote = async (pollId) => {
    const pollRef = doc(db, 'polls', pollId);
    const poll = polls.find((p) => p.id === pollId);

    if (!poll) return;

    const userVotes = poll.votes || {};
    const userVotesForThisPoll = selectedOptions[pollId]?.map((option) => ({
      option,
      date: poll.options.find((opt) => opt.label === option)?.date || null, // Atribuir a data da opção
    })) || [];

    const updatedVotes = {
      ...userVotes,
      [currentUser.uid]: userVotesForThisPoll,
    };

    try {
      await updateDoc(pollRef, {
        votes: updatedVotes,
        usersWhoVoted: [...new Set([...(poll.usersWhoVoted || []), currentUser.uid])], // Garante que o UID seja único
      });

      setMessage('Voto registrado com sucesso!');
      setSelectedOptions({ ...selectedOptions, [pollId]: [] });

      // Atualizar a lista de enquetes
      const pollSnapshot = await getDocs(collection(db, 'polls'));
      setPolls(pollSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRemovePoll = async (pollId) => {
    try {
      await deleteDoc(doc(db, 'polls', pollId));
      setMessage('Enquete removida com sucesso!');

      // Atualizar a lista de enquetes
      const pollSnapshot = await getDocs(collection(db, 'polls'));
      setPolls(pollSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAddOption = () => {
    setNewPoll((prevPoll) => ({
      ...prevPoll,
      options: [...prevPoll.options, { date: '', label: '' }],
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setNewPoll((prevPoll) => ({
      ...prevPoll,
      options: updatedOptions,
    }));
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = newPoll.options.filter((_, i) => i !== index);
    setNewPoll((prevPoll) => ({
      ...prevPoll,
      options: updatedOptions,
    }));
  };

  // Função para formatar datas no formato brasileiro
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <Container className="poll-page mt-5">
      <h2 className="text-center mb-4">Enquetes de Disponibilidade</h2>

      {/* Exibir mensagem de feedback */}
      {message && <Alert variant="info">{message}</Alert>}

      {userRole === 'Liderança' && (
        <div className="create-poll-section">
          <Form>
            <Form.Group controlId="formPollTitle">
              <Form.Label>Título da Enquete</Form.Label>
              <Form.Control
                type="text"
                placeholder="Título da Enquete"
                value={newPoll.title}
                onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPollDescription">
              <Form.Label>Descrição (opcional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descrição da Enquete"
                value={newPoll.description}
                onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
              />
            </Form.Group>

            {newPoll.options.map((option, index) => (
              <Form.Group key={index} controlId={`formOption${index}`}>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder={`Opção ${index + 1} (descrição)`}
                    value={option.label}
                    onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                    className="flex-grow-1 me-2"
                  />
                  <Form.Control
                    type="date"
                    placeholder="Data"
                    value={option.date}
                    onChange={(e) => handleOptionChange(index, 'date', e.target.value)}
                    className="flex-grow-1 me-2"
                  />
                  <Button variant="danger" onClick={() => handleRemoveOption(index)}>
                    Remover
                  </Button>
                </div>
              </Form.Group>
            ))}

            <div className="mt-3">
              <Button variant="secondary" className="w-100 mb-2" onClick={handleAddOption}>
                Adicionar Opção
              </Button>
              <Button variant="primary" className="w-100" onClick={handleAddPoll}>
                Adicionar Enquete
              </Button>
            </div>
          </Form>
        </div>
      )}

      <Row className="mt-4">
        {polls.map((poll) => (
          <Col key={poll.id} md={6} className="mb-4">
            <Card className="poll-card">
              <Card.Body>
                <Card.Title>{poll.title}</Card.Title>
                <Card.Text>{poll.description}</Card.Text>
                {poll.options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Check
                        type="checkbox"
                        label={`${option.label} (Data: ${formatDate(option.date)})`}
                        checked={selectedOptions[poll.id]?.includes(option.label)}
                        onChange={(e) => {
                          const selected = selectedOptions[poll.id] || [];
                          if (e.target.checked) {
                            setSelectedOptions({
                              ...selectedOptions,
                              [poll.id]: [...selected, option.label],
                            });
                          } else {
                            setSelectedOptions({
                              ...selectedOptions,
                              [poll.id]: selected.filter((opt) => opt !== option.label),
                            });
                          }
                        }}
                      />
                      {userRole === 'Liderança' && (
                        <span className="badge bg-info">
                          {Object.values(poll.votes).filter((votes) =>
                            votes.some(v => v.option === option.label)
                          ).length} votos
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <Button variant="primary" className="mt-3 w-100" onClick={() => handleVote(poll.id)}>
                  Votar
                </Button>

                {userRole === 'Liderança' && (
                  <div className="mt-3">
                    <strong>Usuários que já votaram:</strong>
                    <ul>
                      {poll.usersWhoVoted?.map((uid, index) => (
                        <li key={index}>
                          {users[uid]?.email || 'Usuário desconhecido'} - Votou em:{' '}
                          {poll.votes[uid]?.map((v) => `${v.option} (Data: ${formatDate(v.date)})`).join(', ') || 'Sem votos'}
                        </li>
                      ))}
                    </ul>
                    <Button variant="danger" className="mt-2 w-100" onClick={() => handleRemovePoll(poll.id)}>
                      Remover Enquete
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Poll;
