const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "rofi_products.csv");

const file = fs.readFileSync(filePath, "utf8");

// fix: gestiamo bene i ritorni a capo
const lines = file.split(/\r?\n/);

// header
const header = lines[0];

// righe prodotti
const rows = lines.slice(1).filter(line => line.trim() !== "");

const updated = rows.map((line) => {
  const cols = line.split(";");

  // se già ha immagine, non duplicare
  if (cols.length >= 10) return line;

  const image = "https://via.placeholder.com/300";

  return [...cols, image].join(";");
});

const newContent = [header + ";Immagine", ...updated].join("\n");

fs.writeFileSync(filePath, newContent, "utf8");

console.log("CSV aggiornato correttamente");