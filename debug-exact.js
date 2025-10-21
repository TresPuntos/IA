const fs = require('fs');

// Simular exactamente el código del CSVUploader.tsx
function parseCSV(csvContent) {
  console.log('🚀 Procesando CSV...');
  console.log('🔧 Versión del parser: 2024-12-19-v4 (formato unificado)');
  
  const lines = csvContent.split(/\r?\n/);
  console.log('📊 Total líneas en el archivo:', lines.length);
  
  // Reconstruir líneas completas de productos (pueden estar en múltiples líneas físicas)
  const reconstructedLines = [];
  let currentLine = '';
  let quoteCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Contar comillas en la línea
    const lineQuoteCount = (line.match(/"/g) || []).length;
    quoteCount += lineQuoteCount;
    
    if (currentLine === '') {
      // Empezar nueva línea
      currentLine = line;
    } else {
      // Continuar línea existente
      currentLine += '\n' + line;
    }
    
    // Si el número de comillas es par, la línea está completa
    if (quoteCount % 2 === 0 && quoteCount > 0) {
      reconstructedLines.push(currentLine);
      currentLine = '';
      quoteCount = 0;
    }
  }
  
  // Agregar la última línea si existe
  if (currentLine.trim()) {
    reconstructedLines.push(currentLine);
  }
  
  console.log('📊 Líneas reconstruidas:', reconstructedLines.length);
  
  // Parsear cada línea reconstruida
  const rows = [];
  reconstructedLines.forEach((line, index) => {
    if (index < 3) { // Log solo las primeras 3 líneas
      console.log(`📋 Línea ${index + 1}:`, line.substring(0, 150) + '...');
    }
    
    // Parsear línea CSV con comillas
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Comilla escapada
          currentField += '"';
          i++; // Saltar la siguiente comilla
        } else {
          // Inicio o fin de comillas
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Fin de campo
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // Agregar el último campo
    fields.push(currentField.trim());
    
    if (fields.length > 0) {
      rows.push(fields);
    }
  });
  
  console.log('📊 Total filas parseadas:', rows.length);
  console.log('📊 Productos (sin header):', rows.length - 1);
  
  return rows;
}

// Leer el archivo CSV
try {
  const csvContent = fs.readFileSync('/Users/jordi/Downloads/pl (2).csv', 'utf8');
  const rows = parseCSV(csvContent);
  
  console.log('\n✅ RESULTADO FINAL:');
  console.log(`📊 Total productos encontrados: ${rows.length - 1}`);
  
  if (rows.length - 1 === 1511) {
    console.log('🎉 ¡PERFECTO! El parser cuenta exactamente 1511 productos');
  } else {
    console.log(`❌ Error: Se esperaban 1511 productos, pero se encontraron ${rows.length - 1}`);
    
    // Debug adicional
    console.log('\n🔍 DEBUG ADICIONAL:');
    console.log('Primeras 5 líneas del archivo:');
    const lines = csvContent.split(/\r?\n/);
    lines.slice(0, 5).forEach((line, i) => {
      console.log(`${i + 1}: ${line.substring(0, 100)}...`);
    });
  }
  
} catch (error) {
  console.error('❌ Error al leer el archivo:', error.message);
}
