import ViewCountIcon from '@/components/icons/view-count.svg'

export default function ViewCount({ viewCount }) {
  return (
    <span>
      &nbsp;-{' '}
      <ViewCountIcon
        viewBox="0 0 48 48"
        className="inline h-[20px] w-[20px] fill-gray-500 dark:fill-gray-400"
      />{' '}
      {viewCount || 0}
    </span>
  )
}
