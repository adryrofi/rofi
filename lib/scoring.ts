import { loadProducts } from "./products_real";

function hasMatch(values: string[] | string | undefined, target: string) {
  if (!values || !target) return false;
  if (Array.isArray(values)) return values.includes(target);
  return values === target;
}

function getFirstValue(values: string[] | string | undefined) {
  if (!values) return "";
  if (Array.isArray(values)) return values[0] || "";
  return values;
}

function isValidProduct(product: any, answers: any) {
  const ageValue = answers.age || "";

  if (product.age && ageValue) {
    if (!hasMatch(product.age, ageValue)) {
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
  page?: number;
};

function normalizeAnswer(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();

  const map: Record<string, string> = {
    Compleanno: "compleanno",
    Natale: "natale",
    Anniversario: "anniversario",
    "Regalo aziendale": "regalo-aziendale",

    Partner: "partner",
    Familiare: "familiare",
    Amico: "amico",
    "Dipendente/i": "dipendente/i",

    Maschile: "maschio",
    Femminile: "femmina",
    Unisex: "unisex",

    Creativa: "creativa",
    Emotiva: "emotiva",
    Pratica: "pratica",
  };

  return map[trimmed] || trimmed.toLowerCase();
}

function pushUniqueByCategory(source: any[], target: any[], limit: number) {
  const usedCategories = new Set(
    target
      .map((product) => getFirstValue(product.category).trim().toLowerCase())
      .filter(Boolean),
  );

  for (const product of source) {
    if (target.length >= limit) break;

    const alreadySelected = target.some((p) => p.link === product.link);
    if (alreadySelected) continue;

    const categoryKey = getFirstValue(product.category).trim().toLowerCase();

    if (categoryKey && usedCategories.has(categoryKey)) continue;

    target.push(product);

    if (categoryKey) {
      usedCategories.add(categoryKey);
    }
  }
}

function pushUnique(source: any[], target: any[], limit: number) {
  for (const product of source) {
    if (target.length >= limit) break;

    const alreadySelected = target.some((p) => p.link === product.link);
    if (alreadySelected) continue;

    target.push(product);
  }
}

export async function getTopProducts(answers: Answers = {}) {
  const page = Number(answers.page || 1);
  const normalizedAnswers = {
    occasion: normalizeAnswer(answers.occasion),
    relationship: normalizeAnswer(answers.relationship),
    age: normalizeAnswer(answers.age),
    personality: normalizeAnswer(answers.personality),
    gender: normalizeAnswer(answers.gender),
    budget: answers.budget,
  };

  const allProducts = await loadProducts();

  const products = allProducts.filter((product) =>
    isValidProduct(product, normalizedAnswers),
  );

  console.log("RISPOSTE UTENTE", answers);
  console.log("RISPOSTE NORMALIZZATE", normalizedAnswers);
  console.log("PRODOTTI RAW DB", allProducts);
  console.log("PRODOTTI DOPO isValidProduct", products);

  const scored = products
    .map((product) => {
      let score = 0;
      const price = Number(product.price || 0);

      if (answers.budget === "1-20" && (price < 1 || price > 20)) return null;
      if (answers.budget === "20-30" && (price <= 20 || price > 30)) return null;
      if (answers.budget === "30-50" && (price <= 30 || price > 50)) return null;
      if (answers.budget === "50-100" && (price <= 50 || price > 100)) return null;
      if (answers.budget === "100+" && price <= 100) return null;

      if (hasMatch(product.occasion, normalizedAnswers.occasion)) {
        score += 3;
      } else {
        return null;
      }

      if (hasMatch(product.relationship, normalizedAnswers.relationship)) {
        score += 3;
      } else {
        return null;
      }

      if (hasMatch(product.age, normalizedAnswers.age)) {
        score += 5;
      } else {
        return null;
      }

      if (hasMatch(product.personality, normalizedAnswers.personality)) {
        score += 2;
      }

      const selectedGender = normalizedAnswers.gender;
      const hasExactGender = hasMatch(product.gender, selectedGender);
      const hasUnisexGender = hasMatch(product.gender, "unisex");

      if (selectedGender === "maschio" || selectedGender === "femmina") {
        if (!hasExactGender && !hasUnisexGender) {
          return null;
        }

        if (hasExactGender) {
          score += 3;
        }
      } else {
        if (!hasExactGender) {
          return null;
        }

        score += 3;
      }

      if (
        hasMatch(product.occasion, normalizedAnswers.occasion) &&
        hasMatch(product.relationship, normalizedAnswers.relationship) &&
        hasMatch(product.age, normalizedAnswers.age)
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
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    if (a.price !== b.price) {
      return a.price - b.price;
    }

    return a.name.localeCompare(b.name);
  });

    const selectedPool: any[] = [];
  const startIndex = (page - 1) * 5;
const endIndex = startIndex + 5;
  const strictGenderSelection =
    normalizedAnswers.gender === "maschio" || normalizedAnswers.gender === "femmina";

  if (strictGenderSelection) {
    const exactGenderProducts = scored.filter((product) =>
      hasMatch(product.gender, normalizedAnswers.gender),
    );

    const unisexOnlyProducts = scored.filter((product) => {
      const hasExactGender = hasMatch(product.gender, normalizedAnswers.gender);
      const hasUnisexGender = hasMatch(product.gender, "unisex");
      return !hasExactGender && hasUnisexGender;
    });

        pushUniqueByCategory(exactGenderProducts, selectedPool, 1000);
    pushUnique(exactGenderProducts, selectedPool, 1000);

    if (unisexOnlyProducts.length > 0) {
      pushUnique(unisexOnlyProducts, selectedPool, 1000);
    }
  } else {
        pushUniqueByCategory(scored, selectedPool, 1000);
    pushUnique(scored, selectedPool, 1000);
  }

  const paginated = selectedPool.slice(startIndex, endIndex);

while (paginated.length < 5) {
  paginated.push({
    name: "Rofi sta cercando...",
    isPlaceholder: true,
  });
}

return paginated;
}