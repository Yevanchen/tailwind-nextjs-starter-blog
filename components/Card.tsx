'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from './Image'
import Link from './Link'

interface CardProps {
  title: string
  description: string
  imgSrc?: string
  href?: string
}

const Card = ({ title, description, imgSrc, href }: CardProps) => {
  const descriptionId = useId()
  const descriptionRef = useRef<HTMLSpanElement>(null)
  const [overflowing, setOverflowing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  // 收起动画结束后才恢复省略号，否则文字会先缩成三行，动画无从播放
  const [clamped, setClamped] = useState(true)

  // 描述超过三行才显示展开按钮；卡片宽度变化时重新判断
  useEffect(() => {
    const text = descriptionRef.current
    if (!text) return
    const observer = new ResizeObserver(() => {
      const lineHeight = parseFloat(getComputedStyle(text).lineHeight)
      setOverflowing(text.scrollHeight > lineHeight * 3 + 1)
    })
    observer.observe(text)
    return () => observer.disconnect()
  }, [])

  const toggleExpanded = () => {
    if (expanded) {
      setExpanded(false)
      // 减弱动态效果时没有过渡，transitionend 不会触发
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setClamped(true)
    } else {
      setClamped(false)
      setExpanded(true)
    }
  }

  return (
    <div className="p-4 md:w-1/2 lg:w-1/3">
      <div className="h-full overflow-hidden rounded-lg border-2 border-gray-200 border-opacity-60 transition-all duration-200 hover:shadow-lg dark:border-gray-700">
        {imgSrc &&
          (href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center md:h-36 lg:h-48"
                width={544}
                height={306}
              />
            </Link>
          ) : (
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          ))}
        <div className="p-6">
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h2>
          {/* 首行固定为三行文字高（3 × 行高 1.75rem），第二行在 0fr 与 1fr 间过渡，高度从三行平滑展开到全文 */}
          <p
            id={descriptionId}
            className={`prose mb-3 max-w-none text-gray-500 transition-[grid-template-rows] duration-300 motion-reduce:transition-none dark:text-gray-400 ${
              overflowing ? 'grid' : ''
            } ${expanded ? 'grid-rows-[5.25rem_1fr]' : 'grid-rows-[5.25rem_0fr]'}`}
            onTransitionEnd={(event) => {
              if (event.propertyName === 'grid-template-rows' && !expanded) setClamped(true)
            }}
          >
            <span
              ref={descriptionRef}
              className={`row-span-2 overflow-hidden ${clamped ? 'line-clamp-3' : 'block'}`}
            >
              {description}
            </span>
          </p>
          {(href || overflowing) && (
            <div className="flex items-center gap-4">
              {href && (
                <Link
                  href={href}
                  className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label={`Link to ${title}`}
                >
                  了解更多 &rarr;
                </Link>
              )}
              {overflowing && (
                <button
                  type="button"
                  onClick={toggleExpanded}
                  aria-expanded={expanded}
                  aria-controls={descriptionId}
                  aria-label={`${expanded ? '收起' : '展开'} ${title} 的完整介绍`}
                  className="ml-auto inline-flex items-center gap-1 text-sm font-medium leading-6 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  {expanded ? '收起' : '展开'}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
