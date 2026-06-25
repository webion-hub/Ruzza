import {Link, useNavigate} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';

interface ProductFormProps {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}

export function ProductForm({productOptions, selectedVariant}: ProductFormProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name} className="space-y-3">
            <label className="block font-archivo text-[12px] tracking-[0.12em] uppercase text-[#5a564f]">
              {option.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const baseClasses = `
                  inline-flex items-center justify-center min-w-[44px] h-[44px] px-4
                  font-archivo text-[13px] tracking-[0.02em]
                  border rounded-lg transition-all duration-200
                  ${selected
                    ? 'border-[#2a2722] bg-[#2a2722] text-white'
                    : 'border-[rgba(42,39,34,0.2)] bg-white text-[#2a2722] hover:border-[#2a2722]'
                  }
                  ${!available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                  ${!exists ? 'hidden' : ''}
                `;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={baseClasses}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={baseClasses}
                      key={option.name + name}
                      disabled={!exists || !available}
                      onClick={() => {
                        if (!selected && exists) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Contact for info */}
      <a
        href="https://t.me/ruzzaorologi"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 font-archivo text-[13px] tracking-[0.08em] uppercase bg-[#2a2722] text-[#f4f1ea] rounded-lg border-2 border-transparent hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
        </svg>
        Contattaci su Telegram
      </a>
    </div>
  );
}

interface ProductOptionSwatchProps {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}

function ProductOptionSwatch({swatch, name}: ProductOptionSwatchProps) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span>{name}</span>;

  return (
    <div
      aria-label={name}
      className="w-6 h-6 rounded-full border border-[rgba(42,39,34,0.2)] overflow-hidden"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </div>
  );
}
