
import { motion } from 'framer-motion';

export default function StatsCard({ icon: Icon, label, value, trend, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card-base p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {label}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div 
          className="p-3 rounded-full"
          style={{ 
            background: color || 'rgba(22, 101, 52, 0.1)',
            color: color || 'var(--color-forest-green)'
          }}
        >
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}