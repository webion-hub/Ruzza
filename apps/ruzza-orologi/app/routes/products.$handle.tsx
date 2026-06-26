import {useLoaderData, Link} from 'react-router';
import {useState, type ReactNode} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
} from '@shopify/hydrogen';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type {Route} from './+types/products.$handle';
import type {ProductFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Ruzza Orologi | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor, description} = product;

  // Get all images from the product
  const images = product.images?.nodes || [];
  const currentImage = images[selectedImageIndex] || selectedVariant?.image;

  return (
    <div className="min-h-screen bg-[#f8f6f2] pt-[var(--header-height,100px)] overscroll-contain">
      {/* Header background mask */}
      <div className="fixed top-0 left-0 right-0 h-[var(--header-height,100px)] bg-[#f8f6f2] z-[100]" />

      {/* Breadcrumb */}
      <nav className="relative sticky top-[var(--header-height,100px)] z-[50] bg-[#f8f6f2] px-[clamp(24px,6vw,96px)] py-4 font-archivo text-[13px] text-[#8c867d]">
        <Link to="/" className="hover:text-[#2a2722] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/collections/orologi" className="hover:text-[#2a2722] transition-colors">Orologi</Link>
        <span className="mx-2">/</span>
        <span className="text-[#2a2722]">{title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="relative z-0 px-[clamp(24px,6vw,96px)] pb-[clamp(48px,8vh,96px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(32px,5vw,80px)]">

          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:sticky lg:top-[calc(var(--header-height,100px)+60px)] lg:self-start">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[680px] pb-2 lg:pb-0 lg:pr-2">
                {images.map((image: any, index: number) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-[72px] h-[72px] lg:w-[72px] lg:h-[72px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'border-[#2a2722] opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      data={image}
                      aspectRatio="1/1"
                      sizes="72px"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="w-full max-w-[680px] aspect-square rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.8)] shadow-[0_4px_40px_rgba(0,0,0,0.06)]">
              {currentImage ? (
                <Image
                  data={currentImage}
                  aspectRatio="1/1"
                  sizes="680px"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#f0ede8]" />
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="relative z-0 flex flex-col justify-center py-4 lg:py-8">
            {/* Brand/Vendor */}
            {vendor && (
              <div className="font-archivo text-[clamp(10px,0.9vw,12px)] tracking-[0.3em] uppercase text-[#8c867d] mb-3">
                {vendor}
              </div>
            )}

            {/* Title */}
            <h1 className="font-['Libre_Baskerville'] font-normal text-[clamp(28px,3.5vw,48px)] leading-[1.1] text-[#2a2722] mb-6">
              {title}
            </h1>

            {/* Price */}
            <div className="mb-8">
              {selectedVariant?.compareAtPrice ? (
                <div className="flex items-center gap-4">
                  <span className="font-archivo text-[clamp(24px,2.5vw,36px)] font-medium text-[#2a2722]">
                    <Money as="span" data={selectedVariant.price} />
                  </span>
                  <span className="font-archivo text-[clamp(16px,1.5vw,22px)] text-[#8c867d] line-through">
                    <Money as="span" data={selectedVariant.compareAtPrice} />
                  </span>
                </div>
              ) : selectedVariant?.price ? (
                <span className="font-archivo text-[clamp(24px,2.5vw,36px)] font-medium text-[#2a2722]">
                  <Money as="span" data={selectedVariant.price} />
                </span>
              ) : null}
            </div>

            {/* Short Description */}
            {description && (
              <p className="font-archivo text-[15px] leading-[1.7] text-[#5a564f] mb-8 max-w-[52ch]">
                {description.length > 200 ? `${description.substring(0, 200)}...` : description}
              </p>
            )}

            {/* Divider */}
            <div className="w-full h-px bg-[rgba(42,39,34,0.12)] mb-8" />

            {/* Product Form (Variants + Add to Cart) */}
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
            />

            {/* Product Details Accordion */}
            <div className="mt-10 space-y-0 border-t border-[rgba(42,39,34,0.12)]">
              <ProductDetailSection title="Descrizione" defaultOpen>
                <div
                  className="font-archivo text-[14px] leading-[1.8] text-[#5a564f] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </ProductDetailSection>

              <ProductDetailSection title="Spedizione">
                <div className="font-archivo text-[14px] leading-[1.8] text-[#5a564f] space-y-2">
                  <p>Spedizione gratuita in Italia per ordini superiori a €500.</p>
                  <p>Consegna in 2-4 giorni lavorativi con corriere assicurato.</p>
                  <p>Spedizioni internazionali disponibili su richiesta.</p>
                </div>
              </ProductDetailSection>

              <ProductDetailSection title="Garanzia & Autenticità">
                <div className="font-archivo text-[14px] leading-[1.8] text-[#5a564f] space-y-2">
                  <p>Tutti gli orologi sono certificati autentici al 100%.</p>
                  <p>Garanzia Ruzza di 24 mesi inclusa.</p>
                  <p>Certificato di autenticità fornito con ogni acquisto.</p>
                </div>
              </ProductDetailSection>
            </div>
          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

// Accordion Section Component
function ProductDetailSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[rgba(42,39,34,0.12)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="font-archivo font-medium text-[14px] tracking-[0.04em] uppercase text-[#2a2722]">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-[#2a2722] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
