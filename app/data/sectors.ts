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

energy: {
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

pharma: {
name: "创新药",
subSectors: [
"创新药",
"CRO",
"CXO",
"医疗器械",
"AI制药",
"减肥药",
"ADC",
"基因治疗",
],

summary: "创新药研发进展受到关注。",
lastUpdate: "2026-06-06",
news: [],
policies: [],


},

auto: {
name: "智能驾驶",
subSectors: [
"自动驾驶",
"激光雷达",
"智能座舱",
"汽车电子",
"车载芯片",
],

summary: "智能驾驶产业链持续活跃。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

consumer_electronics: {
name: "消费电子",
subSectors: [
"苹果产业链",
"XR",
"VR",
"AR",
"折叠屏",
"OLED",
"智能穿戴",
],

summary: "消费电子关注新品发布周期。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

aerospace: {
name: "航天军工",
subSectors: [
"商业航天",
"卫星互联网",
"北斗导航",
"无人机",
"军工电子",
"航空发动机",
],

summary: "军工订单与商业航天受关注。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

chemical: {
name: "化工材料",
subSectors: [
"氟化工",
"磷化工",
"有机硅",
"制冷剂",
"碳纤维",
"化工新材料",
],

summary: "化工原材料价格波动明显。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

metals: {
name: "有色金属",
subSectors: [
"铜",
"黄金",
"白银",
"稀土",
"锂",
"镍",
"钴",
"铝",
],

summary: "金属价格走势受到市场关注。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

power: {
name: "电力能源",
subSectors: [
"火电",
"水电",
"核电",
"绿电",
"煤炭",
"天然气",
"电网设备",
],

summary: "电力板块运行平稳。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

data: {
name: "数据要素",
subSectors: [
"数据交易",
"数据安全",
"数据治理",
"隐私计算",
],

summary: "数据要素市场建设持续推进。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

xinchuang: {
name: "信创",
subSectors: [
"国产CPU",
"国产数据库",
"国产操作系统",
"国产办公软件",
"网络安全",
],

summary: "信创国产替代逻辑持续。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

low_altitude: {
name: "低空经济",
subSectors: [
"eVTOL",
"无人机",
"飞控系统",
"空管系统",
],

summary: "低空经济基础设施建设推进。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},

consumer: {
name: "消费服务",
subSectors: [
"白酒",
"食品饮料",
"旅游酒店",
"免税",
"连锁零售",
"新消费",
],

summary: "消费板块关注需求恢复情况。",
lastUpdate: "2026-06-06",
news: [],
policies: [],

},
};