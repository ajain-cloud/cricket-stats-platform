import { useEffect, useState } from 'react';
import { searchPlayers } from '../api/players.api';
import type { PlayerSearchItem } from '../types/player.types';
import PlayerCard from '../components/PlayerCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<PlayerSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchPlayers(query);
        setPlayers(data);
      } catch (err) {
        console.error(err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Cricket Player Search</h1>

      <input
        className='w-full p-3 border rounded mb-6'
        placeholder="Search player..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {players.length > 0 && (<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <p>Players count: {players.length}</p>
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
      )}
    </div>
  );
}
