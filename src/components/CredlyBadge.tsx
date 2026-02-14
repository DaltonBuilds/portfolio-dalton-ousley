import React from 'react';
import { OptimizedImage } from '@/components/OptimizedImage';

interface CredlyBadgeProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  disableLink?: boolean;
}

/**
 * CredlyBadge component for displaying Google PCA certification badge
 * Uses OptimizedImage for proper Next.js optimization
 */
const CredlyBadge: React.FC<CredlyBadgeProps> = ({ 
  width = 200, 
  height = 200,
  className = '',
  priority = false,
  disableLink = false
}) => {
  const imageElement = (
    <OptimizedImage
      src="/professional-cloud-architect-certification.webp"
      alt="Google Professional Cloud Architect Certification Badge"
      width={width}
      height={height}
      className="rounded-lg"
      priority={priority}
      sizes={`${width}px`}
    />
  );

  return (
    <div className={`certification-badge ${className}`}>
      {disableLink ? (
        <div className="block transition-transform hover:scale-105 rounded-lg">
          {imageElement}
        </div>
      ) : (
        <a
          href="https://www.credly.com/badges/5aecdd3d-bda8-4fa8-bfcb-fb821c0be494"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          aria-label="View Google Professional Cloud Architect certification on Credly"
        >
          {imageElement}
        </a>
      )}
    </div>
  );
};

export default CredlyBadge;

