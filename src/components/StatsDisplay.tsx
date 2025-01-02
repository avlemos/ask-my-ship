import { PlayerStats } from '@/lib/types';

export default function StatsDisplay({ stats }: { stats: PlayerStats }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Player Statistics</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(stats, null, 2)}
      </pre>
    </div>
  );
}