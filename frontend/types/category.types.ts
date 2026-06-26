/**
 * Interface representing a competition category.
 */
export interface Category {
  id: string;
  title: string;
  slug: string;
  image?: string;
  drawCount: number;
}
