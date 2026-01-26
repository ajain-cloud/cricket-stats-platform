import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import PlayerDetailsPage from './pages/PlayerDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/players/:id" element={<PlayerDetailsPage />} />
    </Routes>
  )
}

export default App
