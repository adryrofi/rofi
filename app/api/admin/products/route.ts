import { NextRequest } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      displayName,
      realName,
      sourceUrl,
      sourceShop,
      price,
      imageUrl,
      minAge,
      occasions = [],
      ages = [],
      genders = [],
      relationships = [],
      personalities = [],
      categories = [],
    } = body;

    const result = await sql`
      INSERT INTO products (
        display_name,
        real_name,
        source_url,
        source_shop,
        price,
        image_url,
        min_age
      ) VALUES (
        ${displayName},
        ${realName},
        ${sourceUrl},
        ${sourceShop},
        ${price},
        ${imageUrl},
        ${minAge}
      )
      RETURNING id;
    `;

    const productId = result[0].id;

    for (const slug of occasions) {
      const occasion = await sql`
        SELECT id FROM occasions
        WHERE slug = ${slug}
        LIMIT 1;
      `;

      if (occasion.length > 0) {
        await sql`
          INSERT INTO product_occasions (product_id, occasion_id)
          VALUES (${productId}, ${occasion[0].id});
        `;
      }
    }

    for (const slug of ages) {
      const age = await sql`
        SELECT id FROM ages
        WHERE slug = ${slug}
        LIMIT 1;
      `;

      if (age.length > 0) {
        await sql`
          INSERT INTO product_ages (product_id, age_id)
          VALUES (${productId}, ${age[0].id});
        `;
      }
    }

    for (const slug of genders) {
      const gender = await sql`
        SELECT id FROM genders
        WHERE slug = ${slug}
        LIMIT 1;
      `;

      if (gender.length > 0) {
        await sql`
          INSERT INTO product_genders (product_id, gender_id)
          VALUES (${productId}, ${gender[0].id});
        `;
      }
    }

    for (const slug of relationships) {
  const relationship = await sql`
    SELECT id FROM relationships
    WHERE slug = ${slug}
    LIMIT 1;
  `;

  if (relationship.length > 0) {
    await sql`
      INSERT INTO product_relationships (product_id, relationship_id)
      VALUES (${productId}, ${relationship[0].id});
    `;
  }
}
    for (const slug of personalities) {
  const personality = await sql`
    SELECT id FROM personalities
    WHERE slug = ${slug}
    LIMIT 1;
  `;

  if (personality.length > 0) {
    await sql`
      INSERT INTO product_personalities (product_id, personality_id)
      VALUES (${productId}, ${personality[0].id});
    `;
  }
}

    
    return Response.json({ ok: true, productId });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "Errore salvataggio" });
  }
}