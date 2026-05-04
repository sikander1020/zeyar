import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AttributeCardProps {
  /** The descriptive label (e.g., 'Fabric', 'Craft') */
  label: string;
  /** The value for this attribute */
  value: string;
  /** Lucide or similar icon component */
  icon: LucideIcon;
  /** Optional loading state for async data fetching */
  isLoading?: boolean;
}

/**
 * Reusable Attribute Card for displaying key product metrics and details.
 * Accessible, responsive, and handles graceful loading states.
 */
export const AttributeCard: React.FC<AttributeCardProps> = ({
  label,
  value,
  icon: Icon,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div 
        className="border border-nude/25 bg-white/70 px-4 py-3 animate-pulse"
        aria-busy="true"
        aria-label={`Loading ${label} attribute`}
      >
        <div className="flex items-start gap-2.5 opacity-50">
          <div className="mt-0.5 w-3.5 h-3.5 bg-rose-gold/20 rounded" />
          <div className="w-full">
            <div className="h-2 w-12 bg-brown-muted/20 rounded mb-1.5" />
            <div className="h-3 w-20 bg-brown/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Graceful fallback for missing values
  const displayValue = value?.trim() || 'N/A';

  return (
    <div className="border border-nude/25 bg-white/70 backdrop-blur-sm px-4 py-3 transition-all duration-300 hover:bg-white/80 hover:shadow-sm hover:border-rose-gold/30 hover:-translate-y-0.5">
      <div className="flex items-start gap-2.5">
        <Icon size={14} className="mt-0.5 text-rose-gold shrink-0" strokeWidth={1.6} aria-hidden="true" />
        <div>
          <h4 
            className="text-[10px] tracking-[0.14em] uppercase text-brown-muted font-inter m-0" 
            style={{ fontFamily: "'Inter', sans-serif" }}
            id={`attr-label-${label.toLowerCase()}`}
          >
            {label}
          </h4>
          <p 
            className="text-sm text-brown font-inter m-0" 
            style={{ fontFamily: "'Inter', sans-serif" }}
            aria-labelledby={`attr-label-${label.toLowerCase()}`}
          >
            {displayValue}
          </p>
        </div>
      </div>
    </div>
  );
};
