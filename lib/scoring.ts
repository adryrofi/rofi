import { loadProducts } from "./products_real";

function getMinAgeFromCategory(category: string) {
  if (!category) return 0;

  const cat = category.toLowerCase();

  if (cat.includes("bambini") || cat.includes("giochi")) return 0;
  if (cat.includes("tech")) return 12;
  if (cat.includes("fumo") || cat.includes("alcol")) return 18;

  return 0;
}

function isValidProduct(product: any, answers: any) {
  const ageValue = answers.age || "";
  const userAge = ageValue === "25+" ? 25 : parseInt(ageValue.split("-")[0] || "0");

  const minAge =
    parseInt(product.MinAge || "0") ||
    getMinAgeFromCategory(product.category);

  if (userAge < minAge) {
    return false;
  }

  if (product.age && ageValue) {
    if (ageValue === "25+") {
      if (product.age === "0-12" || product.age === "13-18" || product.age === "18-25") {
        return false;
      }
    } else if (product.age !== ageValue) {
      return false;
    }
  }

  return true;
}

type Answers = {
  occasion?: string;
  relationship?: string;
  age?: string;
  personality?: string;
  gender?: string;
  budget?: string;
};

export function getTopProducts(answers: Answers = {}) {
  
  const products = loadProducts().filter((product) =>
  isValidProduct(product, answers)
);

console.log("RISPOSTE UTENTE", answers);
console.log("PRODOTTI DOPO isValidProduct", products.length);
console.log("PRIMO MATCH DOPO isValidProduct", products.find(p => p.age === "50+"));

  const scored = products
  .map((product) => {
    let score = 0;
    const price = Number(product.price || 0);

    if (answers.budget === "1-20" && (price < 1 || price > 20)) return null;
    if (answers.budget === "20-30" && (price <= 20 || price > 30)) return null;
    if (answers.budget === "30-50" && (price <= 30 || price > 50)) return null;
    if (answers.budget === "50-100" && (price <= 50 || price > 100)) return null;
    if (answers.budget === "100+" && price <= 100) return null;

    if (product.occasion === answers.occasion) {
  score += 3;
} else {
  return null;
}

if (product.relationship === answers.relationship) {
  score += 3;
} else {
  return null;
}

    if (answers.age === "25+") {
  if (product.age === "26-35" || product.age === "36-50" || product.age === "50+") {
    score += 5;
  } else {
    score -= 3;
  }
} else if (product.age === answers.age) {
  score += 5;
} else {
  score -= 3;
}

    if (answers.personality && answers.personality !== "Neutra") {
  if (product.personality.includes(answers.personality)) {
    score += 2;
  } else {
    return null;
  }
}

    if (answers.gender && product.gender) {
  if (answers.gender === "Unisex") {
    if (product.gender !== "Unisex") {
      return null;
    }
  } else {
    if (product.gender === answers.gender) {
      score += 3;
    } else {
      return null;
    }
  }
}

    if (
      product.occasion === answers.occasion &&
      product.relationship === answers.relationship &&
      product.age === answers.age
    ) {
      score += 5;
    }

    return {
      ...product,
      score,
    };
  })
  .filter((product): product is NonNullable<typeof product> => product !== null);

  scored.sort((a, b) => {
  // 1. PRIORITÀ: score
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  // 2. PRIORITÀ: prezzo (più basso prima)
  if (a.price !== b.price) {
    return a.price - b.price;
  }

  // 3. PRIORITÀ: ordine alfabetico
  return a.name.localeCompare(b.name);
});

  const selected: any[] = [];
const usedCategories = new Set<string>();

// primo passaggio: privilegia categorie diverse
for (const product of scored) {
  if (selected.length >= 5) break;

  const categoryKey = (product.category || "").trim().toLowerCase();

  if (usedCategories.has(categoryKey)) continue;

  selected.push(product);
  usedCategories.add(categoryKey);
}

// secondo passaggio: se sono pochi, aggiungi anche categorie già usate
for (const product of scored) {
  if (selected.length >= 5) break;

  const alreadySelected = selected.some((p) => p.link === product.link);
  if (alreadySelected) continue;

  selected.push(product);
}

// fallback: se non arriviamo a 5, riempiamo comunque
while (selected.length < 5) {
  selected.push({
    name: "Rofi sta cercando...",
    isPlaceholder: true,
  });
}

const top5 = selected;

  return top5;
}