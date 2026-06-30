import {Link, useFetcher} from 'react-router';
import type {Fetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect, type MutableRefObject, type ReactNode} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';
import type {PredictiveSearchReturn} from '~/lib/search';
import {useAside} from './Aside';
import type {
  PredictiveArticleFragment,
  PredictiveCollectionFragment,
  PredictivePageFragment,
  PredictiveProductFragment,
  PredictiveQueryFragment,
} from 'storefrontapi.generated';

type PredictiveSearchItems = NonNullable<PredictiveSearchReturn['result']['items']>;

interface UsePredictiveSearchReturn {
  term: MutableRefObject<string>;
  total: number;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
}

interface SearchResultsPredictiveArgs
  extends Pick<UsePredictiveSearchReturn, 'term' | 'total' | 'inputRef' | 'items'> {
  state: Fetcher['state'];
  closeSearch: () => void;
}

interface SearchResultsPredictiveProps {
  children: (args: SearchResultsPredictiveArgs) => ReactNode;
}

interface PartialPredictiveSearchResultArticles {
  articles: PredictiveArticleFragment[];
  term: MutableRefObject<string>;
  closeSearch: () => void;
}

interface PartialPredictiveSearchResultCollections {
  collections: PredictiveCollectionFragment[];
  term: MutableRefObject<string>;
  closeSearch: () => void;
}

interface PartialPredictiveSearchResultPages {
  pages: PredictivePageFragment[];
  term: MutableRefObject<string>;
  closeSearch: () => void;
}

interface PartialPredictiveSearchResultProducts {
  products: PredictiveProductFragment[];
  term: MutableRefObject<string>;
  closeSearch: () => void;
}

interface PartialPredictiveSearchResultQueries {
  queries: PredictiveQueryFragment[];
  queriesDatalistId: string;
}

interface SearchResultsPredictiveEmptyProps {
  term: MutableRefObject<string>;
}

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({children}: SearchResultsPredictiveProps): ReactNode {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResultArticles) {
  if (!articles.length) return null;

  return (
    <div className="mt-3 first:mt-0" key="articles">
      <h5 className="font-archivo text-[11px] tracking-[0.2em] uppercase text-[#a39c92] px-2 mb-1.5">
        Articoli
      </h5>
      <ul className="flex flex-col">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li key={article.id}>
              <Link
                onClick={closeSearch}
                to={articleUrl}
                className="flex items-center gap-3 p-2 rounded-lg no-underline hover:bg-[#f7f4ee] transition-colors"
              >
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded object-cover bg-[#eae7e1] flex-shrink-0"
                  />
                )}
                <span className="font-archivo text-[14px] text-[#1a1815] truncate">
                  {article.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResultCollections) {
  if (!collections.length) return null;

  return (
    <div className="mt-3 first:mt-0" key="collections">
      <h5 className="font-archivo text-[11px] tracking-[0.2em] uppercase text-[#a39c92] px-2 mb-1.5">
        Collezioni
      </h5>
      <ul className="flex flex-col">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li key={collection.id}>
              <Link
                onClick={closeSearch}
                to={collectionUrl}
                className="flex items-center gap-3 p-2 rounded-lg no-underline hover:bg-[#f7f4ee] transition-colors"
              >
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded object-cover bg-[#eae7e1] flex-shrink-0"
                  />
                )}
                <span className="font-archivo text-[14px] text-[#1a1815] truncate">
                  {collection.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResultPages) {
  if (!pages.length) return null;

  return (
    <div className="mt-3 first:mt-0" key="pages">
      <h5 className="font-archivo text-[11px] tracking-[0.2em] uppercase text-[#a39c92] px-2 mb-1.5">
        Pagine
      </h5>
      <ul className="flex flex-col">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li key={page.id}>
              <Link
                onClick={closeSearch}
                to={pageUrl}
                className="block px-2 py-2.5 rounded-lg no-underline font-archivo text-[14px] text-[#1a1815] hover:bg-[#f7f4ee] transition-colors truncate"
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResultProducts) {
  if (!products.length) return null;

  return (
    <div className="mt-3 first:mt-0" key="products">
      <h5 className="font-archivo text-[11px] tracking-[0.2em] uppercase text-[#a39c92] px-2 mb-1.5">
        Prodotti
      </h5>
      <ul className="flex flex-col">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li key={product.id}>
              <Link
                to={productUrl}
                onClick={closeSearch}
                className="flex items-center gap-3 p-2 rounded-lg no-underline hover:bg-[#f7f4ee] transition-colors"
              >
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded object-cover bg-[#eae7e1] flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-archivo text-[14px] leading-snug text-[#1a1815] truncate">
                    {product.title}
                  </p>
                  {price && (
                    <small className="font-archivo text-[12px] text-[#6b665d]">
                      <Money as="span" data={price} />
                    </small>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResultQueries) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({term}: SearchResultsPredictiveEmptyProps) {
  if (!term.current) {
    return null;
  }

  return (
    <p className="py-6 text-center font-archivo text-[14px] text-[#6b665d]">
      Nessun risultato per <q className="text-[#1a1815]">{term.current}</q>
    </p>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * ```ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * ```
 */
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}
