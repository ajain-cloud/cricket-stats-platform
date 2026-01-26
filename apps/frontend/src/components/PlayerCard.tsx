import { Link } from 'react-router-dom';
import type { PlayerSearchItem } from '../types/player.types';

export default function PlayerCard({ player }: { player: PlayerSearchItem }) {
  return (
    <Link to={`/players/${player.id}`} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <h2 className='font-semibold text-lg'>{player.name}</h2>
      <p className='text-gray-600'>{player.country}</p>
    </Link>
  );
}
