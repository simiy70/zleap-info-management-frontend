import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        outline: 'border border-border bg-white/60 backdrop-blur hover:border-primary/40 hover:text-primary',
        ghost: 'hover:bg-muted/70 text-muted-foreground hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
        pill: 'rounded-full border border-primary/50 text-primary hover:bg-accent',
        'pill-muted': 'rounded-full border border-border text-muted-foreground hover:text-foreground',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-2xl px-6',
        icon: 'h-9 w-9',
        'icon-sm': 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';

export { Button, buttonVariants };
