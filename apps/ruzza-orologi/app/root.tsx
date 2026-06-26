import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  useRouteLoaderData,
} from 'react-router';
import type {ShouldRevalidateFunction} from 'react-router';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindStyles from '~/styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import type {Route} from './+types/root';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return false;
};

export function links() {
  return [
    // Preconnect to Google Fonts for faster font loading
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    // Preload Google Fonts CSS to prevent FOUC
    {
      rel: 'preload',
      as: 'style',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Libre+Baskerville:wght@400;700&display=swap',
    },
    // Load Google Fonts CSS
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Libre+Baskerville:wght@400;700&display=swap',
    },
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu',
      },
    }),
  ]);

  return {header};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer',
      },
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({children}: LayoutProps) {
  const nonce = useNonce();

  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `if(history.scrollRestoration)history.scrollRestoration='manual';window.scrollTo(0,0);`,
          }}
        />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={tailwindStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<typeof loader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
