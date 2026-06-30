import type {Route} from './+types/vendi';

/**
 * Hero image. The bare Shopify file id (7944646492406) can't be resolved via
 * the Storefront API (it doesn't expose Content→Files), so we use the file's
 * CDN url directly — this is the current hero of the reference contact page.
 * Swap this url if a different image is wanted (cdn.shopify.com is CSP-allowed).
 */
const HERO_IMAGE_URL =
  'https://cdn.shopify.com/s/files/1/0615/4194/1494/files/DSC_0016.jpg?v=1639987571&width=1600';

export const WHATSAPP_SELL_URL =
  'https://api.whatsapp.com/send?phone=+393319689707&text=Buongiorno,%20sono%20interessato%20a%20vendere%20il%20mio%20orologio';

const CHECKLIST = [
  'Il codice seriale dell’orologio',
  'L’anno di acquisto',
  'Le condizioni generali',
  'Il corredo (scatola, garanzia, documenti)',
];

export const meta: Route.MetaFunction = () => {
  return [{title: 'Ruzza Orologi | Vendi il tuo orologio'}];
};

export default function Vendi() {
  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="max-w-[1400px] mx-auto px-[clamp(24px,6vw,96px)] pt-[clamp(110px,16vh,170px)] pb-[clamp(48px,9vh,110px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(32px,5vw,80px)] items-start">
          {/* Left: image (shown in full, not cropped) */}
          <div className="lg:sticky lg:top-[clamp(110px,15vh,150px)] w-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.8)] shadow-[0_4px_40px_rgba(0,0,0,0.08)]">
            <img
              src={HERO_IMAGE_URL}
              alt="Vendi il tuo orologio"
              className="block w-full h-auto"
            />
          </div>

          {/* Right: content */}
          <div className="flex flex-col py-2">
            <p className="font-archivo text-[11px] tracking-[0.34em] uppercase text-[#a39c92] mb-4">
              Valutazione gratuita
            </p>
            <h1 className="font-['Libre_Baskerville'] font-light text-[clamp(32px,4vw,56px)] leading-[1.1] text-[#1a1815] mb-6">
              Vendi il tuo orologio
            </h1>
            <p className="font-archivo text-[clamp(15px,1.4vw,18px)] leading-[1.7] text-[#5a564f] mb-8 max-w-[54ch]">
              Contattaci su WhatsApp per ottenere una valutazione gratuita e senza
              impegno del tuo orologio. Ti rispondiamo nel più breve tempo possibile.
            </p>

            <div className="rounded-2xl border border-[#e5e2dc] bg-white px-[clamp(20px,3vw,36px)] py-[clamp(22px,4vh,34px)] mb-9">
              <h2 className="font-['Libre_Baskerville'] font-normal text-[clamp(18px,1.6vw,22px)] text-[#1a1815] mb-5">
                Cosa indicare per una valutazione accurata
              </h2>
              <ul className="space-y-3 font-archivo text-[15px] leading-[1.6] text-[#5a564f]">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#b78a4a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={WHATSAPP_SELL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex self-start items-center justify-center gap-3 rounded-full bg-[#25D366] px-9 py-4 font-archivo font-semibold text-[14px] tracking-[0.06em] text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contattaci su WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
