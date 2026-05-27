const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

const inputFile = 'Oracle_SQL_Simulator_HR.dev.html';
const outputFile = 'Oracle_SQL_Simulator_HR.html';

const html = fs.readFileSync(inputFile, 'utf8');

const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) {
  console.error('No <script> tag found');
  process.exit(1);
}

const rawJS = match[1];

// ━━ ALL function names used in HTML onclick and dynamic innerHTML ━━
const reservedFunctions = [
  // HTML button onclick
  'executeQuery', 'clearEditor', 'formatQuery', 'saveQuery',
  // Theme & sidebar
  'toggleTheme', 'toggleSection', 'toggleTable',
  // Dynamic innerHTML onclick (sidebar tables)
  'insertColumn',
  // Dynamic innerHTML onclick (saved queries)
  'loadSavedQuery', 'deleteSavedQuery',
  // Dynamic innerHTML onclick (results tabs)
  'switchTab', 'closeTab',
  // Dynamic innerHTML onclick (result grid)
  'sortByColumn', 'toggleRowSelection',
  // Other buttons
  'copyResult', 'exportCSV',
  // Drag & drop
  'handleDragStart', 'handleDragOver', 'handleDrop', 'onBodyClick',
  // Resize
  'startSidebarResize', 'startEditorResize', 'onMove', 'onUp',
];

// ━━ ALL global variables shared between HTML and JS ━━
const reservedGlobals = [
  'db', 'editor',
  'resultTabs', 'activeTabIdx', 'currentResult',
  'sortCol', 'sortDir', 'selectedRow',
  'SAVED_KEY', 'HR_DATA',
];

// ━━ ALL SQL-related constants (used by highlighter and preprocessor) ━━
const reservedConstants = [
  'SQL_KEYWORDS', 'SQL_KEYWORDS_UPPER', 'SQL_FUNCTIONS', 'TABLE_META',
];

const reservedNames = [...reservedFunctions, ...reservedGlobals, ...reservedConstants];
const reservedStrings = [...reservedFunctions];

console.log('Reserved names (' + reservedNames.length + '): ' + reservedNames.join(', '));
console.log('Reserved strings (' + reservedStrings.length + '): ' + reservedStrings.join(', '));

const result = JavaScriptObfuscator.obfuscate(rawJS, {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 0.7,
  stringArrayWrappersCount: 2,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  reservedNames: reservedNames,
  reservedStrings: reservedStrings,
});

const newHtml = html.replace(/<script>[\s\S]*?<\/script>/, '<script>' + result.getObfuscatedCode() + '</script>');
fs.writeFileSync(outputFile, newHtml, 'utf8');
console.log('Build complete: ' + outputFile);
