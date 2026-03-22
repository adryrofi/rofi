import "server-only";
import fs from "node:fs";
import path from "path";

export const dynamic = "force-dynamic";

export function loadProducts() {
  const filePath = path.join(process.cwd(), "data", "rofi_products.csv");
  const file = fs.readFileSync(filePath, "utf8");

  const lines = file
    .split("\n")
    .slice(1)
    .filter((line) => line.trim() !== "");

  const products = lines.map((line) => {
    const [
      name,
      price,
      link,
      occasion,
      relationship,
      age,
      personality,
      gender,
      budget,
      category,
      image,
    ] = line.split(";");

    return {
      name,
      price: Number(price?.replace(",", ".")),
      link,
      image: image || null,
      occasion,
      relationship,
      age,
      personality: personality ? personality.split(",") : [],
      gender,
      budget,
      category,
    };
  });

  return products;
}