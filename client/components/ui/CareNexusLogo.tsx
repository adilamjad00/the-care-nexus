export interface CareNexusLogoProps {
  size?: number;
  className?: string;
  variant?: 'square' | 'capsule';
}

/**
 * The Care Nexus logo mark — renders The Care Nexus logo.
 */
export function CareNexusLogo({
  size,
  className = '',
  variant = 'square',
}: CareNexusLogoProps) {
  const width = size ?? 36;
  const height = variant === 'capsule' ? width : width;

  return (
    <img
      src='/logo4.png'
      alt='The Care Nexus Logo'
      width={width}
      height={height}
      className={`${className} object-contain`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
