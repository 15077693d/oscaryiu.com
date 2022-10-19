import { MongoClient } from 'mongodb'

// https://codesandbox.io/s/nextjs-with-mongodb-view-count-fh438d?file=/pages/api/blogsViewCount.ts
async function getBlogsViewCountDbAndClient() {
  // Please add MONGODB_URI in vercel
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)
  await client.connect()
  const collection = client.db('personalWebsite').collection('blogs')
  return { collection, client }
}

export default async function BlogViewCountApi(req, res) {
  const { collection, client } = await getBlogsViewCountDbAndClient()
  try {
    switch (req.method) {
      case 'POST':
        // Post request for increment count
        if (req.body.slug) {
          // if req.body.slug is not false, inc then.
          const countRes = await collection.updateOne(
            { slug: req.body.slug },
            { $inc: { viewCount: 1 } },
            // Insert a new document when on match is found
            { upsert: true }
          )
          res.json(countRes)
        } else {
          throw new Error('Slug required')
        }
        break
      default:
        // Get request
        // Checking req.query has slug or not
        // eslint-disable-next-line no-case-declarations
        const countData = await collection
          .find(
            req.query.slug
              ? {
                  slug: req.query.slug,
                }
              : {}
          )
          .toArray()
        client.close()
        res.json(
          countData.reduce((prev, curr) => {
            return { ...prev, [curr.slug]: curr.viewCount }
          }, {})
        )
        break
    }
  } catch (e) {
    res.json({ error: e.message })
  }
}
