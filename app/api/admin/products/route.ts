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
      occasions = [],
      ages = [],
      genders = [],
      relationships = [],
      personalities = [],
      categories = [],
    } = body;

    // Estrazione ASIN da link Amazon
    let asin = null;

    if (sourceUrl && sourceUrl.includes("amazon")) {
      const match = sourceUrl.match(/\/dp\/([A-Z0-9]{10})/);

      if (match && match[1]) {
        asin = match[1];
      }
    }

    // Generazione link affiliato pulito
    let cleanAffiliateUrl = sourceUrl;

    if (asin) {
      cleanAffiliateUrl = `https://www.amazon.it/dp/${asin}/?tag=rofi21-21`;
    }

    console.log("AGES DAL FRONTEND:", ages);
    console.log("PERSONALITIES DAL FRONTEND:", personalities);
    console.log("CATEGORIES DAL FRONTEND:", categories);

    const allPersonalities = await sql`
      SELECT id, slug FROM personalities
    `;
    console.log("PERSONALITIES DB:", allPersonalities);

    const result = await sql`
      INSERT INTO products (
        display_name,
        real_name,
        source_url,
        source_shop,
        price,
        image_url
      ) VALUES (
        ${displayName},
        ${realName},
        ${cleanAffiliateUrl},
        ${sourceShop || (asin ? "amazon" : null)},
        ${price},
        ${imageUrl}
      )
      RETURNING id;
    `;

    const productId = result[0].id;

    const debug = {
      displayName: !!displayName,
      realName: !!realName,
      sourceUrl: !!cleanAffiliateUrl,
      sourceShop: !!(sourceShop || (asin ? "amazon" : null)),
      price: price !== null && price !== undefined,
      imageUrl: !!imageUrl,
      occasionsRequested: occasions.length,
      occasionsSaved: 0,
      agesRequested: ages.length,
      agesSaved: 0,
      gendersRequested: genders.length,
      gendersSaved: 0,
      relationshipsRequested: relationships.length,
      relationshipsSaved: 0,
      personalitiesRequested: personalities.length,
      personalitiesSaved: 0,
      categoriesRequested: categories.length,
      categoriesSaved: 0,
    };

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
        debug.occasionsSaved++;
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
        debug.agesSaved++;
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
        debug.gendersSaved++;
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
        debug.relationshipsSaved++;
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
        debug.personalitiesSaved++;
      }
    }

    for (const slug of categories) {
      const category = await sql`
        SELECT id FROM categories
        WHERE slug = ${slug}
        LIMIT 1;
      `;

      if (category.length > 0) {
        await sql`
          INSERT INTO product_categories (product_id, category_id)
          VALUES (${productId}, ${category[0].id});
        `;
        debug.categoriesSaved++;
      }
    }

    return Response.json({ ok: true, productId, debug });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "Errore salvataggio" });
  }
}