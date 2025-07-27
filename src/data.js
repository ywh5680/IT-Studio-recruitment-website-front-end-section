export const departmentsData = [
  { name: 'APP部', description: 'APP部门是在移动端高速发展背景下成立的部门。在这里，你会使用React Native技术开发手机应用，编写应用的客户端界面。' },
  { name: 'Web部', description: 'Web部是一个致力于网页前端开发的部门，集结了对技术充满热情的开发者，在这里你可以学习前沿网页开发知识，使用HTML、CSS、JS和Vue搭建自己的网站。' },
  { name: 'IOS部', description: 'iOS部专注于基于Swift语言的iOS APP开发。在这里，你将获得专属Mac mini的使用权（社团期间免费），有资格参加移动应用创新赛和WWDC，还有机会获得加入Apple的免试工作机会。加入我们，开启你的iOS开发之旅吧！' },
  { name: 'UI部', description: '发挥创意，学习界面设计，打造美观、易用的用户界面。使用Photoshop Illustrator等软件来设计网页和APP界面，还负责视频制作，剪辑和特效，是决定界面外观和用户体验的部门，重在设计和操作逻辑。' },
  { name: '游戏部', description: '探索游戏世界的奥秘，学习Unity游戏引擎，使用Unity2D制作简单的2D游戏，亲手打造属于自己的游戏作品。如果你对软件开发充满热情或满怀好奇，渴望在实践中提升自己的技能，那么，爱特工作室就是你梦想起航的地方！' },
  { name: '程序部', description: '程序部主要负责社团的网站开发、应用程序设计、技术支持、技术培训等工作。在这里，你可以学习使用Python开发服务器后端，亲手打造网站。' }
];

export const promotionalImages = [
  '/images/promotionalImages/宣传1.jpg',
  '/images/promotionalImages/宣传2.webp',
  '/images/promotionalImages/宣传3.jpg'
]

export const projectsData = {
  '2023': [
    { name: '中国海洋大学百年校庆小程序', description: '', image: '/images/Projects/2023百年校庆小程序-2.webp' },
  ],
  '2022': [
    { name: '工程学院中英海洋能研究基地网站', description: '', image: '/images/Projects/2022工程学院中英海洋能研究基地制作展示网站.webp' },
    { name: '《大地之歌》', description: '游戏部门独立完成一款横版闯关类游戏《大地之歌》', image: '/images/Projects/2022游戏部门大地之歌.webp' },
    { name: '校友企业电商购物平台', description: '', image: '/images/Projects/2022电商购物平台.webp' },
    { name: '校外企业物联网数据实时展示平台', description: '', image: '/images/Projects/2022物联网数据实时展示平台.webp' }
  ],
  '2021': [
    { name: '校团委网站', description: '由爱特制作的中国海洋大学网站成功上线运行', image: '/images/Projects/2021中国海洋大学网站.webp' }
  ],
  '2020': [
    { name: '《幽灵骑士》', description: '游戏部门独立完成了一款PC端的2.5D游戏《幽灵骑士》', image: '' },
    { name: '爱特展示网、海迅APP', description: '程序、APP与UI合作完成了爱特展示网、海迅APP等作品', image: '' }
  ],
  '2019': [
    { name: '《达拉崩吧》', description: '19年游戏部合作完成了一个可联网、能存档的俯视角射击游戏', image: '/images/Projects/2019游戏部合作射击游戏.webp' },
    { name: '部门合作作品', description: 'Ul与web开发、APP、程序合作设计了爱特读书及爱特读书APP、爱特展示网、IT日程APP', image: '' }
  ],
  '2018': [
    { name: '爱特展示网', description: '开拓爱特展示网，成功上线运行', image: '' },
    { name: '众创空间预约系统', description: '制作众创空间预约系统，成功上线运行', image: '' }
  ],
  '2017': [
    { name: '开拓信院网站', description: '开拓信息科学与工程学院网站，成功上线运行', image: '' }
  ],
  '2016': [
    { name: '上线网站', description: '由爱特制作的中国海洋大学计算机系网站成功上线', image: '/images/Projects/2016国际教育学院展示网.webp' }
  ],
  '2015': [
    { name: 'IGEM比赛团队展示页面', description: '为iGEM比赛团队制作静态展示页面', image: '/images/Projects/2015iGEM比赛团队静态展示页面.webp' },
    { name: '新网站上线', description: '中国海洋大学海洋技术系网站成功上线运行', image: '/images/Projects/2015海洋技术系网站.webp' }
  ],
  '2014': [
    { name: '信息科学与工程学部网站', description: '设计信息科学与工程学部网站，成功上线运行', image: '/images/Projects/2014信息科学与工程学部网站.webp' }
  ]
};

/* 老数据 + 新生成的 2025 数据 */
import team2025 from './data/team-2025.json';
import team2023 from './data/team-2023.json';
import team2022 from './data/team-2022.json';
import team2021 from './data/team-2021.json';

export const teamStructureData = [
  team2025,
  team2023,
  team2022,
  team2021
  // 新生成的 2025 级成员
];