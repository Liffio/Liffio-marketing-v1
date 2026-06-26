/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.liffio.com',
  generateRobotsTxt: true,
  autoLastmod: true,
  exclude: [
    '/signup',
    '/login',
    '/dashboard',
    '/dashboard/*',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-policy',
    '/refund-policy',
    '/acceptable-use-policy',
    '/affiliate-policy',
    '/creators-policy',
    '/404',
    '/500',
    '/_*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/signup',
          '/login',
          '/dashboard',
          '/api/',
        ],
      },
    ],
  },
}
