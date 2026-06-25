import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

interface ProductImageProps {
  image: ProductVariantFragment['image'];
}

export function ProductImage({image}: ProductImageProps) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}
