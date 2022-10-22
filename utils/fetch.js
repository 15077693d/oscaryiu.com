// incrementViewCount when Blog rerender
export const incrementBlogViewCount = async (slug) => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URI) {
    console.error('Missing process.env.NEXT_PUBLIC_API_BASE_URI')
  }
  if (slug) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URI}/api/blogsViewCount`, {
      method: 'POST',
      body: JSON.stringify({ slug }),
      // Without context type the data which is string instead of json object
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export const getBlogsViewCount = async (slug) => {
  // if (!process.env.NEXT_PUBLIC_API_BASE_URI) {
  //   console.error('Missing process.env.NEXT_PUBLIC_API_BASE_URI')
  // }
  // Add API_BASE_URI in Secret Keys
  let viewCountsOrViewCount
  try {
    const res = await fetch(
      `https://oscaryiu-com-i1dy-git-feat-view-count-15077693d.vercel.app/api/blogsViewCount`
    )
    viewCountsOrViewCount = await res.json()
  } catch (error) {
    viewCountsOrViewCount = slug ? '0' : {}
  }
  return viewCountsOrViewCount
}
