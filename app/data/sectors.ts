export interface Sector {
name: string;
subSectors: string[];

summary: string;
lastUpdate: string;

news: {
title: string;
sentiment: "利好" | "利空";
summary: string;
source: string;
}[];

policies: {
title: string;
date: string;
summary: string;
source: string;
}[];
}

export const sectorsData: Record<string, Sector> = {
ai: {
name: "AI",
subSectors: [
"算力",
"GPU",
"CPO",
"光模块",
"PCB",
"服务器",
"液冷",
"数据中心",
"大模型",
"AI Agent",
"AI应用",
],

summary: "今日AI板块偏暖，核心逻辑：大模型算力提升。",
lastUpdate: "2026-06-06",

news: [
  {
    title: "NVIDIA新GPU发布",
    sentiment: "利好",
    summary: "新GPU性能提升，有望推动大模型训练需求增长。",
    source: "https://www.nvidia.com/",
  },
  {
    title: "某AI公司融资失败",
    sentiment: "利空",
    summary: "融资计划终止，市场对相关赛道短期信心下降。",
    source: "https://www.reuters.com/",
  },
],

policies: [
  {
    title: "工信部发布AI发展新政策",
    date: "2026-06-06",
    summary: "支持人工智能基础设施建设，鼓励大模型产业发展。",
    source: "https://www.miit.gov.cn/",
  },
],

},

robot: {
name: "机器人",
subSectors: [
"人形机器人",
"减速器",
"丝杠",
"电机",
"传感器",
"机器视觉",
"灵巧手",
"工业机器人",
],

summary: "机器人板块受到产业升级关注。",
lastUpdate: "2026-06-06",
news: [],
policies: [],


},

semiconductor: {
name: "半导体",
subSectors: [
"GPU",
"CPU",
"存储芯片",
"模拟芯片",
"功率半导体",
"光刻机",
"半导体设备",
"封装测试",
],

summary: "半导体板块关注国产替代进展。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

new_energy: {
name: "新能源",
subSectors: [
"光伏",
"储能",
"锂电池",
"固态电池",
"风电",
"氢能源",
"核电",
],

summary: "新能源板块受政策支持。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

compute: {
name: "算力",

subSectors: [
"GPU",
"服务器",
"液冷",
"CPO",
"光模块",
"数据中心",
"AI算力",
"云计算",
"边缘计算",
],

summary: "算力板块受AI大模型训练需求驱动，持续受到市场关注。",

lastUpdate: "2026-06-06",

news: [],

policies: [],
},

};