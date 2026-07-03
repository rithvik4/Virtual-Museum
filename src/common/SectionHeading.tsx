import { motion } from 'framer-motion';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className={alignment}
    >
      <p className="text-xs uppercase tracking-[0.34em] text-museum-gold">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl text-white sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">{description}</p> : null}
    </motion.div>
  );
}