import { PlayerStats } from '@/lib/types';
import { StatsCard } from './StatsCard';
import { Ship } from 'lucide-react';

export default function StatsDisplay({ stats }: { stats: PlayerStats }) {
  return (
<div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Commander Stats</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatsCard
                icon={Ship}
                title="Total Battles"
                value={(stats.battles_count ?? 0).toLocaleString()}
              />
            </div>
          </div>

  );
}