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
  {
    title: 'Blog Platform',
    description:
      '基于 Next.js 和 Firebase 构建的个人博客平台，支持 Markdown 编写，实时搜索等功能。',
    imgSrc: '/static/images/myblog.png',
    href: 'https://github.com/Yevanchen/my-blog',
  },
  {
    title: 'flask-todolist',
    description: `cs50 homework project 在 dify 被毙掉两个项目后启动的第一个项目，一个简单的todolist`,
    imgSrc: 'https://raw.githubusercontent.com/Yevanchen/images/main/myblog/20250820212517231.png',
    href: 'https://github.com/Yevanchen/flask-todolist',
  },
  {
    title: 'finance-flask',
    description:
      'CS50 Finance作业：一个用Flask和SQLite实现的模拟股票交易Web应用，支持注册登录、实时查股、买卖股票、投资组合和交易历史等功能。',
    imgSrc: 'https://raw.githubusercontent.com/Yevanchen/images/main/myblog/20250820215302658.png',
    href: 'https://github.com/Yevanchen/finance-flask',
  },
  {
    title: 'GoalTrack Visualizer',
    description:
      '一个可视化习惯/待办追踪工具，基于 React、Vite、shadcn-ui 和 Tailwind CSS，支持多端同步和数据可视化，帮助你养成好习惯。',
    imgSrc: 'https://raw.githubusercontent.com/Yevanchen/images/main/myblog/20250821003650594.png',
    href: 'https://github.com/Yevanchen/goaltrack-visualizer',
  },
  {
    title: 'fygen',
    description: '我们在 2025 adventure hackathon 的作品 让Agent 给其他Agent 做可用的工具',
    imgSrc: 'https://raw.githubusercontent.com/Yevanchen/images/main/myblog/20250821005136561.png',
    href: 'https://fygen.idoknow.top/',
  },
  {
    title: '生日贺卡 for 舒舒',
    description: 'evan 给舒舒的生日贺卡，2024年4月。',
    imgSrc: 'https://raw.githubusercontent.com/Yevanchen/images/main/myblog/20250821005547419.png',
    href: 'https://birthdaycard-sable.vercel.app/',
  },
  {
    title: 'Coming Soon',
    description: '更多项目正在开发中...',
    imgSrc: '/static/images/time-machine.jpg',
    href: '#',
  },
]

export default projectsData
