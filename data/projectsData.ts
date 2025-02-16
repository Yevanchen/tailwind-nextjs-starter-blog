interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Suno ai remix 专辑',
    description: `说唱/流行remix精选 by Sunoai,我如果可以选艺术那我绕不开的就是音乐,音乐陪伴了我太多 我讨厌 emo 的音乐 `,
    imgSrc: '/static/images/sunoai.webp',
    href: 'https://suno.com/@lovelyyevan',
  },
  {
    title: 'AutoNews',
    description: `叶帆的毕业设计，和 AI 结对编程创建的自动新闻生成引擎，背后是一套最小的 RAG处理流程,也是我首次接触 AI 编程，我非常享受创作带来的成就感和心流`,
    imgSrc: '/static/images/autonews.png',
    href: 'https://autonews-theta.vercel.app/',
  },
  {
    title: 'AI Tamer',
    description: `2023 年因hustlegpt 而有感而生举办的 AI 赚钱比赛获得了真格基金以及顶级开源项目affine和珠宝品牌的赞助在世界范围内有硅谷,加拿大,北京等多个赛区数千名参与者`,
    imgSrc: '/static/images/AI Tamer.png',
    href: 'https://mp.weixin.qq.com/s/Eg704H6Nm47W0q0CbyUlaA',
  },
]

export default projectsData
