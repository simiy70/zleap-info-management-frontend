import React from 'react';
import { cn } from '../../lib/utils';

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    ref={ref}
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange?.(!checked)}
    className={cn(
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
      checked ? 'bg-primary' : 'bg-muted',
      className,
    )}
    {...props}
  >
    <span className={cn('pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-0.5')} />
  </button>
));
Switch.displayName = 'Switch';

export { Switch };
