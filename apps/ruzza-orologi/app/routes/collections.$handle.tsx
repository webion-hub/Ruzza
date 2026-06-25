import {redirect, useLoaderData, useSearchParams, useNavigate} from 'react-router';
import {getPaginationVariables, Analytics, Image, Money} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import type {Route} from './+types/collections.$handle';
import type {Filter, ProductFilter} from '@shopify/hydrogen/storefront-api-types';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Ruzza Orologi | ${data?.collection.title ?? 'Collezione'}`}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);

  // Get filter params from URL
  const filterParams = url.searchParams.getAll('filter');
  const sortKey = url.searchParams.get('sort') || 'COLLECTION_DEFAULT';
  const reverse = url.searchParams.get('reverse') === 'true';

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

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        filters: filters.length > 0 ? filters : undefined,
        sortKey,
        reverse,
        ...paginationVariables
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
    appliedFilters: filterParams,
    sortKey,
    reverse,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection, appliedFilters, sortKey, reverse} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const updateFilter = (filterKey: string, filterValue: string, add: boolean) => {
    const params = new URLSearchParams(searchParams);
    const filterString = `${filterKey}:${filterValue}`;

    if (add) {
      params.append('filter', filterString);
    } else {
      const filters = params.getAll('filter').filter(f => f !== filterString);
      params.delete('filter');
      filters.forEach(f => params.append('filter', f));
    }

    navigate(`?${params.toString()}`, {preventScrollReset: true});
  };

  const updateSort = (newSortKey: string, newReverse: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSortKey);
    params.set('reverse', String(newReverse));
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  };

  const clearFilters = () => {
    navigate('?', {preventScrollReset: true});
  };

  const products = collection.products.nodes;
  const pageInfo = collection.products.pageInfo;
  const availableFilters = collection.products.filters || [];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* Header */}
      <div className="pt-32 pb-12 px-6 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="font-archivo text-xs tracking-[0.34em] uppercase text-[#a39c92] mb-4">
            Collezione
          </div>
          <h1 className="font-['Libre_Baskerville'] font-light text-[clamp(34px,5vw,56px)] leading-[1.1] text-[#1a1815]">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-4 max-w-[600px] font-archivo text-[15px] leading-[1.7] text-[#6b665d]">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Filters & Sort Bar */}
      <div className="sticky top-0 z-10 bg-[#f7f4ee]/95 backdrop-blur-sm border-y border-[#e5e2dc]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {availableFilters.map((filter: Filter) => (
                <FilterDropdown
                  key={filter.id}
                  filter={filter}
                  appliedFilters={appliedFilters}
                  onUpdate={updateFilter}
                />
              ))}

              {appliedFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-archivo text-xs tracking-[0.1em] uppercase text-[#c0563f] hover:underline"
                >
                  Rimuovi filtri
                </button>
              )}
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
                <option value="COLLECTION_DEFAULT-false">In evidenza</option>
                <option value="PRICE-false">Prezzo: crescente</option>
                <option value="PRICE-true">Prezzo: decrescente</option>
                <option value="TITLE-false">A-Z</option>
                <option value="TITLE-true">Z-A</option>
                <option value="CREATED-true">Più recenti</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - 4x4 */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, index) => (
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
              Nessun prodotto trovato con i filtri selezionati.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 font-archivo text-sm tracking-[0.1em] uppercase text-[#1a1815] underline underline-offset-4 hover:text-[#c0563f]"
            >
              Rimuovi tutti i filtri
            </button>
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

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function FilterDropdown({
  filter,
  appliedFilters,
  onUpdate,
}: {
  filter: Filter;
  appliedFilters: string[];
  onUpdate: (key: string, value: string, add: boolean) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterKey = filter.type === 'PRICE_RANGE' ? 'price' : filter.id.toLowerCase();
  const hasActiveFilters = filter.values.some(v =>
    appliedFilters.includes(`${filterKey}:${v.input}`)
  );

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 font-archivo text-xs tracking-[0.1em] uppercase
          px-4 py-2 rounded-full border transition-all duration-200
          ${hasActiveFilters
            ? 'bg-[#1a1815] text-[#f7f4ee] border-[#1a1815]'
            : 'bg-white text-[#1a1815] border-[#d4d0c8] hover:border-[#a39c92]'
          }
        `}
      >
        {filter.label}
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-[#e5e2dc] py-2 z-20">
          {filter.values.map((value) => {
            const filterValue = filter.type === 'PRICE_RANGE'
              ? `${JSON.parse(value.input as string).price.min || 0}-${JSON.parse(value.input as string).price.max || 999999}`
              : String(value.input).replace(/"/g, '');
            const isActive = appliedFilters.includes(`${filterKey}:${filterValue}`);

            return (
              <button
                key={value.id}
                onClick={() => {
                  onUpdate(filterKey, filterValue, !isActive);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 font-archivo text-sm transition-colors
                  ${isActive
                    ? 'bg-[#f7f4ee] text-[#1a1815] font-medium'
                    : 'text-[#6b665d] hover:bg-[#f7f4ee] hover:text-[#1a1815]'
                  }
                `}
              >
                <span className="flex items-center justify-between">
                  {value.label}
                  {value.count !== undefined && (
                    <span className="text-xs text-[#a39c92]">({value.count})</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import * as React from 'react';

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
        <Money data={product.priceRange.minVariantPrice} />
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

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
