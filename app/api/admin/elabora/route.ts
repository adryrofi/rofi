import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productName = body?.productName?.trim();
    const productUrl = body?.productUrl?.trim();

    if (!productName || !productUrl) {
      return NextResponse.json(
        { error: "Nome prodotto o link mancanti" },
        { status: 400 }
      );
    }

    let realProductName = productName;
let productImage = "";
let productPrice = "";

try {
  const response = await fetch(productUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  const html = await response.text();

  // TITOLO (Amazon <title>)
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    realProductName = titleMatch[1]
      .replace("Amazon.it:", "")
      .replace(": Amazon.it", "")
      .trim();
  }

  // IMMAGINE (best effort)
  const imageMatch = html.match(/"large":"(https:[^"]+)"/);
  if (imageMatch && imageMatch[1]) {
    productImage = imageMatch[1].replace(/\\u0026/g, "&");
  }

  // PREZZO (best effort semplice)
  const pricePatterns = [
  /"priceToPay"\s*:\s*\{\s*"priceAmount"\s*:\s*([\d.,]+)/i,
  /"corePriceDisplay_desktop_feature_div"[\s\S]*?a-price-whole[^>]*>\s*([\d.]+)\s*<[\s\S]*?a-price-fraction[^>]*>\s*(\d{2})/i,
  /a-price-whole[^>]*>\s*([\d.]+)\s*</i,
  /"priceAmount"\s*:\s*([\d.,]+)/i,
  /"price"\s*:\s*"([\d.,]+)"/i,
];

for (const pattern of pricePatterns) {
  const match = html.match(pattern);

  if (!match) continue;

  if (match[2]) {
    productPrice = `${match[1].replace(/\./g, "")}.${match[2]}`;
    break;
  }

  if (match[1]) {
    productPrice = match[1].replace(/\./g, "").replace(",", ".");
    break;
  }
}
} catch (error) {
  console.log("Errore scraping:", error);
}

    const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  temperature: 0.2,
  messages: [
    {
      role: "system",
      content: `
Sei un assistente che classifica prodotti regalo per un sistema chiamato Rofi.

Devi restituire SOLO un JSON con questa struttura:

{
  "occasions": [],
  "ages": [],
  "genders": [],
  "relationships": [],
  "personalities": []
}

Devi usare SOLO questi valori:

occasions: compleanno, natale, anniversario, regalo-aziendale
ages: 6-12, 13-18, 18-25, 26-35, 36-50, 50+
genders: maschio, femmina, unisex
relationships: partner, familiare, amico, dipendente
personalities: creativa, tecnologica, sportiva, elegante

Definizioni personalità:
- creativa = oggetti artistici, originali, colorati
- tecnologica = elettronica, gadget, innovazione
- sportiva = sport, fitness, attività fisica
- elegante = prodotti raffinati, minimal, di classe (es. pelle, design sobrio)

REGOLE IMPORTANTI:

1. NON lasciare campi vuoti se puoi dedurre qualcosa
2. Se il genere NON è chiaro → usa "unisex"
3. NON mettere maschio e femmina insieme, a meno che sia chiaramente per entrambi
4. Se il prodotto è generico → aggiungi almeno una occasione plausibile (es. compleanno)
5. Se è per adulti → usa età come 18-25, 26-35 o superiori
6. Scegli categorie utili per un sistema di suggerimento regali, NON risposte vaghe
7. NON inventare categorie fuori lista
8. Rispondi SOLO con JSON, senza testo extra
      `,
    },
    {
  role: "user",
  content: realProductName,
},
  ],
});

const text = completion.choices[0].message.content || "{}";

let suggestions;

try {
  suggestions = JSON.parse(text);
} catch {
  suggestions = {
    occasions: [],
    ages: [],
    genders: [],
    relationships: [],
    personalities: [],
  };
}

return NextResponse.json({
  ok: true,
  realProductName,
  productImage,
  productPrice,
  suggestions,
});
  } catch (error) {
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
  }
}