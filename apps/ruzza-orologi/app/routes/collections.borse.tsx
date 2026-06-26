import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {CollectionView, COLLECTION_BY_ID_QUERY} from '~/components/CollectionView';
import {
  BAG_BRANDS,
  BAG_BRAND_COUNTS_QUERY,
  getBrand,
  parseBrandCounts,
} from '~/lib/brands';
import type {Route} from './+types/collections.borse';
import type {ProductFilter} from '@shopify/hydrogen/storefront-api-types';

const BORSE_COLLECTION_ID = 'gid://shopify/Collection/387924197622';

export const meta: Route.MetaFunction = ({data}) => {
  const brand = data?.brands?.find((b) => b.slug === data?.activeBrandSlug);
  const suffix = brand ? `Borse ${brand.label}` : (data?.collection?.title ?? 'Borse');
  return [{title: `Ruzza Orologi | ${suffix}`}];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const url = new URL(request.url);

  // A selected brand swaps the queried collection (brands are modelled as
  // standalone collections — the product `vendor` field can't distinguish them).
  const activeBrandSlug = url.searchParams.get('brand');
  const activeBrand = getBrand(BAG_BRANDS, activeBrandSlug);
  const collectionId = activeBrand
    ? `gid://shopify/Collection/${activeBrand.id}`
    : BORSE_COLLECTION_ID;

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

  const sortKey = url.searchParams.get('sort') || 'COLLECTION_DEFAULT';
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
    storefront.query(BAG_BRAND_COUNTS_QUERY, {
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
    brands: parseBrandCounts(BAG_BRANDS, brandCountsData as Record<string, unknown>),
    activeBrandSlug,
  };
}

export default function BorseCollection() {
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
