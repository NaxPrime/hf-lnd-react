import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hotelfirst.one';

  const staticRoutes = [
    '',
    '/terms-and-conditions',
    '/privacy-policy',
    '/Contact',
    '/Aboutus',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const services = [
    'revenue-management',
    'ota-optimization',
    'hotel-marketing',
    'hotel-consulting',
    'hotel-profitability',
    'revenue-management-for-resorts',
    'revenue-management-for-business-hotels',
    'revenue-management-for-boutique-hotels',
    'revenue-management-for-3-star-hotels',
    'revenue-management-for-4-star-hotels',
    'revenue-management-for-5-star-hotels'
  ];

  const locations = [
    'hyderabad',
    'bangalore',
    'goa',
    'chennai',
    'mumbai'
  ];

  const programmaticRoutes: MetadataRoute.Sitemap = [];

  services.forEach(service => {
    programmaticRoutes.push({
      url: `${baseUrl}/${service}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    locations.forEach(location => {
      programmaticRoutes.push({
        url: `${baseUrl}/${service}-${location}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  });

  return [...staticRoutes, ...programmaticRoutes];
}
