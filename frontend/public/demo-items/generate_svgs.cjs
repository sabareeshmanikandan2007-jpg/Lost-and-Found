const fs = require('fs');
const path = require('path');

const generateSVG = (text, bg, emoji) => `
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${bg}" />
  <text x="200" y="140" font-size="80" text-anchor="middle" dominant-baseline="middle" font-family="-apple-system, sans-serif">${emoji}</text>
  <text x="200" y="240" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" font-family="-apple-system, sans-serif">${text}</text>
</svg>
`;

const items = [
  { name: 'black-backpack.jpg', text: 'Black Backpack', bg: '#1e293b', emoji: '🎒' },
  { name: 'smartphone.jpg', text: 'Smart Phone', bg: '#334155', emoji: '📱' },
  { name: 'id-card.jpg', text: 'Student ID', bg: '#3b82f6', emoji: '🪪' },
  { name: 'wallet.jpg', text: 'Leather Wallet', bg: '#78350f', emoji: '👝' },
  { name: 'notebook.jpg', text: 'Physics Notebook', bg: '#0369a1', emoji: '📓' },
  { name: 'calculator.jpg', text: 'Calc fx-991EX', bg: '#475569', emoji: '🖩' },
  { name: 'bike-key.jpg', text: 'Honda Keys', bg: '#dc2626', emoji: '🔑' },
  { name: 'water-bottle.jpg', text: 'Blue Bottle', bg: '#0284c7', emoji: '🧊' },
  { name: 'spectacles.jpg', text: 'Ray-Ban Glasses', bg: '#171717', emoji: '👓' },
  { name: 'college-bag.jpg', text: 'Puma Bag', bg: '#64748b', emoji: '🎒' },
  { name: 'textbook.jpg', text: 'Math Textbook', bg: '#b45309', emoji: '📚' },
  { name: 'wireless-mouse.jpg', text: 'Logitech Mouse', bg: '#020617', emoji: '🖱️' },
  { name: 'earphones.jpg', text: 'Sony Earphones', bg: '#1f2937', emoji: '🎧' },
];

const dir = path.join(__dirname);

items.forEach(item => {
  const filePath = path.join(dir, item.name); // Using .jpg extension physically but saving SVG content allows browser display, but let's just make it works. Actually saving SVG inside .jpg works in browsers but might cause issues. 
  // Let's rewrite as .svg and update demoItems URL 
  const newName = item.name.replace('.jpg', '.svg');
  fs.writeFileSync(path.join(dir, newName), generateSVG(item.text, item.bg, item.emoji).trim());
  console.log(`Created ${newName}`);
});
