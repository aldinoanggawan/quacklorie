import React from 'react';
import { classNames } from '../../lib/classNames';

type Variant =
  | 'display'
  | 'heading-lg'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'title'
  | 'input-label'
  | 'input'
  | 'label-strong'
  | 'label'
  | 'body-sm'
  | 'caption';

const CLASSES: Record<Variant, string> = {
  display: 'text-display font-bold',
  'heading-lg': 'text-heading-lg font-extrabold',
  heading: 'text-heading font-extrabold',
  subheading: 'text-lg font-bold',
  body: 'text-body font-normal',
  title: 'text-body font-semibold',
  'input-label': 'text-body font-medium',
  input: 'text-input font-medium',
  'label-strong': 'text-label font-semibold',
  label: 'text-label font-medium',
  'body-sm': 'text-label font-normal',
  caption: 'text-caption font-normal',
};

const DEFAULTS: Record<Variant, string> = {
  display: 'span',
  'heading-lg': 'h2',
  heading: 'h2',
  subheading: 'p',
  body: 'p',
  title: 'p',
  'input-label': 'label',
  input: 'span',
  'label-strong': 'span',
  label: 'span',
  'body-sm': 'span',
  caption: 'span',
};

type Props = {
  variant: Variant;
  as?: string;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
};

export const Typography = ({
  variant,
  as,
  color = 'var(--color-ink)',
  style,
  className,
  children,
  ...rest
}: Props) => {
  const tag = as ?? DEFAULTS[variant];
  return React.createElement(
    tag,
    {
      className: classNames(CLASSES[variant], className),
      style: { color, ...style },
      ...rest,
    },
    children,
  );
};
