import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import type {ProductFragment} from 'storefrontapi.generated';

interface ProductFormProps {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  /** Title of the current product, used in the WhatsApp prefilled message. */
  productTitle: string;
  /** Absolute URL of the current product, appended to the WhatsApp message. */
  productUrl: string;
}

export function ProductForm({
  productOptions,
  selectedVariant,
  productTitle,
  productUrl,
}: ProductFormProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name} className="space-y-3">
            <label className="block font-archivo text-[12px] tracking-[0.12em] uppercase text-[rgba(247,244,238,0.5)]">
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
                    ? 'border-[#c8a35f] bg-[#c8a35f] text-[#1a1815]'
                    : 'border-[rgba(255,255,255,0.2)] bg-transparent text-[#f7f4ee] hover:border-[#c8a35f]'
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

      {/* Add to Cart Button */}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Aggiungi al carrello' : 'Esaurito'}
      </AddToCartButton>
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
      className="w-6 h-6 rounded-full border border-[rgba(255,255,255,0.2)] overflow-hidden"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover" />}
    </div>
  );
}
