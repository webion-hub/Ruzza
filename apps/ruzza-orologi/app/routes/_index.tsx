import {Await, useLoaderData} from 'react-router';
import {Suspense, useRef} from 'react';
import {
  Hero,
  MarbleBackground,
  Collection,
  NewArrivals,
  Discover,
  AboutMe,
  Newsletter,
  Footer,
  FooterContact,
  FooterStore,
  FooterSocial,
} from '@ruzza/ui';
import {ContactButton} from '~/components/ContactButton';
import type {Route} from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Ruzza Orologi | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}, {products}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(ALL_PRODUCTS_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    allProducts: products.nodes,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const shopRef = useRef<HTMLDivElement>(null);

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  // Transform Shopify products to Collection format
  const collectionItems = (data.allProducts || []).slice(0, 6).map((product: any, index: number) => ({
    id: product.id,
    number: String(index + 1).padStart(3, '0'),
    name: product.title,
    category: product.productType || 'Orologio di lusso',
    imageSrc: product.featuredImage?.url || '/placeholder.jpg',
    imageAlt: product.featuredImage?.altText || product.title,
    href: `/products/${product.handle}`,
    tileColor: '#f3f1ec',
  }));

  // Transform for NewArrivals carousel
  const carouselItems = (data.allProducts || []).slice(0, 5).map((product: any, index: number) => ({
    id: product.id,
    index: String(index + 1).padStart(2, '0'),
    total: '05',
    name: product.title.split(' ')[0],
    tag: product.productType || 'Orologio di lusso',
    imageSrc: product.featuredImage?.url || '/placeholder.jpg',
    imageAlt: product.featuredImage?.altText || product.title,
    href: `/products/${product.handle}`,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Marble zone — the marble shows ONLY behind the hero + collection, stays
          fixed to the viewport, and never bleeds past this section. */}
      <div className="relative">
        <MarbleBackground imageSrc="/assets/marble-bg-4k.png" />

      {/* Hero Section */}
      <Hero
        title="RUZZA"
        eyebrow="Orologi"
        showRule={true}
        scrollCueText="Nuovi arrivi"
        scrollCueAriaLabel="Scopri i nuovi arrivi"
        onScrollCueClick={scrollToShop}
        titleFont="libre-baskerville"
        theme="light"
      />

      {/* Collection Grid */}
      <div ref={shopRef}>
        <Collection
          eyebrow="Collezione"
          title="Tutti i modelli"
          ctaLabel="Visualizza tutto"
          ctaHref="/collections/orologi"
          items={collectionItems}
          titleFont="libre-baskerville"
          theme="dark"
        />
      </div>
      </div>

      {/* New Arrivals Carousel */}
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Await resolve={data.recommendedProducts}>
          {(response: any) => {
            const items = response?.products?.nodes?.slice(0, 5).map((product: any, index: number) => ({
              id: product.id,
              index: String(index + 1).padStart(2, '0'),
              total: '05',
              name: product.title.split(' ')[0],
              tag: product.productType || 'Edizione speciale',
              imageSrc: product.featuredImage?.url || '/placeholder.jpg',
              imageAlt: product.featuredImage?.altText || product.title,
              href: `/products/${product.handle}`,
            })) || carouselItems;

            return (
              <NewArrivals
                eyebrow="Nuovi arrivi"
                eyebrowBadge="edizione marmo"
                title="Appena usciti"
                subtitle="La nuova selezione Ruzza Milano: pezzi unici e certificati. Il talismano del tempo, in cinque nuove anime."
                ctaLabel="VEDI TUTTI I MODELLI"
                ctaHref="/collections/orologi"
                items={items}
                discoverLabel="Discover"
                titleFont="libre-baskerville"
                theme="light"
                className="bg-white"
              />
            );
          }}
        </Await>
      </Suspense>

      {/* Discover Section */}
      <Discover
        eyebrow="Discover"
        title="Scopri tutti i prodotti Ruzza,"
        titleHighlight="non solo orologi"
        tabs={[
          {id: 'bags', label: 'Borse di lusso', href: '/collections/borse', isActive: false},
          {id: 'watches', label: 'I nostri orologi', href: '/collections/orologi', isActive: true},
          {id: 'perfumes', label: 'Profumi', href: '/collections/profumi', isActive: false},
        ]}
        theme="light"
        className="bg-white py-24"
      />

      {/* About Me Section */}
      <AboutMe
        eyebrow="Chi sono"
        title="Chi<br />Sono"
        body="Lorenzo non è sempre stato così. Non tutti sanno che l'avventura nel mondo del lavoro di Lorenzo Ruzza è iniziata con un impiego da fattorino, prima per la consegna di pizze e poi di materassi. Nel suo passato ha svolto numerosi lavori tra cui pizzaiolo, lavagista di auto e webmaster. Solo nel 2017 apre Ruzza Orologi, il negozio al centro di Milano che in poco tempo lo porterà a fatturare oltre 20 milioni l'anno e a diventare il punto di riferimento nel mercato degli orologi di lusso."
        imageSrc="/assets/ruzza-lorenzo.png"
        imageAlt="Lorenzo Ruzza"
        titleFont="cormorant"
      />

      {/* Footer with Newsletter */}
      <Footer
        columns={[
          {
            title: 'CONTATTI',
            content: (
              <FooterContact
                phone="+39 331 9689707"
                phoneLabel="Telefono"
                email="labottegadeltempo@yahoo.com"
                emailLabel="Email"
              />
            ),
          },
          {
            title: 'STORE',
            content: (
              <FooterStore
                hours="Lun - Ven: 9:00 - 12:30 | 14:30 - 18:00"
                address={`Ruzza Orologi SRL\nVia Cesare Battisti 8\n20122 Milano, Italy`}
              />
            ),
          },
          {
            title: 'SEGUICI',
            content: (
              <FooterSocial
                links={[
                  {label: 'Instagram', href: 'https://instagram.com/ruzzaorologi'},
                  {label: 'Facebook', href: 'https://facebook.com/ruzzaorologi'},
                  {label: 'Telegram', href: 'https://t.me/ruzzaorologi'},
                ]}
              />
            ),
          },
        ]}
        copyrightText="2026 Ruzza Orologi, all rights reserved"
        legalLinks={[
          {label: 'Privacy Policy', href: '/pages/privacy'},
          {label: 'Cookie Policy', href: '/pages/cookies'},
        ]}
        wordmark="RUZZA"
        wordmarkFont="libre-baskerville"
      >
        <Newsletter
          title="Entra nel nostro mondo"
          subtitle="Registrati per restare aggiornato sulle ultime uscite. Non perderti nessun drop."
          emailLabel="La tua email"
          privacyLabel="Accetto di ricevere contenuti esclusivi e accetto l'"
          privacyLinkText="informativa sulla privacy"
          privacyLinkHref="/pages/privacy"
          submitLabel="Registrati"
          onSubmit={(email: string, accepted: boolean) => {
            console.log('Newsletter signup:', email, accepted);
          }}
        />
      </Footer>

      {/* Contact Button */}
      <ContactButton />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const ALL_PRODUCTS_QUERY = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    productType
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

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    productType
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
