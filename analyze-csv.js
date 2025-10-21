const fs = require('fs');

// Análisis detallado línea por línea
const csvContent = fs.readFileSync('/Users/jordi/Downloads/pl (2).csv', 'utf8');
const lines = csvContent.split(/\r?\n/);

console.log('🔍 ANÁLISIS DETALLADO DEL CSV:');
console.log('📊 Total líneas físicas:', lines.length);

// Analizar las primeras 20 líneas para entender el patrón
console.log('\n📋 Primeras 20 líneas:');
for (let i = 0; i < Math.min(20, lines.length); i++) {
  const line = lines[i];
  const quoteCount = (line.match(/"/g) || []).length;
  const startsWithQuote = line.trim().startsWith('"');
  const hasComma = line.includes(',');
  
  console.log(`${i + 1}: ${startsWithQuote ? '✅' : '❌'} Quotes: ${quoteCount} | Comma: ${hasComma ? '✅' : '❌'} | ${line.substring(0, 80)}...`);
}

// Buscar patrones problemáticos
console.log('\n🔍 Buscando patrones problemáticos:');
const problematicPatterns = [
  'class=""MsoNormal""',
  '<p class=""MsoNormal"">',
  '&amp;',
  '&lt;',
  '&gt;'
];

problematicPatterns.forEach(pattern => {
  const matches = lines.filter(line => line.includes(pattern));
  console.log(`- "${pattern}": ${matches.length} líneas`);
});

// Contar líneas que empiezan con comillas
const linesStartingWithQuotes = lines.filter(line => line.trim().startsWith('"'));
console.log(`\n📊 Líneas que empiezan con comillas: ${linesStartingWithQuotes.length}`);

// Analizar líneas que podrían ser productos reales
console.log('\n🔍 Analizando líneas que podrían ser productos:');
let productCandidates = 0;
let htmlContinuations = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('"')) {
    const quoteCount = (line.match(/"/g) || []).length;
    const hasHtml = line.includes('<');
    const hasComma = line.includes(',');
    
    if (quoteCount >= 2 && hasComma && !hasHtml) {
      productCandidates++;
    } else if (hasHtml) {
      htmlContinuations++;
    }
  }
}

console.log(`- Candidatos a productos (sin HTML): ${productCandidates}`);
console.log(`- Continuaciones HTML: ${htmlContinuations}`);

// Probar diferentes estrategias de conteo
console.log('\n🧪 PROBANDO DIFERENTES ESTRATEGIAS:');

// Estrategia 1: Solo líneas que empiezan con comillas y tienen al menos 3 campos
let strategy1 = 0;
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('"') && trimmed.includes('","')) {
    const fields = trimmed.split('","');
    if (fields.length >= 3) {
      strategy1++;
    }
  }
});
console.log(`Estrategia 1 (3+ campos): ${strategy1}`);

// Estrategia 2: Líneas que empiezan con comillas y no contienen HTML
let strategy2 = 0;
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('"') && !trimmed.includes('<')) {
    strategy2++;
  }
});
console.log(`Estrategia 2 (sin HTML): ${strategy2}`);

// Estrategia 3: Líneas que empiezan con comillas y tienen precio numérico
let strategy3 = 0;
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('"') && trimmed.includes('","')) {
    const parts = trimmed.split('","');
    if (parts.length >= 2) {
      const priceField = parts[1];
      if (priceField && !isNaN(parseFloat(priceField))) {
        strategy3++;
      }
    }
  }
});
console.log(`Estrategia 3 (con precio válido): ${strategy3}`);
