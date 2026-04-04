import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const idParam = req.nextUrl.searchParams.get("id");
    const productId = Number(idParam);

    if (!idParam || Number.isNaN(productId)) {
      return NextResponse.json(
        { ok: false, error: "ID prodotto non valido" },
        { status: 400 }
      );
    }

    const products = await sql`
      SELECT
        id,
        display_name,
        real_name,
        source_url,
        source_shop,
        price,
        image_url
      FROM products
      WHERE id = ${productId}
      LIMIT 1;
    `;

    if (products.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Prodotto non trovato" },
        { status: 404 }
      );
    }

    const product = products[0];

    const occasions = await sql`
      SELECT o.slug
      FROM product_occasions po
      JOIN occasions o ON o.id = po.occasion_id
      WHERE po.product_id = ${productId};
    `;

    const ages = await sql`
      SELECT a.slug
      FROM product_ages pa
      JOIN ages a ON a.id = pa.age_id
      WHERE pa.product_id = ${productId};
    `;

    const genders = await sql`
      SELECT g.slug
      FROM product_genders pg
      JOIN genders g ON g.id = pg.gender_id
      WHERE pg.product_id = ${productId};
    `;

    const relationships = await sql`
      SELECT r.slug
      FROM product_relationships pr
      JOIN relationships r ON r.id = pr.relationship_id
      WHERE pr.product_id = ${productId};
    `;

    const personalities = await sql`
      SELECT p.slug
      FROM product_personalities pp
      JOIN personalities p ON p.id = pp.personality_id
      WHERE pp.product_id = ${productId};
    `;

    const categories = await sql`
      SELECT c.slug
      FROM product_categories pc
      JOIN categories c ON c.id = pc.category_id
      WHERE pc.product_id = ${productId};
    `;

    return NextResponse.json({
      ok: true,
      product: {
        id: product.id,
        displayName: product.display_name,
        realName: product.real_name,
        sourceUrl: product.source_url,
        sourceShop: product.source_shop,
        price: product.price,
        imageUrl: product.image_url,
        occasions: occasions.map((x) => x.slug),
        ages: ages.map((x) => x.slug),
        genders: genders.map((x) => x.slug),
        relationships: relationships.map((x) => x.slug),
        personalities: personalities.map((x) => x.slug),
        categories: categories.map((x) => x.slug),
      },
    });
  } catch (error) {
    console.error("ERRORE DEBUG PRODUCT:", error);
    return NextResponse.json(
      { ok: false, error: "Errore interno debug" },
      { status: 500 }
    );
  }
}