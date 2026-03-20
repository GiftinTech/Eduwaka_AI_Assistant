// ─────────────────────────────────────────────────────────────
// dashboardComponents.tsx  — shared primitives
// Palette:
//   #00252e  deep teal-black  (sidebar bg, dark surfaces)
//   #eb4799  hot pink         (primary CTA, active accent)
//   #4853ea  electric indigo  (AI badge, secondary links)
//   #111827  near-black       (body text, dark cards)
//   #f3f4f6  light gray       (page background)
// ─────────────────────────────────────────────────────────────
import type { ReactNode } from 'react';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'pink',
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'pink' | 'indigo';
}) => (
  <div className="mb-8">
    {badge && (
      <span
        className={`mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
          badgeVariant === 'indigo'
            ? 'bg-[#4853ea]/10 text-[#4853ea]'
            : 'bg-[#eb4799]/10 text-[#eb4799]'
        }`}
      >
        {badge}
      </span>
    )}
    <h2 className="text-3xl font-extrabold tracking-tight text-[#111827]">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">{subtitle}</p>
    )}
  </div>
);

export const Card = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
    {children}
  </p>
);

export const InfoBanner = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#4853ea]/20 bg-[#4853ea]/5 px-4 py-3">
    <span className="mt-0.5 text-[#4853ea]">ℹ</span>
    <p className="text-sm text-[#4b5563]">{children}</p>
  </div>
);

export const WarningBanner = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
    <span className="mt-0.5">⚠️</span>
    <p className="text-sm text-amber-800">{children}</p>
  </div>
);

export const Input = ({
  id,
  label,
  ...props
}: {
  id: string;
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#374151]">
        {label}
      </label>
    )}
    <input
      id={id}
      className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5 text-sm text-[#111827] placeholder-[#9ca3af] transition-all focus:border-[#eb4799] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb4799]/20 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  </div>
);

export const Textarea = ({
  id,
  label,
  ...props
}: {
  id: string;
  label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#374151]">
        {label}
      </label>
    )}
    <textarea
      id={id}
      className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5 text-sm text-[#111827] placeholder-[#9ca3af] transition-all focus:border-[#eb4799] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb4799]/20 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  </div>
);

export const Select = ({
  id,
  label,
  children,
  ...props
}: {
  id: string;
  label?: string;
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="space-y-1.5">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-[#374151]">
        {label}
      </label>
    )}
    <select
      id={id}
      className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5 text-sm text-[#111827] transition-all focus:border-[#eb4799] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#eb4799]/20"
      {...props}
    >
      {children}
    </select>
  </div>
);

export const PrimaryButton = ({
  children,
  loading,
  loadingText = 'Loading...',
  ...props
}: {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#eb4799] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#d43589] focus:outline-none focus:ring-2 focus:ring-[#eb4799]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? (
      <>
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        {loadingText}
      </>
    ) : (
      children
    )}
  </button>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
    <p className="text-sm text-red-700">{message}</p>
  </div>
);

export const ResultCard = ({ children }: { children: ReactNode }) => (
  <div className="mt-5 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-5">
    {children}
  </div>
);
