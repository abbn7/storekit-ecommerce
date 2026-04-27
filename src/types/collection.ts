import { ProductMinimal } from "./product";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CollectionWithProducts extends Collection {
  products: ProductMinimal[];
}
