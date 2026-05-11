const fs = require('fs');
const path = require('path');

const src = 'C:/Users/saad/.gemini/antigravity/brain/72ef0b5e-a5ea-467d-a617-e236f49301b3';
const dest = path.join(__dirname, '../public');

const files = [
  ['hero_main_model_1778515927471.png', 'hero-model.png'],
  ['collection_women_card_1778515944974.png', 'collection-women.png'],
  ['article_card_1_1778515967510.png', 'article-1.png'],
  ['article_card_2_1778515996744.png', 'article-2.png'],
  ['article_card_3_1778516015589.png', 'article-3.png'],
];

for (const [from, to] of files) {
  const srcPath = path.join(src, from);
  const destPath = path.join(dest, to);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${to}`);
  } else {
    console.error(`✗ Not found: ${srcPath}`);
  }
}
console.log('Done!');
