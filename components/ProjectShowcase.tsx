'use client'

import { useState } from 'react'
import projectsData from '@/data/projectsData'
import Card from './Card'

const ProjectShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 所有项目
  const projects = projectsData

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Projects
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          我的项目展示 - 从音乐创作到AI应用，探索我的创意世界
        </p>
      </div>
      <div className="py-12">
        <div className="-m-4 flex flex-wrap justify-center">
          {projects.map((project) => (
            <Card
              key={project.title}
              title={project.title}
              description={project.description}
              imgSrc={project.imgSrc}
              href={project.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectShowcase
