import { TagSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayout'
import generateRss from '@/lib/generate-rss'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'
import fs from 'fs'
import path from 'path'
import { getBlogsViewCount } from '@/utils/fetch'

const root = process.cwd()

export async function getStaticPaths() {
  const tags = await getAllTags('blog')

  return {
    paths: Object.keys(tags).map((tag) => ({
      params: {
        tag,
      },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )
  const blogsViewCount = await getBlogsViewCount()

  // rss
  try {
    if (filteredPosts.length > 0) {
      const rss = generateRss(filteredPosts, `tags/${params.tag}/feed.xml`)
      const rssPath = path.join(root, 'public', 'tags', params.tag)
      console.log('LOG getStaticProps(tags/[slug]):', path.join(rssPath, 'feed.xml'))
      fs.mkdirSync(rssPath, { recursive: true })
      fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)
    }
  } catch (error) {
    console.error(error)
  }

  return { props: { posts: filteredPosts, tag: params.tag, blogsViewCount }, revalidate: 1 }
}

export default function Tag({ posts, tag, blogsViewCount }) {
  /** @TODO fix build bug! */

  if (!tag) {
    return <></>
  }
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  return (
    <>
      <TagSEO
        title={`${tag} - ${siteMetadata.author}`}
        description={`${tag} tags - ${siteMetadata.author}`}
      />
      <ListLayout blogsViewCount={blogsViewCount} posts={posts} title={title} />
    </>
  )
}
