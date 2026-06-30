import {redirect, useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {CollectionView} from '~/components/CollectionView';
import type {Route} from './+types/collections.$handle';
import type {
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Ruzza Orologi | ${data?.collection.title ?? 'Collezione'}`}];
};

export async function loader({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);

  if (!handle) {
    throw redirect('/collections');
  }

  // Applied filters are stored as raw Shopify `ProductFilter` JSON strings,
  // matching the convention used by the orologi/borse pages and CollectionView.
  const appliedFilters = url.searchParams.getAll('filter');
  const filters = appliedFilters
    .map((f) => {
      try {
        return JSON.parse(f) as ProductFilter;
      } catch {
        return null;
      }
    })
    .filter((f): f is ProductFilter => f !== null);

  const sortKey = (url.searchParams.get('sort') ||
    'COLLECTION_DEFAULT') as ProductCollectionSortKeys;
  const reverse = url.searchParams.get('reverse') === 'true';
  const paginationVariables = getPaginationVariables(request, {pageBy: 16});

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        filters: filters.length > 0 ? filters : undefined,
        sortKey,
        reverse,
        ...paginationVariables,
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
    appliedFilters,
    sortKey,
    reverse,
  };
}

export default function Collection() {
  const {collection, appliedFilters, sortKey, reverse} =
    useLoaderData<typeof loader>();

  return (
    <CollectionView
      collection={collection}
      appliedFilters={appliedFilters}
      sortKey={sortKey}
      reverse={reverse}
    />
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
