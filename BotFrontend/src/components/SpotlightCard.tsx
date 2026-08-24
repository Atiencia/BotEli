import { useRef, useState, type ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({ children, className = '', spotlightColor = 'rgba(120, 119, 198, 0.2)' }: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10 dark:hover:shadow-white/5 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-all duration-300"
        style={{
          background: isHovered 
            ? `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor.replace('0.15', '0.25')}, transparent 40%)`
            : `radial-gradient(600px circle at 100% 0%, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
