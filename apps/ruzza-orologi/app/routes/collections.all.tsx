import {useLoaderData, useSearchParams, useNavigate, Link} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import type {Route} from './+types/collections.all';
import type {ProductFilter} from '@shopify/hydrogen/storefront-api-types';
import * as React from 'react';

export const meta: Route.MetaFunction = () => {
  return [{title: `Ruzza Orologi | Tutti i Modelli`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const url = new URL(request.url);

  // Get filter params from URL
  const filterParams = url.searchParams.getAll('filter');
  const sortKey = url.searchParams.get('sort') || 'UPDATED_AT';
  const reverse = url.searchParams.get('reverse') !== 'false';

  // Build filters array for Shopify
  const filters: ProductFilter[] = filterParams.map(param => {
    const [key, value] = param.split(':');
    if (key === 'price') {
      const [min, max] = value.split('-');
      return {price: {min: parseFloat(min) || 0, max: parseFloat(max) || 999999}};
    }
    if (key === 'productType') {
      return {productType: value};
    }
    if (key === 'vendor') {
      return {productVendor: value};
    }
    if (key === 'available') {
      return {available: value === 'true'};
    }
    return {};
  }).filter(f => Object.keys(f).length > 0);

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16, // 4x4 grid
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        sortKey,
        reverse,
      },
    }),
  ]);

  return {
    products,
    appliedFilters: filterParams,
    sortKey,
    reverse,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function AllProducts() {
  const {products, appliedFilters, sortKey, reverse} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const updateSort = (newSortKey: string, newReverse: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSortKey);
    params.set('reverse', String(newReverse));
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  };

  const clearFilters = () => {
    navigate('?', {preventScrollReset: true});
  };

  const productNodes = products.nodes;
  const pageInfo = products.pageInfo;

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="pt-32 pb-12">
          <div className="font-archivo text-xs tracking-[0.34em] uppercase text-[#a39c92] mb-4">
            Catalogo
          </div>
          <h1 className="font-['Libre_Baskerville'] font-light text-[clamp(34px,5vw,56px)] leading-[1.1] text-[#1a1815]">
            Tutti i Modelli
          </h1>
          <p className="mt-4 max-w-[600px] font-archivo text-[15px] leading-[1.7] text-[#6b665d]">
            Esplora la nostra selezione completa di orologi di lusso, certificati e garantiti.
          </p>
        </div>
      </div>

      {/* Sort Bar */}
      <div className="sticky top-0 z-10 bg-[#f7f4ee]/95 backdrop-blur-sm border-y border-[#e5e2dc]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="font-archivo text-sm text-[#6b665d]">
              {productNodes.length} prodotti
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="font-archivo text-xs tracking-[0.1em] uppercase text-[#a39c92]">
                Ordina:
              </span>
              <select
                value={`${sortKey}-${reverse}`}
                onChange={(e) => {
                  const [key, rev] = e.target.value.split('-');
                  updateSort(key, rev === 'true');
                }}
                className="font-archivo text-sm bg-transparent border border-[#d4d0c8] rounded px-3 py-1.5 text-[#1a1815] cursor-pointer hover:border-[#a39c92] transition-colors"
              >
                <option value="UPDATED_AT-true">Più recenti</option>
                <option value="PRICE-false">Prezzo: crescente</option>
                <option value="PRICE-true">Prezzo: decrescente</option>
                <option value="TITLE-false">A-Z</option>
                <option value="TITLE-true">Z-A</option>
                <option value="BEST_SELLING-true">Più venduti</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - 4x4 */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-12">
        {productNodes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {productNodes.map((product: any, index: number) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-archivo text-lg text-[#6b665d]">
              Nessun prodotto trovato.
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-16 flex justify-center gap-4">
          {pageInfo.hasPreviousPage && (
            <PaginationLink
              direction="previous"
              pageInfo={pageInfo}
              searchParams={searchParams}
            />
          )}
          {pageInfo.hasNextPage && (
            <PaginationLink
              direction="next"
              pageInfo={pageInfo}
              searchParams={searchParams}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  loading,
}: {
  product: any;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      to={variantUrl}
      prefetch="intent"
      className="group flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-[#eae7e1] rounded-sm mb-4">
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}
        {/* Subtle bottom-up shadow over the image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </div>
      <h3 className="font-['Libre_Baskerville'] font-normal text-[clamp(16px,1.2vw,20px)] leading-[1.2] text-[#1a1815] mb-1">
        {product.title}
      </h3>
      {product.vendor && (
        <p className="font-archivo text-xs tracking-[0.06em] text-[#a39c92] mb-2">
          {product.vendor}
        </p>
      )}
      <p className="font-archivo text-sm text-[#1a1815]">
        <Money as="span" data={product.priceRange.minVariantPrice} />
      </p>
    </Link>
  );
}

function PaginationLink({
  direction,
  pageInfo,
  searchParams,
}: {
  direction: 'previous' | 'next';
  pageInfo: {startCursor?: string | null; endCursor?: string | null};
  searchParams: URLSearchParams;
}) {
  const params = new URLSearchParams(searchParams);

  if (direction === 'previous' && pageInfo.startCursor) {
    params.set('direction', 'previous');
    params.set('cursor', pageInfo.startCursor);
  } else if (direction === 'next' && pageInfo.endCursor) {
    params.delete('direction');
    params.set('cursor', pageInfo.endCursor);
  }

  const isPrevious = direction === 'previous';

  return (
    <Link
      to={`?${params.toString()}`}
      preventScrollReset
      className="inline-flex items-center gap-2 font-archivo text-xs tracking-[0.14em] uppercase px-6 py-3 rounded-full border border-[#1a1815] text-[#1a1815] hover:bg-[#1a1815] hover:text-[#f7f4ee] transition-all duration-200"
    >
      {isPrevious && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {isPrevious ? 'Precedente' : 'Successivo'}
      {!isPrevious && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </Link>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    vendor
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
