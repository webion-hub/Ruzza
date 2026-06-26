/**
 * Brands (watches and bags) are modelled in Shopify as standalone collections —
 * the product `vendor` field is the shop name for every item, so it can't drive
 * a brand filter. Each entry maps a clean URL slug + display label to its
 * Shopify collection id, and a collection is shown filtered to that brand via
 * `?brand=<slug>` on the watches/bags pages.
 *
 * Availability counts are fetched in a single aliased query (no product-count
 * field exists in the Storefront API); one query with N aliases returns every
 * brand's products in one round trip.
 */

export interface Brand {
  slug: string;
  label: string;
  id: string;
}

export const WATCH_BRANDS: Brand[] = [
  {slug: 'rolex', label: 'Rolex', id: '387924394230'},
  {slug: 'audemars-piguet', label: 'Audemars Piguet', id: '387924525302'},
  {slug: 'patek-philippe', label: 'Patek Philippe', id: '387924295926'},
  {slug: 'omega', label: 'Omega', id: '387925278966'},
  {slug: 'montblanc', label: 'Montblanc', id: '387925246198'},
  {slug: 'jaeger-lecoultre', label: 'Jaeger-LeCoultre', id: '387925180662'},
  {slug: 'jacob-co', label: 'Jacob & Co', id: '387925147894'},
  {slug: 'iwc', label: 'IWC', id: '387925115126'},
  {slug: 'hublot', label: 'Hublot', id: '387925082358'},
  {slug: 'heuer', label: 'Heuer', id: '387925049590'},
  {slug: 'gerald-genta', label: 'Gérald Genta', id: '387924951286'},
  {slug: 'gaga-milano', label: 'Gagà Milano', id: '387924918518'},
  {slug: 'franck-muller', label: 'Franck Muller', id: '387924885750'},
  {slug: 'ferrari', label: 'Ferrari', id: '387924852982'},
  {slug: 'eberhard-co', label: 'Eberhard & Co', id: '387924820214'},
  {slug: 'dolce-gabbana', label: 'Dolce & Gabbana', id: '387924787446'},
  {slug: 'chopard', label: 'Chopard', id: '387924721910'},
  {slug: 'casio', label: 'Casio', id: '387924656374'},
  {slug: 'cartier', label: 'Cartier', id: '387924623606'},
  {slug: 'bulgari', label: 'Bulgari', id: '387924590838'},
  {slug: 'breitling', label: 'Breitling', id: '387924558070'},
  {slug: 'zenith', label: 'Zenith', id: '387924492534'},
  {slug: 'tudor', label: 'Tudor', id: '387924459766'},
  {slug: 'tag-heuer', label: 'Tag Heuer', id: '387924426998'},
  {slug: 'richard-mille', label: 'Richard Mille', id: '387924361462'},
  {slug: 'panerai', label: 'Panerai', id: '387924263158'},
];

export const BAG_BRANDS: Brand[] = [
  {slug: 'hermes', label: 'Hermes', id: '387924132086'},
  {slug: 'chanel', label: 'Chanel', id: '387924066550'},
  {slug: 'louis-vuitton', label: 'Louis Vuitton', id: '387924164854'},
  {slug: 'gucci', label: 'Gucci', id: '387924099318'},
  {slug: 'prada', label: 'Prada', id: '387924328694'},
  {slug: 'dior', label: 'Dior', id: '387924754678'},
];

export function getBrand(brands: Brand[], slug: string | null): Brand | null {
  if (!slug) return null;
  return brands.find((b) => b.slug === slug) ?? null;
}

// Cap kept well above the largest brand; `hasNextPage` flags the rare overflow.
const COUNT_PAGE_SIZE = 250;

/**
 * Build a single query that counts products in every brand collection at once.
 * Built dynamically, so it intentionally omits the `#graphql` codegen marker.
 */
export function brandCountsQuery(brands: Brand[]): string {
  return `
    query BrandCounts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
      ${brands
        .map(
          (b, i) => `b${i}: collection(id: "gid://shopify/Collection/${b.id}") {
            products(first: ${COUNT_PAGE_SIZE}) {
              nodes { id }
              pageInfo { hasNextPage }
            }
          }`,
        )
        .join('\n')}
    }
  `;
}

export const WATCH_BRAND_COUNTS_QUERY = brandCountsQuery(WATCH_BRANDS);
export const BAG_BRAND_COUNTS_QUERY = brandCountsQuery(BAG_BRANDS);

export interface BrandCount {
  slug: string;
  label: string;
  count: number;
  capped: boolean;
}

/**
 * Turn the aliased counts response into a display list: only brands that
 * currently have products, ordered by availability (most first).
 */
export function parseBrandCounts(
  brands: Brand[],
  data: Record<string, any> | null,
): BrandCount[] {
  if (!data) return [];
  return brands
    .map((b, i) => {
      const node = data[`b${i}`];
      const nodes = node?.products?.nodes ?? [];
      return {
        slug: b.slug,
        label: b.label,
        count: nodes.length,
        capped: Boolean(node?.products?.pageInfo?.hasNextPage),
      };
    })
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'it'));
}
