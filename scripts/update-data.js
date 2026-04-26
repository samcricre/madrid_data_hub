import fs from "fs/promises";
import { XMLParser } from "fast-xml-parser";

const sources = [
  {
    name: "fuentes-mascotas",
    url: "https://datos.madrid.es/dataset/50055-0-fuentes-mascotas/resource/50055-7-fuentes-mascotas-json/download/50055-7-fuentes-mascotas-json.json",
    output: "data/fuentes-mascotas.json",
    type: "json"
  },
  {
    name: "carreras-madrid",
    url: "https://datos.madrid.es/egob/catalogo/300261-0-agenda-proximas-carreras.json",
    output: "data/carreras-madrid.json",
    type: "json"
  },
  {
    name: "puntos-turisticos",
    url: "https://www.esmadrid.com/opendata/turismo_v1_es.xml",
    output: "data/puntos-turisticos.json",
    type: "xml"
  }
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "text",
  trimValues: true
});

async function downloadSource(source) {
  console.log(`Descargando ${source.name}...`);

  const response = await fetch(source.url, {
    headers: {
      "User-Agent": "MadridDataHub/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Error descargando ${source.name}: ${response.status}`);
  }

  if (source.type === "json") {
    const data = await response.json();

    await fs.writeFile(
      source.output,
      JSON.stringify(data, null, 2),
      "utf8"
    );
  }

  if (source.type === "xml") {
    const xml = await response.text();
    const json = parser.parse(xml);

    await fs.writeFile(
      source.output,
      JSON.stringify(json, null, 2),
      "utf8"
    );
  }

  console.log(`Actualizado: ${source.output}`);
}

for (const source of sources) {
  await downloadSource(source);
}
