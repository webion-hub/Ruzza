import {useLoaderData, Link} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  Money,
} from '@shopify/hydrogen';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type {Route} from './+types/products.$handle';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Ruzza Watch | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

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
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  const productUrl = `${new URL(request.url).origin}/products/${product.handle}`;

  return {
    product,
    productUrl,
  };
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

// Product specs mapping based on metafields or defaults
const defaultSpecs = {
  quadrante: 'Pietra naturale',
  cassa: 'Resina premium, 40 mm',
  movimento: 'Quarzo',
  cinturino: 'Maglia coordinata',
  impermeabilita: '3 ATM',
  garanzia: '24 mesi',
};

// Subtitle mapping based on product title
const productSubtitles: Record<string, string> = {
  'Calacatta': 'Marmo Calacatta · equilibrio',
  'Bianco Gold': 'Oro · prestigio',
  'Coral': 'Corallo · energia',
  'Nero Marquina': 'Marmo Nero · eleganza',
};

export default function Product() {
  const {product, productUrl} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const {title, description} = product;
  const isAvailable = selectedVariant?.availableForSale;
  const subtitle = productSubtitles[title] || `${product.productType || 'Pietra naturale'} · prestigio`;

  // Get current image
  const currentImage = selectedVariant?.image || product.images?.nodes?.[0];

  return (
    <div className="min-h-screen bg-[#0c0a08] relative overflow-hidden">
      {/* Marble background effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0c0a08] to-[#1a1a1a]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.008' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      {/* Back button */}
      <div className="relative z-10 px-4 sm:px-[clamp(24px,4vw,60px)] pt-[clamp(80px,10vh,100px)]">
        <Link
          to="/collections/orologi"
          className="inline-flex items-center gap-2 font-archivo text-[10px] font-medium tracking-[0.12em] uppercase px-4 py-2 rounded-[8px] border border-[rgba(255,255,255,0.15)] text-[#f7f4ee] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          <span>←</span>
          <span>Collezione</span>
        </Link>
      </div>

      {/* Main Product Section */}
      <div className="relative z-10 px-4 sm:px-[clamp(24px,4vw,60px)] py-4 sm:py-[clamp(16px,2vh,24px)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-6 sm:gap-8 lg:gap-[clamp(32px,4vw,60px)] items-start">

          {/* Left: Product Image */}
          <div className="relative aspect-square sm:aspect-[4/5] w-full max-w-[400px] sm:max-w-[560px] max-h-[50vh] sm:max-h-[75vh] mx-auto lg:mx-0 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
            {/* Marble background for image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a]">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.009' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                  mixBlendMode: 'overlay',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.3)] via-transparent to-[rgba(255,255,255,0.05)]" />
            </div>

            {currentImage ? (
              <Image
                data={currentImage}
                aspectRatio="1/1"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 80vw, 100vw"
                className="relative z-[1] w-full h-full object-contain p-4 sm:p-8 drop-shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div className="w-full h-full bg-[#1a1815]" />
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <div className="font-archivo text-[10px] tracking-[0.25em] uppercase text-[rgba(247,244,238,0.5)] mb-2">
              Ruzza Watch Basic
            </div>

            {/* Title */}
            <h1 className="font-['Libre_Baskerville'] font-normal text-[28px] sm:text-[clamp(28px,3.5vw,44px)] leading-[1.05] text-[#f7f4ee] mb-2">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="font-['Cormorant_Garamond'] italic text-[16px] sm:text-[clamp(14px,1.2vw,18px)] text-[#c8a35f] mb-4">
              {subtitle}
            </p>

            {/* Price + Badge */}
            <div className="flex items-center gap-3 mb-4">
              {selectedVariant?.price && (
                <span className="font-archivo text-[22px] sm:text-[clamp(20px,2vw,26px)] font-medium text-[#f7f4ee]">
                  <Money as="span" data={selectedVariant.price} />
                </span>
              )}
              <span className={`font-archivo text-[9px] font-medium tracking-[0.1em] uppercase px-2.5 py-1 rounded ${
                isAvailable
                  ? 'bg-[#4a5a4a] text-[#c8d4c8]'
                  : 'bg-[#3a3a3a] text-[#999999]'
              }`}>
                {isAvailable ? 'Disponibile' : 'Esaurito'}
              </span>
            </div>

            {/* Description */}
            {description && (
              <p className="font-archivo text-[13px] sm:text-[13px] leading-[1.7] text-[rgba(247,244,238,0.7)] mb-5">
                {description.length > 150 ? `${description.substring(0, 150)}...` : description}
              </p>
            )}

            {/* Add to Cart Button */}
            <div className="mb-6">
              {isAvailable ? (
                <ProductForm
                  productOptions={[]}
                  selectedVariant={selectedVariant}
                  productTitle={product.title}
                  productUrl={productUrl}
                />
              ) : (
                <button
                  disabled
                  className="w-full sm:max-w-[400px] font-archivo font-medium text-[11px] tracking-[0.15em] uppercase py-3 px-6 rounded-[8px] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.4)] cursor-not-allowed"
                >
                  Esaurito
                </button>
              )}
            </div>

            {/* Specs Table */}
            <div className="border-t border-[rgba(255,255,255,0.1)] pt-4 w-full sm:max-w-[400px]">
              <SpecRow label="Quadrante" value={defaultSpecs.quadrante} />
              <SpecRow label="Cassa" value={defaultSpecs.cassa} />
              <SpecRow label="Movimento" value={defaultSpecs.movimento} />
              <SpecRow label="Cinturino" value={defaultSpecs.cinturino} />
              <SpecRow label="Impermeabilità" value={defaultSpecs.impermeabilita} />
              <SpecRow label="Garanzia" value={defaultSpecs.garanzia} />
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

function SpecRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.08)]">
      <span className="font-archivo text-[10px] tracking-[0.1em] uppercase text-[rgba(247,244,238,0.5)]">
        {label}
      </span>
      <span className="font-archivo text-[12px] text-[#f7f4ee]">
        {value}
      </span>
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
    productType
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
