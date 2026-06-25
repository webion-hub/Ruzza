import {CartForm} from '@shopify/hydrogen';
import type {OptimisticCartLineInput} from '@shopify/hydrogen';
import type {FetcherWithComponents} from 'react-router';

interface AddToCartButtonProps {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: AddToCartButtonProps) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<unknown>) => {
        const isLoading = fetcher.state !== 'idle';
        const isDisabled = disabled || isLoading;

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className={`
                w-full py-4 px-8 rounded-lg
                font-archivo font-semibold text-[13px] tracking-[0.12em] uppercase
                transition-all duration-200
                ${isDisabled
                  ? 'bg-[#d1cec7] text-[#8c867d] cursor-not-allowed'
                  : 'bg-[#2a2722] text-[#f4f1ea] hover:bg-[#1a1712] active:scale-[0.98]'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Aggiungendo...
                </span>
              ) : (
                children
              )}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
