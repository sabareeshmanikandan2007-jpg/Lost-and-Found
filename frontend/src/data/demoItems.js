/**
 * FINDY — Demo items list.
 * (Empty now, as user requested to remove all demo products).
 */

export const DEMO_ITEMS = [];

const BACKEND_BASE = import.meta.env?.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Utility: get appropriate image URL for a post.
 * Priority: backend absolute imageUrl > backend /uploads/image > demo imageUrl (/demo-items/) > null
 */
export const getItemImageUrl = (post) => {
  if (!post) return null;
  // Full URL from backend (http://...)
  if (post.imageUrl && post.imageUrl.startsWith('http')) return post.imageUrl;
  // Local demo image path
  if (post.imageUrl && post.imageUrl.startsWith('/demo-items')) return post.imageUrl;
  // Backend uploads filename
  if (post.image) return `${BACKEND_BASE}/uploads/${post.image}`;
  return null;
};

/**
 * Category emoji mapping
 */
export const CATEGORY_EMOJI = {
  Electronics: '💻',
  Books: '📚',
  'ID Cards': '🪪',
  Wallet: '👛',
  Keys: '🔑',
  Bags: '🎒',
  Documents: '📄',
  Clothing: '👕',
  Accessories: '⌚',
  Other: '📦',
};

export const CATEGORIES = [
  'Electronics', 'Books', 'ID Cards', 'Wallet',
  'Keys', 'Bags', 'Documents', 'Clothing', 'Accessories', 'Other'
];
