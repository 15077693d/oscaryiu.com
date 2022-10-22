// incrementViewCount when Blog rerender
export const incrementBlogViewCount = async (slug) => {
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
  // Add API_BASE_URI in Secret Keys
  let viewCountsOrViewCount
  try {
    if (process.env.NEXT_PUBLIC_API_BASE_URI) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URI}/api/blogsViewCount${slug ? `?slug=${slug}` : ''}`
      )
      viewCountsOrViewCount = await res.json()
    } else {
      viewCountsOrViewCount = slug ? '0' : {}
    }
  } catch (error) {
    viewCountsOrViewCount = slug ? '0' : {}
  }
  return viewCountsOrViewCount
}
