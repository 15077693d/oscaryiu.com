import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'
import { useEffect } from 'react'
import { incrementBlogViewCount, getBlogsViewCount } from '@/utils/fetch'
const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('blog')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('blog', params.slug.join('/'))
  const authorList = post.frontMatter.authors || ['default']
  const slug = params.slug[0]
  const blogViewCount = await getBlogsViewCount(slug)
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts)
    fs.writeFileSync('./public/feed.xml', rss)
  }

  return { props: { post, authorDetails, prev, next, blogViewCount }, revalidate: 1 }
}

export default function Blog({ post, authorDetails, prev, next, blogViewCount }) {
  useEffect(() => {
    if (post) {
      incrementBlogViewCount(post.frontMatter.slug)
    }
  }, [])
  /** @TODO fix build bug! */
  if (!post) {
    return <></>
  }
  return (
    <>
      {post.frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={post.frontMatter.layout || DEFAULT_LAYOUT}
          toc={post.toc}
          mdxSource={post.mdxSource}
          frontMatter={post.frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
          blogViewCount={blogViewCount}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
