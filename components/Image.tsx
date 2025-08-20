import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  // 确保 src 是字符串类型
  let imgSrc = src

  // 只对本地路径添加 basePath，外部链接保持原样
  if (typeof src === 'string' && !src.startsWith('http')) {
    imgSrc = `${basePath || ''}${src}`
  }

  return <NextImage src={imgSrc} {...rest} />
}

export default Image
