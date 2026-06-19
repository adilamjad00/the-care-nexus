/**
 * Shared typography helpers for docs pages.
 * All prose uses design-system tokens — no Tailwind @apply prose plugin needed.
 */

interface PProps {
  children: React.ReactNode;
  className?: string;
}

export function P({ children, className = '' }: PProps) {
  return (
    <p
      className={`text-[14.5px] text-text-secondary leading-[1.8] ${className}`}
    >
      {children}
    </p>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='text-[1.2rem] font-bold text-text-primary mt-10 mb-3 tracking-tight'>
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className='text-[1rem] font-semibold text-text-primary mt-7 mb-2'>
      {children}
    </h3>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className='space-y-2 my-4 pl-4 border-l-2 border-[rgba(37,99,235,0.15)]'>
      {children}
    </ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className='text-[14px] text-text-secondary leading-relaxed flex gap-2 items-start'>
      <span className='mt-[7px] w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
      <span>{children}</span>
    </li>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className='px-1.5 py-0.5 rounded-[5px] bg-[rgba(37,99,235,0.08)] text-primary text-[13px] font-mono'>
      {children}
    </code>
  );
}

export function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <div className='my-5 rounded-[14px] overflow-hidden border border-[rgba(37,99,235,0.12)] shadow-[0_2px_8px_rgba(37,99,235,0.06)]'>
      {label && (
        <div className='px-4 py-2 bg-[rgba(37,99,235,0.06)] border-b border-[rgba(37,99,235,0.10)] text-[11px] font-semibold text-text-muted uppercase tracking-wider'>
          {label}
        </div>
      )}
      <pre className='px-5 py-4 bg-[#081C44] overflow-x-auto text-[13px] leading-relaxed text-[#C5E4F8] font-mono'>
        {children}
      </pre>
    </div>
  );
}

export function InfoCard({
  title,
  children,
  variant = 'info',
}: {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'tip' | 'note';
}) {
  const styles = {
    info: 'bg-[rgba(37,99,235,0.06)]  border-[rgba(37,99,235,0.20)]  text-primary',
    warning:
      'bg-[rgba(238,226,96,0.12)] border-[rgba(238,226,96,0.35)] text-[#7A6610]',
    tip: 'bg-[rgba(154,224,114,0.12)] border-[rgba(154,224,114,0.35)] text-[#3A7A1A]',
    note: 'bg-[rgba(106,191,243,0.10)] border-[rgba(106,191,243,0.30)] text-[#1E88BF]',
  };
  return (
    <div
      className={`my-5 rounded-[12px] border px-4 py-3.5 ${styles[variant]}`}
    >
      {title && (
        <p className='text-[12.5px] font-bold uppercase tracking-wider mb-1.5'>
          {title}
        </p>
      )}
      <p className='text-[13.5px] leading-relaxed text-text-secondary'>
        {children}
      </p>
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className='my-5 overflow-x-auto rounded-[14px] border border-[rgba(37,99,235,0.10)] shadow-[0_2px_8px_rgba(37,99,235,0.04)]'>
      <table className='w-full text-[13px]'>
        <thead>
          <tr className='bg-[rgba(37,99,235,0.05)] border-b border-[rgba(37,99,235,0.10)]'>
            {headers.map((h) => (
              <th
                key={h}
                className='px-4 py-3 text-left font-semibold text-text-primary text-[12px] uppercase tracking-wide'
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-[rgba(37,99,235,0.06)]'>
          {rows.map((row, i) => (
            <tr
              key={i}
              className='bg-white hover:bg-[rgba(37,99,235,0.03)] transition-colors'
            >
              {row.map((cell, j) => (
                <td key={j} className='px-4 py-3 text-text-secondary align-top'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
