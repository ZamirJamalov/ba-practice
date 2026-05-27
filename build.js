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
const scriptTag = '<script>' + match[0] + '</script>';

const reserved = [
  'runQuery','formatSql','clearEditor','loadSavedQueries','saveQuery','deleteQuery',
  'toggleSidebar','toggleTable','copyResult','exportCSV','sortByColumn','reorderColumns',
  'switchTab','closeTab','splitMultipleStatements','renderResultTabs',
  'activeTabIdx','resultTabs','currentResult','sortCol','sortDir','selectedRow',
  'db','editor','showTable','onBodyClick','handleDragStart','handleDragOver','handleDrop'
];

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
  reservedNames: reserved,
  reservedStrings: ['runQuery','formatSql','clearEditor','loadSavedQueries','saveQuery','deleteQuery',
    'toggleSidebar','toggleTable','copyResult','exportCSV','sortByColumn','reorderColumns',
    'splitMultipleStatements','renderResultTabs','switchTab','closeTab']
});

const newHtml = html.replace(/<script>[\s\S]*?<\/script>/, '<script>' + result.getObfuscatedCode() + '</script>');
fs.writeFileSync(outputFile, newHtml, 'utf8');
console.log('Build complete: ' + outputFile);
