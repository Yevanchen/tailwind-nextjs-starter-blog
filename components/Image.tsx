import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

const Image = ({ src, ...rest }: ImageProps) => {
  // 确保 src 是字符串类型
  const imgSrc = typeof src === 'string' ? `${basePath || ''}${src}` : src
  return <NextImage src={imgSrc} {...rest} />
}

export default Image
