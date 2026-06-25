import {Await, Link, useLocation} from 'react-router';
import {Suspense, useId, useState, useEffect} from 'react';
import {Aside, useAside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {Header as RuzzaHeader} from '@ruzza/ui';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  const location = useLocation();
  const isHomepage = location.pathname === '/';

  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      {header && (
        <RuzzaHeaderWrapper
          header={header}
          cart={cart}
          isHomepage={isHomepage}
        />
      )}
      <main>{children}</main>
    </Aside.Provider>
  );
}

interface RuzzaHeaderWrapperProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isHomepage: boolean;
}

function RuzzaHeaderWrapper({header, cart, isHomepage}: RuzzaHeaderWrapperProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const {open: openAside} = useAside();

  useEffect(() => {
    if (!isHomepage) {
      setTheme('light');
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      setTheme(scrollY > vh * 0.5 ? 'dark' : 'light');
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  const links = [
    {label: 'Home', href: '/', isActive: true},
  ];

  const dropdowns = [
    {
      label: 'Orologi',
      items: [
        {label: 'Rolex', href: '/collections/rolex'},
        {label: 'Omega', href: '/collections/omega'},
        {label: 'Patek Philippe', href: '/collections/patek-philippe'},
        {label: 'Audemars Piguet', href: '/collections/audemars-piguet'},
        {label: 'Cartier', href: '/collections/cartier'},
        {label: 'Tutti gli orologi', href: '/collections/all', isViewAll: true},
      ],
    },
    {
      label: 'Luxury Bags',
      items: [
        {label: 'Hermes', href: '/collections/hermes'},
        {label: 'Chanel', href: '/collections/chanel'},
        {label: 'Louis Vuitton', href: '/collections/louis-vuitton'},
        {label: 'Gucci', href: '/collections/gucci'},
        {label: 'Prada', href: '/collections/prada'},
        {label: 'Tutte le borse', href: '/collections/borse', isViewAll: true},
      ],
    },
  ];

  return (
    <RuzzaHeader
      logoSrc="/assets/ruzza-logo.png"
      logoAlt="Ruzza Orologi"
      links={links}
      dropdowns={dropdowns}
      telegramHref="https://t.me/ruzzaorologi"
      telegramLabel="Canale Telegram"
      searchPlaceholder="Cerca nel catalogo..."
      cartAriaLabel="Carrello"
      searchAriaLabel="Cerca"
      onSearch={(query: string) => {
        if (query) {
          openAside('search');
        }
      }}
      onCartClick={() => openAside('cart')}
      theme={theme}
    />
  );
}

interface CartAsideProps {
  cart: Promise<CartApiQueryFragment | null>;
}

function CartAside({cart}: CartAsideProps) {
  return (
    <Aside type="cart" heading="CARRELLO">
      <Suspense fallback={<p>Caricamento carrello...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="CERCA">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Cerca orologi, marchi..."
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="w-full px-4 py-3 border border-[rgba(42,39,34,0.2)] rounded-lg font-archivo text-base outline-none focus:border-[#2a2722] transition-colors"
              />
              &nbsp;
              <button
                onClick={goToSearch}
                className="px-6 py-3 bg-[#2a2722] text-[#f4f1ea] font-archivo font-medium text-sm tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity"
              >
                Cerca
              </button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div className="py-4 text-center text-[#8c867d]">Caricamento...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="block py-4 text-center text-[#2a2722] font-archivo hover:underline"
                  >
                    Vedi tutti i risultati per <q>{term.current}</q> →
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}
