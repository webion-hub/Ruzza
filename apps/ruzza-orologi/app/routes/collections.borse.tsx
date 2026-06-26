import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics, Image, Money} from '@shopify/hydrogen';
import type {Route} from './+types/collections.borse';

const BORSE_COLLECTION_ID = 'gid://shopify/Collection/387924197622';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Ruzza Orologi | ${data?.collection?.title ?? 'Borse'}`}];
};

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const sortKey = url.searchParams.get('sort') || 'COLLECTION_DEFAULT';
  const reverse = url.searchParams.get('reverse') === 'true';

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16,
  });

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      id: BORSE_COLLECTION_ID,
      sortKey,
      reverse,
      ...paginationVariables,
    },
  });

  if (!collection) {
    throw new Response('Collection not found', {status: 404});
  }

  return {collection, sortKey, reverse};
}

export default function BorseCollection() {
  const {collection, sortKey, reverse} = useLoaderData<typeof loader>();
  const products = collection.products.nodes;
  const pageInfo = collection.products.pageInfo;

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f7f4ee'}}>
      {/* Header */}
      <PageHeader
        title={collection.title}
        description={collection.description}
      />

      {/* Sort Bar */}
      <SortBar sortKey={sortKey} reverse={reverse} />

      {/* Products Grid */}
      <div style={{maxWidth: 1400, margin: '0 auto', padding: '48px 24px'}}>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState />
        )}

        {/* Pagination */}
        <Pagination pageInfo={pageInfo} />
      </div>

      <Analytics.CollectionView
        data={{
          collection: {id: collection.id, handle: collection.handle},
        }}
      />
    </div>
  );
}

function PageHeader({title, description}: {title: string; description?: string | null}) {
  return (
    <div style={{maxWidth: 1400, margin: '0 auto', padding: '128px 24px 48px'}}>
      <p style={{
        fontFamily: 'Archivo, sans-serif',
        fontSize: 11,
        letterSpacing: '0.34em',
        textTransform: 'uppercase',
        color: '#a39c92',
        marginBottom: 16,
      }}>
        Collezione
      </p>
      <h1 style={{
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 400,
        fontSize: 'clamp(34px, 5vw, 56px)',
        lineHeight: 1.1,
        color: '#1a1815',
        margin: 0,
      }}>
        {title}
      </h1>
      {description && (
        <p style={{
          fontFamily: 'Archivo, sans-serif',
          fontSize: 15,
          lineHeight: 1.7,
          color: '#6b665d',
          marginTop: 16,
          maxWidth: 600,
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

function SortBar({sortKey, reverse}: {sortKey: string; reverse: boolean}) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [key, rev] = e.target.value.split('-');
    const params = new URLSearchParams(window.location.search);
    params.set('sort', key);
    params.set('reverse', rev);
    window.location.search = params.toString();
  };

  return (
    <div style={{
      borderTop: '1px solid #e5e2dc',
      borderBottom: '1px solid #e5e2dc',
      backgroundColor: '#f7f4ee',
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          fontFamily: 'Archivo, sans-serif',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#a39c92',
        }}>
          Ordina:
        </span>
        <select
          value={`${sortKey}-${reverse}`}
          onChange={handleSortChange}
          style={{
            fontFamily: 'Archivo, sans-serif',
            fontSize: 14,
            padding: '6px 12px',
            border: '1px solid #d4d0c8',
            borderRadius: 4,
            backgroundColor: 'transparent',
            color: '#1a1815',
            cursor: 'pointer',
          }}
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
  );
}

function ProductGrid({products}: {products: any[]}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 32,
    }}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          loading={index < 8 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

function ProductCard({product, loading}: {product: any; loading: 'eager' | 'lazy'}) {
  const image = product.featuredImage;

  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      style={{textDecoration: 'none', color: 'inherit'}}
    >
      <div style={{
        aspectRatio: '1',
        backgroundColor: '#eae7e1',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        {image && (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        )}
      </div>
      <h3 style={{
        fontFamily: 'Libre Baskerville, serif',
        fontWeight: 400,
        fontSize: 18,
        lineHeight: 1.2,
        color: '#1a1815',
        margin: '0 0 4px',
      }}>
        {product.title}
      </h3>
      {product.vendor && (
        <p style={{
          fontFamily: 'Archivo, sans-serif',
          fontSize: 12,
          color: '#a39c92',
          margin: '0 0 8px',
        }}>
          {product.vendor}
        </p>
      )}
      <p style={{
        fontFamily: 'Archivo, sans-serif',
        fontSize: 14,
        color: '#1a1815',
        margin: 0,
      }}>
        <Money data={product.priceRange.minVariantPrice} />
      </p>
    </Link>
  );
}

function EmptyState() {
  return (
    <div style={{padding: '80px 0', textAlign: 'center'}}>
      <p style={{
        fontFamily: 'Archivo, sans-serif',
        fontSize: 18,
        color: '#6b665d',
      }}>
        Nessun prodotto trovato.
      </p>
    </div>
  );
}

function Pagination({pageInfo}: {pageInfo: {hasPreviousPage: boolean; hasNextPage: boolean; startCursor?: string | null; endCursor?: string | null}}) {
  if (!pageInfo.hasPreviousPage && !pageInfo.hasNextPage) {
    return null;
  }

  const buttonStyle: React.CSSProperties = {
    fontFamily: 'Archivo, sans-serif',
    fontSize: 12,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    padding: '12px 24px',
    border: '1px solid #1a1815',
    borderRadius: 9999,
    backgroundColor: 'transparent',
    color: '#1a1815',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  const buildUrl = (direction: 'previous' | 'next') => {
    const params = new URLSearchParams(window.location.search);
    if (direction === 'previous' && pageInfo.startCursor) {
      params.set('direction', 'previous');
      params.set('cursor', pageInfo.startCursor);
    } else if (direction === 'next' && pageInfo.endCursor) {
      params.delete('direction');
      params.set('cursor', pageInfo.endCursor);
    }
    return `?${params.toString()}`;
  };

  return (
    <div style={{marginTop: 64, display: 'flex', justifyContent: 'center', gap: 16}}>
      {pageInfo.hasPreviousPage && (
        <Link to={buildUrl('previous')} style={buttonStyle}>
          ← Precedente
        </Link>
      )}
      {pageInfo.hasNextPage && (
        <Link to={buildUrl('next')} style={buttonStyle}>
          Successivo →
        </Link>
      )}
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionBorse(
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
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
        sortKey: $sortKey
        reverse: $reverse
      ) {
        nodes {
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
              amount
              currencyCode
            }
          }
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
