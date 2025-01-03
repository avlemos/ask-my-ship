import { Card, CardContent } from '@/components/ui/card';

import { FC } from 'react';

interface StatsCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
}

export const StatsCard: FC<StatsCardProps> = ({ icon: Icon, title, value, subtitle }) => (
    <Card className="bg-white">
      <CardContent className="flex items-center p-6">
        <div className="rounded-full bg-blue-100 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="ml-2 text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );