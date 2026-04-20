/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const QRCode = require('qrcode');

const baseUrl = 'https://www.zaybaash.com';
const utmUrl = 'https://www.zaybaash.com/?utm_source=packaging&utm_medium=qr&utm_campaign=packaging_scan';
const connectUrl = 'https://www.zaybaash.com/connect?utm_source=packaging&utm_medium=qr&utm_campaign=quick_links';

async function main() {
  await QRCode.toFile('public/qr/zaybaash-website-qr-black.png', baseUrl, {
    width: 1800,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });

  await QRCode.toFile('public/qr/zaybaash-website-qr-black.svg', baseUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });

  await QRCode.toFile('public/qr/zaybaash-website-qr-utm.png', utmUrl, {
    width: 1800,
    margin: 2,
    color: { dark: '#2a1f1c', light: '#ffffff' },
  });

  await QRCode.toFile('public/qr/zaybaash-website-qr-utm.svg', utmUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#2a1f1c', light: '#ffffff' },
  });

  await QRCode.toFile('public/qr/zaybaash-connect-qr.png', connectUrl, {
    width: 1800,
    margin: 2,
    color: { dark: '#2a1f1c', light: '#ffffff' },
  });

  await QRCode.toFile('public/qr/zaybaash-connect-qr.svg', connectUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#2a1f1c', light: '#ffffff' },
  });

  const baseSvg = await QRCode.toString(baseUrl, {
    type: 'svg',
    margin: 2,
    color: { dark: '#2a1f1c', light: '#ffffff' },
  });

  const logoReadySvg = baseSvg.replace(
    '</svg>',
    '<rect x="38%" y="38%" width="24%" height="24%" rx="18" ry="18" fill="#ffffff" stroke="#2a1f1c" stroke-width="8"/><text x="50%" y="54%" text-anchor="middle" font-size="84" font-family="Georgia, serif" fill="#2a1f1c">Z</text></svg>'
  );

  fs.writeFileSync('public/qr/zaybaash-website-qr-logo-ready.svg', logoReadySvg, 'utf8');

  console.log('QR variants generated successfully.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
