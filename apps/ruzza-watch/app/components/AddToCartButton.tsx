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
                w-full sm:max-w-[400px] py-3 px-6 rounded-[8px]
                font-archivo font-medium text-[11px] tracking-[0.15em] uppercase
                transition-all duration-200
                ${isDisabled
                  ? 'border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.4)] cursor-not-allowed'
                  : 'bg-[#c8a35f] text-[#1a1815] hover:bg-[#d4b06a] active:scale-[0.98]'
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
