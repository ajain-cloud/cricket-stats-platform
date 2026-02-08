import { useEffect, useState } from 'react';
import { searchPlayers } from '../api/players.api';
import type { PlayerSearchItem } from '../types/player.types';
import PlayerCard from '../components/PlayerCard';
import { getQuotaStatus } from '../api/quota.api';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<PlayerSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState<{ used: number, limit: number } | null>(null);
  const isQuotaExceeded = quota !== null && quota.used >= quota.limit;

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

        // refresh quota after successful search
        const quotaData = await getQuotaStatus();
        setQuota(quotaData);
      } catch (err: any) {
        if (err?.response?.status === 429) {
          const quotaData = await getQuotaStatus();
          setQuota(quotaData);
        } else {
          console.error(err);
        }
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const data = await getQuotaStatus();
        setQuota(data);
      } catch (err) {
        console.error('Failed to fetch quota', err);
      }
    };

    fetchQuota();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center">
      <div className="w-full max-w-5xl px-6 pt-20">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
            Cricket Player Search
          </h1>

          {quota && (
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">API Usage</span>
                  <span className="font-semibold text-gray-700">
                    {quota.used} / {quota.limit}
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${quota.used >= quota.limit
                      ? 'bg-red-500'
                      : quota.used > quota.limit * 0.8
                        ? 'bg-orange-500'
                        : 'bg-green-500'
                      }`}
                    style={{
                      width: `${Math.min(
                        (quota.used / quota.limit) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                {isQuotaExceeded && (
                  <p className="text-center text-red-600 text-sm mb-4">
                    Daily API limit reached. Try again tomorrow.
                  </p>
                )}
              </div>
            </div>
          )}

          <input
            disabled={isQuotaExceeded}
            className={`w-full p-4 border rounded-lg mb-6 text-lg focus:outline-none ${isQuotaExceeded
              ? 'bg-gray-100 cursor-not-allowed'
              : 'focus:ring-2 focus:ring-blue-500'
              }`}
            placeholder={
              isQuotaExceeded
                ? 'Daily API limit reached'
                : 'Search player (e.g. Virat, Bumrah...)'
            }
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
