import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {CollectionView, COLLECTION_BY_ID_QUERY} from '~/components/CollectionView';
import {
  WATCH_BRANDS,
  WATCH_BRAND_COUNTS_QUERY,
  getBrand,
  parseBrandCounts,
} from '~/lib/brands';
import type {Route} from './+types/collections.orologi';
import type {
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

const OROLOGI_COLLECTION_ID = 'gid://shopify/Collection/387924230390';

export const meta: Route.MetaFunction = ({data}) => {
  const brand = data?.brands?.find((b) => b.slug === data?.activeBrandSlug);
  const suffix = brand ? `Orologi ${brand.label}` : (data?.collection?.title ?? 'Orologi');
  return [{title: `Ruzza Orologi | ${suffix}`}];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const url = new URL(request.url);

  // A selected brand swaps the queried collection (brands are modelled as
  // standalone collections — the product `vendor` field can't distinguish them).
  const activeBrandSlug = url.searchParams.get('brand');
  const activeBrand = getBrand(WATCH_BRANDS, activeBrandSlug);
  const collectionId = activeBrand
    ? `gid://shopify/Collection/${activeBrand.id}`
    : OROLOGI_COLLECTION_ID;

  // Applied filters are stored as raw Shopify `ProductFilter` JSON strings.
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

  const [{collection}, brandCountsData] = await Promise.all([
    storefront.query(COLLECTION_BY_ID_QUERY, {
      variables: {
        id: collectionId,
        filters: filters.length > 0 ? filters : undefined,
        sortKey,
        reverse,
        ...paginationVariables,
      },
    }),
    storefront.query(WATCH_BRAND_COUNTS_QUERY, {
      cache: storefront.CacheLong(),
    }),
  ]);

  if (!collection) {
    throw new Response('Collection not found', {status: 404});
  }

  return {
    collection,
    appliedFilters,
    sortKey,
    reverse,
    brands: parseBrandCounts(WATCH_BRANDS, brandCountsData as Record<string, unknown>),
    activeBrandSlug,
  };
}

export default function OrologiCollection() {
  const {collection, appliedFilters, sortKey, reverse, brands, activeBrandSlug} =
    useLoaderData<typeof loader>();

  return (
    <CollectionView
      collection={collection}
      appliedFilters={appliedFilters}
      sortKey={sortKey}
      reverse={reverse}
      brands={brands}
      activeBrandSlug={activeBrandSlug}
    />
  );
}
