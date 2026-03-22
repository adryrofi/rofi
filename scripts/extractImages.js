const fs = require("fs");
const path = require("path");
const https = require("https");

const csvPath = path.join(__dirname, "..", "data", "rofi_products.csv");

function getHTML(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extractImage(html) {
  const match = html.match(/"large":"(https:[^"]+)"/);
  return match ? match[1] : null;
}

function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  if (!match) return null;

  return match[1]
    .replace("Amazon.it: ", "")
    .replace(": Amazon.it", "")
    .trim();
}

function extractPrice(html) {
  const match =
    html.match(/<span class="a-price-whole">([^<]+)<\/span>/) &&
    html.match(/<span class="a-price-fraction">([^<]+)<\/span>/);

  if (!match) return null;

  const whole = html.match(/<span class="a-price-whole">([^<]+)<\/span>/);
  const fraction = html.match(/<span class="a-price-fraction">([^<]+)<\/span>/);

  if (!whole || !fraction) return null;

  return `${whole[1].replace(/\./g, "")}.${fraction[1]}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const csv = fs.readFileSync(csvPath, "utf8");
  const rows = csv.split("\n").filter((row) => row.trim() !== "");

  const header = rows[0];
  const newRows = [header];

  for (let i = 1; i < rows.length; i++) {
    const cols = rows[i].split(";");
    const link = cols[2];
    if (!link || !link.includes("amazon.")) {
        console.log(`⚠️ Riga ${i + 1}: link non valido o non Amazon -> ${link}`);
        newRows.push(rows[i]);
        continue;
        }
    const currentImage = cols[9];
    const currentName = cols[0];

    
    if (
        currentImage &&
        currentImage.startsWith("http") &&
        currentName &&
        currentName.length >= 5
    ) {
        console.log("⏭️ Immagine e nome già presenti, salto");
        newRows.push(rows[i]);
        continue;
    }

    if (!link) {
      newRows.push(rows[i]);
      continue;
    }

    console.log("🔍 Analizzo:", link);

    try {
      const html = await getHTML(link);
      if (!html || html.length < 1000) {
        console.log("❌ Pagina non valida o bloccata");
        newRows.push(rows[i]);
        continue;
        }
      const image = extractImage(html);
      const title = extractTitle(html);
      const price = extractPrice(html);
      console.log("💰 Prezzo trovato:", price);

      if (image) {
        cols[9] = image;
        console.log("✅ Trovata immagine");
      }

     else { 
        console.log("❌ Nessuna immagine trovata");
        }
    } catch (err) {
      console.log("⚠️ Errore su link");
    }

    newRows.push(cols.join(";"));

    await sleep(1500);
  }

  fs.writeFileSync(csvPath, newRows.join("\n"), "utf8");

  console.log("🎉 CSV aggiornato!");
}

main();