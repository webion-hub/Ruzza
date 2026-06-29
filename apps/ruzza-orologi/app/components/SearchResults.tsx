import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import type {ReactNode} from 'react';
import {urlWithTrackingParams} from '~/lib/search';
import type {RegularSearchReturn} from '~/lib/search';
import type {
  SearchProductFragment,
  SearchPageFragment,
  SearchArticleFragment,
} from 'storefrontapi.generated';

type SearchItems = RegularSearchReturn['result']['items'];

interface SearchResultsProps {
  term: string;
  result: RegularSearchReturn['result'];
  children: (args: SearchItems & {term: string}) => ReactNode;
}

interface PartialSearchResultArticles {
  term: string;
  articles: SearchItems['articles'];
}

interface PartialSearchResultPages {
  term: string;
  pages: SearchItems['pages'];
}

interface PartialSearchResultProducts {
  term: string;
  products: SearchItems['products'];
}

export function SearchResults({term, result, children}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({term, articles}: PartialSearchResultArticles) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="font-archivo text-xs tracking-[0.2em] uppercase text-[#a39c92] mb-5">
        Articoli
      </h2>
      <div className="flex flex-col divide-y divide-[#e5e2dc] border-y border-[#e5e2dc]">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              prefetch="intent"
              to={articleUrl}
              key={article.id}
              className="py-4 font-archivo text-[15px] text-[#1a1815] no-underline hover:text-[#c0563f] transition-colors"
            >
              {article.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResultPages) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div>
      <h2 className="font-archivo text-xs tracking-[0.2em] uppercase text-[#a39c92] mb-5">
        Pagine
      </h2>
      <div className="flex flex-col divide-y divide-[#e5e2dc] border-y border-[#e5e2dc]">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              prefetch="intent"
              to={pageUrl}
              key={page.id}
              className="py-4 font-archivo text-[15px] text-[#1a1815] no-underline hover:text-[#c0563f] transition-colors"
            >
              {page.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({term, products}: PartialSearchResultProducts) {
  if (!products?.nodes.length) {
    return null;
  }

  const linkClass =
    'inline-flex items-center gap-2 font-archivo text-xs tracking-[0.14em] uppercase px-6 py-3 rounded-full border border-[#1a1815] text-[#1a1815] no-underline hover:bg-[#1a1815] hover:text-[#f7f4ee] transition-all duration-200';

  return (
    <div>
      <h2 className="font-archivo text-xs tracking-[0.2em] uppercase text-[#a39c92] mb-6">
        Prodotti
      </h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                prefetch="intent"
                to={productUrl}
                key={product.id}
                className="group flex flex-col no-underline"
              >
                <div className="relative aspect-square overflow-hidden bg-[#eae7e1] rounded-sm mb-4">
                  {image && (
                    <Image
                      data={image}
                      alt={product.title}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="font-['Libre_Baskerville'] font-normal text-[clamp(15px,1.2vw,19px)] leading-[1.2] text-[#1a1815] mb-1">
                  {product.title}
                </h3>
                {price && (
                  <p className="font-archivo text-sm text-[#1a1815]">
                    <Money as="span" data={price} />
                  </p>
                )}
              </Link>
            );
          });

          return (
            <div className="flex flex-col gap-12">
              <div className="flex justify-center">
                <PreviousLink className={linkClass}>
                  {isLoading ? 'Caricamento…' : <span>↑ Carica precedenti</span>}
                </PreviousLink>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {ItemsMarkup}
              </div>
              <div className="flex justify-center">
                <NextLink className={linkClass}>
                  {isLoading ? 'Caricamento…' : <span>Carica altri ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <p className="py-16 text-center font-archivo text-lg text-[#6b665d]">
      Nessun risultato. Prova con un&apos;altra ricerca.
    </p>
  );
}
