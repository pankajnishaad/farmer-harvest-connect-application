import { forwardRef } from 'react';
import { HiExclamationCircle } from 'react-icons/hi';
import clsx from 'clsx';

export const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => (
  <div className={clsx('w-full', className)}>
    {label && <label className="form-label">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400 text-lg" />
        </div>
      )}
      <input
        ref={ref}
        className={clsx(
          'form-input',
          Icon && 'pl-10',
          error && 'border-red-400 focus:ring-red-400'
        )}
        {...props}
      />
    </div>
    {error && (
      <p className="form-error">
        <HiExclamationCircle className="text-base" />
        {error}
      </p>
    )}
  </div>
));
Input.displayName = 'Input';

export const Select = forwardRef(({ label, error, children, className, ...props }, ref) => (
  <div className={clsx('w-full', className)}>
    {label && <label className="form-label">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={clsx('form-select', error && 'border-red-400 focus:ring-red-400')}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
        ▾
      </div>
    </div>
    {error && <p className="form-error"><HiExclamationCircle className="text-base" />{error}</p>}
  </div>
));
Select.displayName = 'Select';

export const Textarea = forwardRef(({ label, error, className, rows = 4, ...props }, ref) => (
  <div className={clsx('w-full', className)}>
    {label && <label className="form-label">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={clsx('form-input resize-none', error && 'border-red-400 focus:ring-red-400')}
      {...props}
    />
    {error && <p className="form-error"><HiExclamationCircle className="text-base" />{error}</p>}
  </div>
));
Textarea.displayName = 'Textarea';

export function Button({ children, variant = 'primary', loading, className, ...props }) {
  const cls = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    outline:   'btn-outline',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
  }[variant];

  return (
    <button
      className={clsx(cls, 'flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function Badge({ children, variant = 'gray' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function StatCard({ icon: Icon, label, value, change, color = 'forest', loading }) {
  const colors = {
    forest: 'bg-forest-50 text-forest-600',
    earth:  'bg-earth-50 text-earth-600',
    blue:   'bg-blue-50 text-blue-600',
    red:    'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="stat-card">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="text-2xl" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        {loading ? (
          <div className="h-6 w-16 bg-gray-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-display font-bold text-gray-900 leading-tight">{value}</p>
        )}
        {change !== undefined && (
          <p className={`text-xs font-medium mt-0.5 ${change >= 0 ? 'text-forest-600' : 'text-red-500'}`}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% this month
          </p>
        )}
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        {Icon && <Icon className="text-3xl text-gray-400" />}
      </div>
      <h3 className="font-display font-semibold text-gray-700 text-lg">{title}</h3>
      {subtitle && <p className="text-gray-400 text-sm mt-1 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={clsx('bg-gray-200 rounded animate-shimmer', className)} />;
}

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${width} animate-fade-up max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-display font-bold text-xl text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
