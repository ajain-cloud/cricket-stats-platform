import { Link } from 'react-router-dom';
import type { PlayerSearchItem } from '../types/player.types';

export default function PlayerCard({ player }: { player: PlayerSearchItem }) {
  return (
    <Link to={`/players/${player.id}`} className="block bg-slate-50 border border-gray-200 rounded-lg p-5 hover:shadow-md hover:bg-white transition">
      <h2 className="text-lg font-semibold text-gray-800">{player.name}</h2>
      <p className="text-sm text-gray-600">{player.country}</p>
    </Link>
  );
}
