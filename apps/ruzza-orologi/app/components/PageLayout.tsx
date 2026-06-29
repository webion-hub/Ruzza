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
  const [searchOpen, setSearchOpen] = useState(false);
  const {open: openAside} = useAside();
  const {pathname} = useLocation();
  const isWatches = pathname.startsWith('/collections/orologi');
  const isBags = pathname.startsWith('/collections/borse');
  const isSell = pathname.startsWith('/vendi');

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
    {label: 'Home', href: '/', isActive: isHomepage},
  ];

  // Rendered to the right of the dropdowns (after Luxury Bags).
  const trailingLinks = [
    {label: 'Vendi il tuo orologio', href: '/vendi', isActive: isSell},
  ];

  const dropdowns = [
    {
      label: 'Orologi',
      isActive: isWatches,
      items: [
        {label: 'Rolex', href: '/collections/orologi?brand=rolex'},
        {label: 'Omega', href: '/collections/orologi?brand=omega'},
        {label: 'Patek Philippe', href: '/collections/orologi?brand=patek-philippe'},
        {label: 'Audemars Piguet', href: '/collections/orologi?brand=audemars-piguet'},
        {label: 'Cartier', href: '/collections/orologi?brand=cartier'},
        {label: 'Tutti gli orologi', href: '/collections/orologi', isViewAll: true},
      ],
    },
    {
      label: 'Luxury Bags',
      isActive: isBags,
      items: [
        {label: 'Hermes', href: '/collections/borse?brand=hermes'},
        {label: 'Chanel', href: '/collections/borse?brand=chanel'},
        {label: 'Louis Vuitton', href: '/collections/borse?brand=louis-vuitton'},
        {label: 'Gucci', href: '/collections/borse?brand=gucci'},
        {label: 'Prada', href: '/collections/borse?brand=prada'},
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
      trailingLinks={trailingLinks}
      telegramHref="https://t.me/ruzzaorologi"
      telegramLabel="Canale Telegram"
      cartAriaLabel="Carrello"
      searchAriaLabel="Cerca"
      searchOpen={searchOpen}
      onSearchOpenChange={setSearchOpen}
      searchPanel={<HeaderSearchPanel onNavigate={() => setSearchOpen(false)} />}
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

function HeaderSearchPanel({onNavigate}: {onNavigate: () => void}) {
  const queriesDatalistId = useId();
  return (
    <div
      className="text-[#1a1815]"
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('a')) onNavigate();
      }}
    >
      <div className="flex flex-col gap-2">
        <SearchFormPredictive className="w-full max-w-none flex items-center gap-2">
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                autoFocus
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Cerca orologi, marchi…"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="flex-1 min-w-0 bg-[#f7f4ee] px-4 py-2.5 border border-[#d4d0c8] rounded-full font-archivo text-[15px] text-[#1a1815] outline-none focus:border-[#a39c92] transition-colors"
              />
              <button
                onClick={() => {
                  goToSearch();
                  onNavigate();
                }}
                className="flex-shrink-0 px-5 py-2.5 bg-[#1a1815] text-[#f7f4ee] font-archivo font-medium text-xs tracking-[0.1em] uppercase rounded-full hover:opacity-90 transition-opacity"
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
    </div>
  );
}
