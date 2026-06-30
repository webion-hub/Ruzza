/**
 * WhatsApp "click to chat" helpers. A single business number plus a builder for
 * the prefilled-message URL. When a product is passed, the message references
 * that specific product (title + absolute URL); otherwise a generic greeting is
 * used (e.g. the floating contact button on the homepage).
 */

export const WHATSAPP_PHONE = '+393319689707';

export function whatsappHref(product?: {title: string; url: string}): string {
  const message = product
    ? `Buongiorno, sono interessato a questo prodotto: ${product.title}   ${product.url}`
    : 'Buongiorno, vorrei avere maggiori informazioni sui vostri prodotti.';

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(
    message,
  )}`;
}
