import {Await, useLocation} from 'react-router';
import {Suspense} from 'react';
import {Aside, useAside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {Header as RuzzaHeader} from '@ruzza/ui';
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
  const {open: openAside} = useAside();
  const {pathname} = useLocation();
  const isWatches = pathname.startsWith('/collections/orologi');
  const isContatti = pathname.startsWith('/pages/contatti');

  const links = [
    {label: 'Collezione', href: '/collections/orologi', isActive: isWatches},
    {label: 'Contatti', href: '#footer', isActive: false},
  ];

  return (
    <RuzzaHeader
      logoText="RUZZA WATCH"
      logoAlt="Ruzza Watch"
      links={links}
      dropdowns={[]}
      trailingLinks={[]}
      hideTelegram={true}
      hideSearch={true}
      cartAriaLabel="Carrello"
      cartText="CARRELLO"
      cartCount={0}
      onCartClick={() => openAside('cart')}
      theme="dark"
      variant="wide"
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

