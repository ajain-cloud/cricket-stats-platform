import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import type { PlayerAggregateResponse } from '../types/player.types';
import StatsTable from '../components/StatsTable';
import { getPlayerById } from "../api/players.api";
import { useNavigate } from 'react-router-dom';

export default function PlayerDetailsPage() {
  const { id } = useParams();
  const [player, setPlayer] = useState<PlayerAggregateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchPlayer = async () => {
      try {
        const data = await getPlayerById(id);
        setPlayer(data);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <p className="p-6">Loading player...</p>;
  if (!player) return <p className="p-6">Player not found</p>;

  const { profile, stats } = player;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-blue-600 hover:underline"
        > ← Back to Search
        </button>

        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Profile */}
          <div className="flex items-center gap-8 mb-10">
            <img
              src={profile.playerImg || '/placeholder.png'}
              alt={profile.name}
              className="w-32 h-32 rounded-lg object-cover border"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
              <p className="text-gray-600">{profile.country}</p>
              <p className="font-medium">{profile.role}</p>
              <p className="text-sm text-gray-500">{profile.battingStyle} · {profile.bowlingStyle}</p>
            </div>
          </div>

          {/* Stats */}
          <StatsTable title="Batting Stats" stats={stats.batting} />
          <StatsTable title="Bowling Stats" stats={stats.bowling} />
        </div>
      </div>
    </div>
  );
}
