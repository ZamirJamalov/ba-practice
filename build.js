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

const reservedNames = [
  'executeQuery', 'clearEditor', 'formatQuery', 'saveQuery',
  'toggleTheme', 'toggleSection', 'toggleTable',
  'insertColumn', 'loadSavedQuery', 'deleteSavedQuery',
  'switchTab', 'closeTab', 'sortByColumn', 'toggleRowSelection',
  'copyResult', 'exportCSV',
  'handleDragStart', 'handleDragOver', 'handleDrop', 'onBodyClick',
  'startSidebarResize', 'startEditorResize', 'onMove', 'onUp',
  'db', 'editor',
  'resultTabs', 'activeTabIdx', 'currentResult',
  'sortCol', 'sortDir', 'selectedRow',
  'SAVED_KEY', 'HR_DATA',
  'SQL_KEYWORDS', 'SQL_KEYWORDS_UPPER', 'SQL_FUNCTIONS', 'TABLE_META',
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
  splitStrings: false,
  stringArray: false,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  reservedNames: reservedNames,
  reservedStrings: reservedNames,
});

const obfuscatedCode = result.getObfuscatedCode();
console.log('Obfuscated code length:', obfuscatedCode.length);

try {
  new Function(obfuscatedCode);
  console.log('Syntax check: OK');
} catch(e) {
  console.error('Syntax check FAILED:', e.message);
  process.exit(1);
}

// Escape $ in obfuscatedCode to prevent replace() special patterns ($& $' $` $n)
const safeCode = obfuscatedCode.replace(/\$/g, '$$$$');
const newHtml = html.replace(/<script>[\s\S]*?<\/script>/, '<script>' + safeCode + '</script>');

// Post-build verification: extract code from the new HTML and syntax-check it
const verifyMatch = newHtml.match(/<script>([\s\S]*?)<\/script>/);
if (verifyMatch) {
  try {
    new Function(verifyMatch[1]);
    console.log('Post-build extraction check: OK');
  } catch(e) {
    console.error('Post-build extraction check FAILED:', e.message);
    process.exit(1);
  }
} else {
  console.error('Post-build: Could not extract <script> from output HTML');
  process.exit(1);
}

fs.writeFileSync(outputFile, newHtml, 'utf8');
console.log('Build complete: ' + outputFile);
