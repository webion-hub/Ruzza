import {useLoaderData, Link} from 'react-router';
import {
  Hero,
  Collection,
} from '@ruzza/ui';
import type {Route} from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Ruzza Watch | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{products}] = await Promise.all([
    context.storefront.query(ALL_PRODUCTS_QUERY),
  ]);

  return {
    allProducts: products.nodes,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  // Transform Shopify products to Collection format (watch card style)
  const collectionItems = (data.allProducts || []).slice(0, 6).map((product: any) => {
    const price = product.priceRange?.minVariantPrice;
    const formattedPrice = price
      ? new Intl.NumberFormat('it-IT', {
          style: 'currency',
          currency: price.currencyCode || 'EUR',
        }).format(parseFloat(price.amount))
      : undefined;

    return {
      id: product.id,
      name: product.title,
      subtitle: product.productType ? `${product.productType} · prestigio` : 'Oro · prestigio',
      price: formattedPrice,
      imageSrc: product.featuredImage?.url || '/placeholder.jpg',
      imageAlt: product.featuredImage?.altText || product.title,
      href: `/products/${product.handle}`,
      badge: product.availableForSale !== false ? 'DISPONIBILE' : 'ESAURITO',
      available: product.availableForSale !== false,
    };
  });

  return (
    <div className="min-h-screen bg-[#0c0a08]">
      {/* Hero Section */}
      <Hero
        title="RUZZA"
        eyebrow="Watch Basic"
        tagline="DESIGN ESSENZIALE, CARATTERE DECISO."
        description="Stile contemporaneo e quadranti in pietra naturale. La collezione Basic porta l'estetica Ruzza al polso di tutti — senza compromessi sul carattere."
        showRule={true}
        scrollCueText=""
        titleFont="libre-baskerville"
        titleSize="xs"
        theme="dark"
      />

      {/* Collection Grid */}
      <div>
        <Collection
          eyebrow="Collezione"
          title="Trova il modello perfetto per te"
          description="Edizioni in pietra naturale. Ogni esemplare è unico — disponibilità limitata."
          items={collectionItems}
          titleFont="libre-baskerville"
          theme="dark"
          cardStyle="watch"
          showCta={false}
        />
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-[#0c0a08] text-[#f7f4ee] pt-16 sm:pt-32 lg:pt-48 pb-8 px-4 sm:px-[clamp(24px,5vw,80px)] scroll-mt-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
            {/* Brand Column */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-['Libre_Baskerville'] text-[clamp(28px,3vw,42px)] font-normal tracking-[0.02em] text-[#f7f4ee]">
                  RUZZA
                </h2>
                <p className="font-archivo text-[11px] tracking-[0.35em] uppercase text-[rgba(247,244,238,0.5)] mt-1">
                  WATCH
                </p>
              </div>
              <p className="font-archivo text-[13px] leading-[1.7] text-[rgba(247,244,238,0.7)] max-w-[280px]">
                Orologi con quadrante in pietra naturale.<br />
                Design essenziale, carattere deciso, stile contemporaneo — il talismano del benessere.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-archivo text-[11px] font-medium tracking-[0.25em] uppercase text-[rgba(247,244,238,0.5)]">
                NAVIGA
              </h3>
              <nav className="flex flex-col gap-2">
                <Link to="/collections/orologi" className="font-archivo text-[14px] text-[#f7f4ee] hover:text-[rgba(247,244,238,0.7)] transition-colors">
                  Collezione
                </Link>
                <Link to="/" className="font-archivo text-[14px] text-[#f7f4ee] hover:text-[rgba(247,244,238,0.7)] transition-colors">
                  Home
                </Link>
              </nav>
            </div>

            {/* Support Column */}
            <div className="flex flex-col gap-4">
              <h3 className="font-archivo text-[11px] font-medium tracking-[0.25em] uppercase text-[rgba(247,244,238,0.5)]">
                SUPPORTO
              </h3>
              <a
                href="mailto:support@ruzzawatch.com"
                className="inline-flex items-center gap-2.5 font-archivo text-[14px] text-[#f7f4ee] hover:text-[rgba(247,244,238,0.7)] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Contatta il supporto
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[rgba(247,244,238,0.12)] mb-6" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Company Info */}
            <div className="font-archivo text-[rgba(247,244,238,0.6)] leading-[1.6]">
              <p className="text-[12px]">Ruzza Watch Merchandising SRL — precedentemente Ruzza Luxury Bags SRL</p>
              <p className="text-[12px]">P. IVA IT12819540969 · Codice Fiscale 12819540969 · © 2026 Ruzza Watch</p>
            </div>

            {/* Legal Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {['Privacy', 'Recapiti', 'Rimborsi', 'Termini e condizioni', 'Spedizioni'].map((link) => (
                <Link
                  key={link}
                  to={`/pages/${link.toLowerCase().replace(/ /g, '-')}`}
                  className="font-archivo text-[11px] text-[rgba(247,244,238,0.6)] hover:text-[#f7f4ee] transition-colors"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    productType
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query AllProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;
