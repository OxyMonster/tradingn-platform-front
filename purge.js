const { PurgeCSS } = require('purgecss');
const path = require('path');
const fs = require('fs');

// Make sure output folder exists
const outputDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

(async () => {
  // Path to compiled CSS (Angular builds it into .angular or dist)
  const compiledCSSPath = path.join(__dirname, 'dist/trading-platform-client/browser/styles-YVBVTRDG.css'); // <-- after ng build

  if (!fs.existsSync(compiledCSSPath)) {
    console.error('❌ Compiled CSS not found! Run `ng build` first.');
    process.exit(1);
  }

  const purgeCSSResult = await new PurgeCSS().purge({
    content: ['src/**/*.html', 'src/**/*.ts'],
    css: [compiledCSSPath],
    safelist: ['v-btn', 'theme--light', 'v-icon', /^table-name/, /^markets-table/, /^price-change/],
  });

  const purgedCSS = purgeCSSResult.map((r) => r.css).join('\n');

  fs.writeFileSync(path.join(outputDir, 'styles.purged.css'), purgedCSS, 'utf8');

  console.log('✅ PurgeCSS finished! Output: dist/styles.purged.css');
})();
