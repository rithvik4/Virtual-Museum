import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type BaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = BaseProps & { to: string };

const baseClassName =
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-museum-gold';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-museum-gold text-black shadow-[0_15px_40px_rgba(212,175,55,0.24)] hover:bg-[#ebc95f]',
  secondary: 'border border-white/12 bg-white/7 text-white hover:border-white/25 hover:bg-white/10',
  ghost: 'text-white/70 hover:text-white',
};

export function MuseumButton({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
      <button className={cn(baseClassName, variantClasses[variant], className)} {...props}>
        {children}
      </button>
    </motion.div>
  );
}

export function MuseumLinkButton({ variant = 'primary', className, children, to }: LinkProps) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
      <Link to={to} className={cn(baseClassName, variantClasses[variant], className)}>
        {children}
      </Link>
    </motion.div>
  );
}