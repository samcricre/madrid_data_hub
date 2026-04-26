import fs from "fs/promises";

const sources = [
  {
    name: "carreras-madrid",
    url: "https://datos.madrid.es/egob/catalogo/300261-0-agenda-proximas-carreras.json",
    output: "data/carreras-madrid.json"
  }
];

for (const source of sources) {
  console.log(`Descargando ${source.name}...`);
  const res = await fetch(source.url);
  if (!res.ok) throw new Error(`Error descargando ${source.name}: ${res.status}`);
  const data = await res.json();
  await fs.writeFile(source.output, JSON.stringify(data, null, 2), "utf8");
}
