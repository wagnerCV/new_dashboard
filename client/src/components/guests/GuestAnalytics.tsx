import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { GuestDistribution } from '@/types/dashboard';

interface GuestAnalyticsProps {
  distribution: GuestDistribution[];
  isLoading?: boolean;
}

export function GuestAnalytics({ distribution, isLoading }: GuestAnalyticsProps) {
  const statusMap = {
    yes: { label: 'Confirmados', color: '#0F766E' },
    no: { label: 'Recusados', color: '#7C1D2F' },
    maybe: { label: 'Pendentes', color: '#F59E0B' },
  };

  const chartData = distribution.map((item) => ({
    name: statusMap[item.status as keyof typeof statusMap]?.label || item.status,
    value: item.count,
    color: statusMap[item.status as keyof typeof statusMap]?.color || '#B45309',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = chartData.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-sand/20 p-8"
    >
      <h2 className="text-2xl font-serif text-soft-black mb-6">Distribuicao de RSVPs</h2>

      {isLoading ? (
        <div className="h-96 bg-sand/10 rounded-lg animate-pulse" />
      ) : chartData.length === 0 ? (
        <div className="h-96 flex items-center justify-center">
          <p className="text-soft-black/50 text-center">
            Nenhum dado de RSVP disponivel ainda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value} convidado(s)`}
                  contentStyle={{
                    backgroundColor: '#FAF7F5',
                    border: '1px solid #D6BFA8',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg text-soft-black mb-4">Resumo</h3>
            {dataWithPercentage.map((item) => (
              <div
                key={item.name}
                className="p-4 bg-sand/5 rounded-lg border border-sand/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <p className="font-medium text-soft-black">{item.name}</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-serif font-bold text-soft-black">
                    {item.value}
                  </p>
                  <p className="text-sm text-soft-black/60">
                    ({item.percentage}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default GuestAnalytics;
