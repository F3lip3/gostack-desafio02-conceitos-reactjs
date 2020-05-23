import React, { useState, useEffect } from 'react';

import api from './services/api';

import './styles.css';

function App() {
  const [repositories, setRepositories] = useState([]);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      url: 'https://github.com/josepholiveira',
      title: 'Desafio ReactJS',
      techs: ['React', 'Node.js'],
    });
    if (response.status === 200) {
      setRepositories([...repositories, response.data]);
    } else {
      console.error(`[${response.status}] Failed to add repository.`);
    }
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`/repositories/${id}`);
    if (response.status === 204) {
      const clonedRepositories = JSON.parse(JSON.stringify(repositories));
      const repoIndex = clonedRepositories.findIndex((x) => x.id === id);
      if (repoIndex >= 0) {
        clonedRepositories.splice(repoIndex, 1);
        setRepositories(clonedRepositories);
      }
    } else {
      console.error(`[${response.status}] Failed to remove repository.`);
    }
  }

  useEffect(() => {
    async function loadRepositories() {
      const response = await api.get('/repositories');
      if (response.status === 200) {
        setRepositories(response.data);
      }
    }

    loadRepositories();
  }, []);

  return (
    <div>
      <ul data-testid='repository-list'>
        {repositories.map((repo) => (
          <li key={repo.id}>
            {repo.title}
            <button onClick={() => handleRemoveRepository(repo.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
