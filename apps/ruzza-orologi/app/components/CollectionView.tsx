import {Link, useNavigate, useSearchParams} from 'react-router';
import {Analytics, Image, Money} from '@shopify/hydrogen';
import * as React from 'react';
import {useVariantUrl} from '~/lib/variants';
import type {BrandCount} from '~/lib/brands';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';

/**
 * Shared, Tailwind-based collection page used by the watches and bags routes
 * (and reusable by any collection). Filters are stored in the URL as raw
 * Shopify `ProductFilter` JSON strings under repeated `?filter=` params, so the
 * loader can `JSON.parse` them and hand them straight to the Storefront API.
 *
 * Availability counts come for free from the `filters` facet returned by the
 * products connection — including the "vendor" (brand) facet that powers the
 * brand selector.
 */

export const SORT_OPTIONS = [
  {value: 'COLLECTION_DEFAULT-false', label: 'In evidenza'},
  {value: 'PRICE-false', label: 'Prezzo: crescente'},
  {value: 'PRICE-true', label: 'Prezzo: decrescente'},
  {value: 'TITLE-false', label: 'A-Z'},
  {value: 'TITLE-true', label: 'Z-A'},
  {value: 'CREATED-true', label: 'Più recenti'},
] as const;

interface CollectionViewProps {
  collection: any;
  /** Raw Shopify filter JSON strings currently applied (from `?filter=`). */
  appliedFilters: string[];
  sortKey: string;
  reverse: boolean;
  /** Brand selector entries (with availability counts). Omit to hide it. */
  brands?: BrandCount[];
  /** Slug of the currently selected brand, if any (from `?brand=`). */
  activeBrandSlug?: string | null;
  eyebrow?: string;
}

export function CollectionView({
  collection,
  appliedFilters,
  sortKey,
  reverse,
  brands,
  activeBrandSlug = null,
  eyebrow = 'Collezione',
}: CollectionViewProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const products = collection.products.nodes;
  const pageInfo = collection.products.pageInfo;
  const otherFilters: Filter[] = collection.products.filters || [];

  /** Select/deselect a brand. Brand changes swap the queried collection, so
   * collection-specific facet filters are cleared. */
  const selectBrand = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (params.get('brand') === slug) {
      params.delete('brand');
    } else {
      params.set('brand', slug);
    }
    params.delete('filter');
    params.delete('cursor');
    params.delete('direction');
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  };

  /** Add or remove a raw filter-input JSON string, resetting pagination. */
  const toggleFilter = (input: string) => {
    const params = new URLSearchParams(searchParams);
    const current = params.getAll('filter');
    params.delete('filter');
    const next = current.includes(input)
      ? current.filter((f) => f !== input)
      : [...current, input];
    next.forEach((f) => params.append('filter', f));
    // back to the first page whenever the result set changes
    params.delete('cursor');
    params.delete('direction');
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  };

  const updateSort = (value: string) => {
    const [key, rev] = value.split('-');
    const params = new URLSearchParams(searchParams);
    params.set('sort', key);
    params.set('reverse', rev);
    params.delete('cursor');
    params.delete('direction');
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  };

  const clearFilters = () => navigate('?', {preventScrollReset: true});

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="pt-32 pb-10">
          <div className="font-archivo text-xs tracking-[0.34em] uppercase text-[#a39c92] mb-4">
            {eyebrow}
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

      {/* Brand selector */}
      {brands && brands.length > 0 && (
        <BrandBar
          brands={brands}
          activeBrandSlug={activeBrandSlug}
          onSelect={selectBrand}
        />
      )}

      {/* Filters & sort bar */}
      <div className="sticky top-0 z-10 bg-[#f7f4ee]/95 backdrop-blur-sm border-y border-[#e5e2dc]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {otherFilters.map((filter) => (
                <FilterDropdown
                  key={filter.id}
                  filter={filter}
                  appliedFilters={appliedFilters}
                  onToggle={toggleFilter}
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

            <div className="flex items-center gap-2">
              <span className="font-archivo text-xs tracking-[0.1em] uppercase text-[#a39c92]">
                Ordina:
              </span>
              <select
                value={`${sortKey}-${reverse}`}
                onChange={(e) => updateSort(e.target.value)}
                className="font-archivo text-sm bg-transparent border border-[#d4d0c8] rounded px-3 py-1.5 text-[#1a1815] cursor-pointer hover:border-[#a39c92] transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product: any, index: number) => (
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
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </div>
  );
}

function BrandBar({
  brands,
  activeBrandSlug,
  onSelect,
}: {
  brands: BrandCount[];
  activeBrandSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="border-t border-[#e5e2dc] bg-[#f7f4ee]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 py-5">
        <div className="font-archivo text-[11px] tracking-[0.2em] uppercase text-[#a39c92] mb-3">
          Marca
        </div>
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
            const isActive = brand.slug === activeBrandSlug;
            return (
              <button
                key={brand.slug}
                onClick={() => onSelect(brand.slug)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 font-archivo text-xs tracking-[0.06em] px-4 py-2 rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1a1815] text-[#f7f4ee] border-[#1a1815]'
                    : 'bg-white text-[#1a1815] border-[#d4d0c8] hover:border-[#a39c92]'
                }`}
              >
                {brand.label}
                <span className={isActive ? 'text-[#f7f4ee]/70' : 'text-[#a39c92]'}>
                  {brand.count}
                  {brand.capped ? '+' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({
  filter,
  appliedFilters,
  onToggle,
}: {
  filter: Filter;
  appliedFilters: string[];
  onToggle: (input: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = filter.values.some((v) =>
    appliedFilters.includes(String(v.input)),
  );

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 font-archivo text-xs tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
          hasActiveFilters
            ? 'bg-[#1a1815] text-[#f7f4ee] border-[#1a1815]'
            : 'bg-white text-[#1a1815] border-[#d4d0c8] hover:border-[#a39c92]'
        }`}
      >
        {filter.label}
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] max-h-[320px] overflow-y-auto bg-white rounded-lg shadow-lg border border-[#e5e2dc] py-2 z-20">
          {filter.values.map((value) => {
            const input = String(value.input);
            const isActive = appliedFilters.includes(input);
            return (
              <button
                key={value.id}
                onClick={() => {
                  onToggle(input);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 font-archivo text-sm transition-colors ${
                  isActive
                    ? 'bg-[#f7f4ee] text-[#1a1815] font-medium'
                    : 'text-[#6b665d] hover:bg-[#f7f4ee] hover:text-[#1a1815]'
                }`}
              >
                <span className="flex items-center justify-between gap-4">
                  {value.label}
                  {typeof value.count === 'number' && (
                    <span className="text-xs text-[#a39c92]">
                      ({value.count})
                    </span>
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
    <Link to={variantUrl} prefetch="intent" className="group flex flex-col">
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
        {!product.availableForSale && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-[#1a1815] px-3 py-1 font-archivo text-[10px] font-medium tracking-[0.14em] uppercase text-[#f7f4ee]">
            Esaurito
          </span>
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
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {isPrevious ? 'Precedente' : 'Successivo'}
      {!isPrevious && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}

/** Collection-by-ID query with filters, sort, pagination and facet counts. */
export const COLLECTION_BY_ID_QUERY = `#graphql
  fragment MoneyCollectionView on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductCardCollectionView on Product {
    id
    handle
    title
    vendor
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionView
      }
    }
  }
  query CollectionById(
    $id: ID!
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
    collection(id: $id) {
      id
      handle
      title
      description
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
        sortKey: $sortKey
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
          ...ProductCardCollectionView
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
` as const;
