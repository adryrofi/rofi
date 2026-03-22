import sql from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`
  INSERT INTO products (
    name,
    price,
    link,
    category,
    occasion,
    relationship,
    age,
    personality,
    gender
  )
  VALUES (
    'Regalo test',
    25,
    'https://amazon.it/test',
    'tech',
    'compleanno',
    'amico',
    '25-30',
    ARRAY['divertente'],
    'unisex'
  )
  RETURNING *;
`;

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error),
    });
  }
}