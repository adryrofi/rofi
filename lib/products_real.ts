import "server-only";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: number;
  display_name: string;
  price: number | string | null;
  source_url: string | null;
  image_url: string | null;
  source_shop: string | null;
};

type SlugRow = {
  product_id: number;
  slug: string;
};

export async function loadProducts() {
  const products = await sql<ProductRow[]>`
    SELECT
      id,
      display_name,
      price,
      source_url,
      image_url,
      source_shop
    FROM products
    ORDER BY id DESC;
  `;

  const occasions = await sql<SlugRow[]>`
    SELECT po.product_id, o.slug
    FROM product_occasions po
    JOIN occasions o ON o.id = po.occasion_id;
  `;

  const relationships = await sql<SlugRow[]>`
    SELECT pr.product_id, r.slug
    FROM product_relationships pr
    JOIN relationships r ON r.id = pr.relationship_id;
  `;

  const ages = await sql<SlugRow[]>`
    SELECT pa.product_id, a.slug
    FROM product_ages pa
    JOIN ages a ON a.id = pa.age_id;
  `;

  const personalities = await sql<SlugRow[]>`
    SELECT pp.product_id, p.slug
    FROM product_personalities pp
    JOIN personalities p ON p.id = pp.personality_id;
  `;

  const genders = await sql<SlugRow[]>`
    SELECT pg.product_id, g.slug
    FROM product_genders pg
    JOIN genders g ON g.id = pg.gender_id;
  `;

  const categories = await sql<SlugRow[]>`
    SELECT pc.product_id, c.slug
    FROM product_categories pc
    JOIN categories c ON c.id = pc.category_id;
  `;

  return products.map((product) => {
    const productOccasions = occasions
      .filter((x) => x.product_id === product.id)
      .map((x) => x.slug);

    const productRelationships = relationships
      .filter((x) => x.product_id === product.id)
      .map((x) => x.slug);

    const productAges = ages
      .filter((x) => x.product_id === product.id)
      .map((x) => x.slug);

    const productPersonalities = personalities
      .filter((x) => x.product_id === product.id)
      .map((x) => x.slug);

    const productGenders = genders
      .filter((x) => x.product_id === product.id)
      .map((x) => x.slug);

    const productCategories = categories
      .filter((x) => x.product_id === product.id)
      .map((x) => x.slug);

    return {
  id: product.id,
  name: product.display_name,
  price: Number(product.price || 0),
  link: product.source_url || "",
  image: product.image_url || null,
  sourceShop: product.source_shop || "",

  occasion: productOccasions,
  relationship: productRelationships,
  age: productAges,
  personality: productPersonalities,
  gender: productGenders,
  category: productCategories,
};
  });
}