import ProjectShowcase from '@/components/ProjectShowcase'
import { genPageMetadata } from '../seo'

export const metadata = genPageMetadata({ title: 'Footprint' })

export default function Projects() {
  return (
    <>
      <ProjectShowcase />
    </>
  )
}
