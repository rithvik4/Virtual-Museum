import { motion } from 'framer-motion';

import type { TimelineEra } from '@/types/museum';

type TimelineRailProps = {
  eras: TimelineEra[];
};

export function TimelineRail({ eras }: TimelineRailProps) {
  return (
    <div className="relative mt-12 overflow-x-auto pb-6">
      <div className="absolute left-0 right-0 top-16 h-px bg-white/10" />
      <div className="flex min-w-max gap-6">
        {eras.map((era, index) => (
          <motion.div
            key={era.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative w-[280px] rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="absolute left-6 top-16 h-4 w-4 rounded-full border border-white/30" style={{ backgroundColor: era.color }} />
            <p className="text-xs uppercase tracking-[0.26em] text-museum-gold">{era.years}</p>
            <h3 className="mt-8 font-display text-3xl text-white">{era.label}</h3>
            <p className="mt-4 text-white/66">{era.summary}</p>
            <p className="mt-4 text-sm leading-7 text-white/52">{era.highlight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}