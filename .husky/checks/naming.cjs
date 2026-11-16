// Reglas compartidas por los hooks de git (commit-msg y pre-push).
// - Idioma: el texto debe estar en inglés. Se rechaza si aparece una letra
//   acentuada del español o una palabra común del español.
// - Largo: máximo 100 caracteres por línea del mensaje y por nombre de rama.

const MAX_LENGTH = 100;

const SPANISH_WORDS = new Set([
  'de', 'del', 'la', 'las', 'el', 'los', 'un', 'una', 'unos', 'unas',
  'y', 'o', 'para', 'por', 'con', 'sin', 'pero', 'que', 'como', 'si',
  'es', 'son', 'se', 'al', 'lo', 'su', 'sus', 'mi', 'nuevo', 'nueva',
  'cambios', 'cambio', 'agregar', 'agregado', 'actualizar', 'actualizacion',
  'arreglar', 'arreglo', 'corregir', 'corregido', 'eliminar', 'eliminado',
  'archivo', 'archivos', 'usuario', 'pantalla', 'versión', 'version',
  'mensaje', 'rama', 'ramas', 'nombre', 'tambien', 'también',
]);

const SPANISH_CHARS = /[áéíóúñüÁÉÍÓÚÑÜ¿¡]/;

function findProblems(text) {
  const problems = [];
  if (SPANISH_CHARS.test(text)) {
    problems.push('contains Spanish characters (accents, ñ, ¿ ¡)');
  }
  const words = text.toLowerCase().split(/[^a-záéíóúñü]+/).filter(Boolean);
  const hit = words.find((w) => SPANISH_WORDS.has(w));
  if (hit) {
    problems.push(`contains the Spanish word "${hit}"`);
  }
  return problems;
}

module.exports = { MAX_LENGTH, findProblems };
