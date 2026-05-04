import React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming standard cn utility, or fallback to classNames

interface StockBadgeProps {
  /** The current exact stock count */
  stock: number;
  /** Whether the item is manually marked as out of stock or stock is 0 */
  outOfStock: boolean;
  /** Threshold to trigger the "low stock" warning. Defaults to 3. */
  lowStockThreshold?: number;
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * A highly reusable, accessible badge component to display real-time inventory status.
 * Handles edge cases like negative stock numbers and provides ARIA statuses.
 */
export const StockBadge: React.FC<StockBadgeProps> = ({
  stock,
  outOfStock,
  lowStockThreshold = 3,
  className,
}) => {
  // Edge Case: Treat negative stock as completely out of stock
  const isOutOfStock = outOfStock || stock <= 0;
  const isLowStock = !isOutOfStock && stock <= lowStockThreshold;
  const isInStock = !isOutOfStock && stock > lowStockThreshold;

  // Base styling and font
  const baseClasses = "inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-inter font-semibold transition-all duration-300";

  if (isOutOfStock) {
    return (
      <span
        className={`${baseClasses} bg-red-50 border border-red-200 text-red-600 ${className || ''}`}
        role="status"
        aria-label="Currently out of stock"
      >
        <Package size={12} aria-hidden="true" />
        Out of Stock
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span
        className={`${baseClasses} bg-amber-50 border border-amber-200 text-amber-700 animate-pulse ${className || ''}`}
        role="status"
        aria-label={`Low stock warning: Only ${stock} items remaining`}
      >
        <Package size={12} aria-hidden="true" />
        {stock === 1 ? 'Only 1 remaining!' : `Only ${stock} remaining!`}
      </span>
    );
  }

  if (isInStock) {
    return (
      <span
        className={`${baseClasses} bg-green-50 border border-green-200 text-green-700 ${className || ''}`}
        role="status"
        aria-label={`In stock: ${stock} items remaining`}
      >
        <Package size={12} aria-hidden="true" />
        {stock > 10 ? 'In stock' : `${stock} remaining`}
      </span>
    );
  }

  return null;
};
