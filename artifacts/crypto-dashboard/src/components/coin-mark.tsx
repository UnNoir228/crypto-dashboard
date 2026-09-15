import { useState } from 'react';

interface CoinMarkProps {
  image: string;
  name: string;
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };

export function CoinMark({ image, name, symbol, size = 'md' }: CoinMarkProps) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold uppercase text-primary`}>
      {symbol.slice(0, 2)}
    </span>
  ) : (
    <img
      src={image}
      alt={`${name} logo`}
      className={`${sizes[size]} shrink-0 rounded-full bg-secondary object-cover`}
      onError={() => setFailed(true)}
    />
  );
}
