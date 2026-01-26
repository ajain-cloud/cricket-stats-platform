import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import type { PlayerAggregateResponse } from '../types/player.types';
import StatsTable from '../components/StatsTable';
import { getPlayerById } from "../api/players.api";

export default function PlayerDetailsPage() {
  const { id } = useParams();
  const [player, setPlayer] = useState<PlayerAggregateResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6 max-w-5xl mx-auto">
      {/* Profile */}
      <div className="flex gap-6 mb-8">
        <img
          src={profile.playerImg}
          alt={profile.name}
          className="w-32 h-32 rounded object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p>{profile.country}</p>
          <p className="text-gray-600">{profile.role}</p>
          <p className="text-sm text-gray-500">{profile.battingStyle} · {profile.bowlingStyle}</p>
        </div>
      </div>

      {/* Stats */}
      <StatsTable title="Batting Stats" stats={stats.batting} />
      <StatsTable title="Bowling Stats" stats={stats.bowling} />
    </div>
  );
}
