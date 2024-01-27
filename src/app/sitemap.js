
import getSitemapDynamicUrls from "@/utils/getSitemapDynamicUrls"

export const revalidate = 60

export default async function sitemap() {
const postIds = await getSitemapDynamicUrls();
    return [
      {
        url: `${process.env.NEXT_PUBLIC_BASEURL}`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASEURL}/stats`,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 0.7,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASEURL}/signup`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASEURL}/login`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASEURL}/identity`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.3,
      },
      {
        url: `${process.env.NEXT_PUBLIC_BASEURL}/donate`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      ...postIds?.map((item) => ({
        url: `${process.env.NEXT_PUBLIC_BASEURL}/${item._id.toHexString()}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.5,
      })),
    ]
  }