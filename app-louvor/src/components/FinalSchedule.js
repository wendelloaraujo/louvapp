import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function FinalSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      setSchedules(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchSongs = async () => {
      const querySnapshot = await getDocs(collection(db, 'songs'));
      setSongs(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchSchedules();
    fetchSongs();
  }, []);

  const getSongTitle = (songId) => {
    const song = songs.find((s) => s.id === songId);
    return song ? song.title : 'Música não encontrada';
  };

  return (
    <div>
      <h2>Escala Final da Semana</h2>
      {schedules.map((schedule) => (
        <div key={schedule.id}>
          <p>Data: {schedule.date}</p>
          <p>Ministro: {schedule.ministerId}</p>
          <p>Músicas:</p>
          <ul>
            {schedule.songs.map((songId) => (
              <li key={songId}>{getSongTitle(songId)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default FinalSchedule;
