export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile', '/checkout', '/orders'],
    },
    sitemap: 'https://online-gift-store.vercel.app/sitemap.xml',
  };
}