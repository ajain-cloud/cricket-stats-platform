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
    <div className="min-h-screen bg-slate-100 flex items-start justify-center">
      <div className="w-full max-w-5xl px-6 pt-20">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
            Cricket Player Search
          </h1>

          <input
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search player (e.g. Virat, Bumrah...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {loading && (
            <p className="text-center text-gray-500 mb-4">
              Loading players...
            </p>
          )}

          {players.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <p>Players count: {players.length}</p>
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
