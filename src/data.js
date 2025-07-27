export const departmentsData = [
  { name: 'APP部', description: 'APP部门是在移动端高速发展背景下成立的部门。在这里，你会使用React Native技术开发手机应用，编写应用的客户端界面。' },
  { name: 'Web部', description: 'Web部是一个致力于网页前端开发的部门，集结了对技术充满热情的开发者，在这里你可以学习前沿网页开发知识，使用HTML、CSS、JS和Vue搭建自己的网站。' },
  { name: 'IOS部', description: 'iOS部专注于基于Swift语言的iOS APP开发。在这里，你将获得专属Mac mini的使用权（社团期间免费），有资格参加移动应用创新赛和WWDC，还有机会获得加入Apple的免试工作机会。加入我们，开启你的iOS开发之旅吧！' },
  { name: 'UI部', description: '发挥创意，学习界面设计，打造美观、易用的用户界面。使用Photoshop Illustrator等软件来设计网页和APP界面，还负责视频制作，剪辑和特效，是决定界面外观和用户体验的部门，重在设计和操作逻辑。' },
  { name: '游戏部', description: '探索游戏世界的奥秘，学习Unity游戏引擎，使用Unity2D制作简单的2D游戏，亲手打造属于自己的游戏作品。如果你对软件开发充满热情或满怀好奇，渴望在实践中提升自己的技能，那么，爱特工作室就是你梦想起航的地方！' },
  { name: '程序部', description: '程序部主要负责社团的网站开发、应用程序设计、技术支持、技术培训等工作。在这里，你可以学习使用Python开发服务器后端，亲手打造网站。' }
];

export const projectsData = {
  '2024': [
    { name: '1', description: '3111', image: '/images/2023project.webp' },
    { name: '21111', description: '41111', image: 'https://via.placeholder.com/300x200/ADD8E6/000000?text=Cross-Platform' }
  ],
  '2023': [
    { name: '小程序开发', description: '中国海洋大学信息科学与工程学部百年校庆小程序', image: '/images/2023project.webp' },
    { name: '11', description: '111111', image: 'https://via.placeholder.com/300x200' }
  ],
  '2022': [
    { name: '1', description: '111', image: 'https://via.placeholder.com/300x200' },
    { name: '111', description: '1111', image: 'https://via.placeholder.com/300x200' }
  ],
  '2025': [
    { name: '1', description: '3111', image: '/images/2023project.webp' },
    { name: '21111', description: '41111', image: 'https://via.placeholder.com/300x200/ADD8E6/000000?text=Cross-Platform' }
  ],
};

/* 老数据 + 新生成的 2025 数据 */
import team2025 from './data/team-2025.json';

export const teamStructureData = [
  team2025,
  {
    year: '2023',
    departments: [
      { name: 'APP部', members: [{ name: '1', quote: '1', avatar: 'https://via.placeholder.com/150' }] },
      { name: 'Web部', members: [{ name: '2', quote: '1', avatar: 'https://via.placeholder.com/150' }, { name: '1', quote: '1', avatar: 'https://via.placeholder.com/150' }] },
      { name: 'IOS部', members: [] },
      { name: 'UI部', members: [] },
      { name: '游戏部', members: [{ name: '1', quote: '1', avatar: 'https://via.placeholder.com/150' }] },
      { name: '程序部', members: [] }
    ]
  },
  {
    year: '2022',
    departments: [
      { name: 'APP部', members: [] },
      { name: 'Web部', members: [{ name: '1', quote: '1', avatar: 'https://via.placeholder.com/150' }] },
      { name: 'IOS部', members: [] },
      { name: 'UI部', members: [{ name: '1', quote: '1。', avatar: 'https://via.placeholder.com/150' }, { name: '1', quote: '2', avatar: 'https://via.placeholder.com/150' }] },
      { name: '游戏部', members: [] },
      { name: '程序部', members: [] }
    ]
  }
  // 新生成的 2025 级成员
];