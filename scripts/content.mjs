function createDrawingGroup({ startPage, group, labels }) {
  return labels.map((label, index) => {
    const pdfPage = startPage + index;

    return Object.freeze({
      pdfPage,
      group,
      label,
      src: `assets/images/projects/nihao/drawings/sheet-${pdfPage}.webp`,
      thumbnail: `assets/images/projects/nihao/drawings/thumbs/sheet-${pdfPage}.webp`,
      alt: `你好酒店${label}施工图`,
      width: 2000,
      height: 1126,
    });
  });
}

const hotelDrawings = Object.freeze([
  ...createDrawingGroup({
    startPage: 32,
    group: "楼层平面",
    labels: [
      "3层·平面布置",
      "3层·墙体定位",
      "3层·地坪布置",
      "3层·综合天花",
      "3层·强弱电",
      "3层·给排水",
      "4-6层·平面布置",
      "4-6层·墙体定位",
      "4-6层·地坪布置",
      "4-6层·综合天花",
      "4-6层·强弱电",
      "4-6层·给排水",
    ],
  }),
  ...createDrawingGroup({
    startPage: 44,
    group: "公区立面",
    labels: ["公共走道·局部立面", "电梯厅及后勤空间·立面"],
  }),
  ...createDrawingGroup({
    startPage: 46,
    group: "客房深化",
    labels: [
      "A户型·原墙定位",
      "A户型·家具定位",
      "A户型·地坪布置",
      "A户型·综合天花",
      "A户型·强弱电",
      "A户型·灯具连线",
      "A户型·立面（1-2）",
      "A户型·立面（3-8）",
    ],
  }),
]);

export const projects = Object.freeze([
  {
    slug: "nihao-hotel-2",
    title: "你好酒店 2.0",
    headline: "我参与把品牌标准，转译成可执行的酒店空间图纸。",
    concept: "在统一的品牌语言下，把客房、大堂与总图落实到准确、可核对的 CAD 交付。",
    category: "酒店空间",
    status: "工作项目 · 设计师助理",
    stage: "标准深化与图纸交付",
    year: "2025-2026",
    tags: ["酒店", "CAD 深化", "标准化", "图纸交付"],
    role: "客房、大厅与总图 CAD 绘制；局部方案调整",
    summary:
      "这段工作让我从品牌标准进入真实的设计协作：理解空间与材料规则，再把它们落实到客房、大堂和总图中，累计完成约 10 套较完整的 CAD 图纸。",
    process: ["拆解品牌与空间标准", "完成客房、大堂及总图绘制", "根据反馈校准尺寸与表达"],
    drawings: hotelDrawings,
    mediaSlots: [
      {
        kind: "hero",
        label: "客房标准形象",
        caption: "客房空间的色彩、家具与品牌构件关系。",
        src: "assets/images/projects/nihao/hero.webp",
        alt: "你好酒店客房多视角空间展示",
        width: 2000,
        height: 1042,
      },
      {
        kind: "overview",
        label: "空间标准",
        caption: "连廊空间中材料、灯光、标识与服务构件的统一表达。",
        src: "assets/images/projects/nihao/overview.webp",
        alt: "你好酒店连廊空间标准与材料标注",
        width: 2000,
        height: 1126,
      },
      {
        kind: "drawing",
        label: "图纸交付",
        caption: "典型楼层平面 CAD 图纸，呈现客房模块与公共交通关系。",
        src: "assets/images/projects/nihao/drawing.webp",
        alt: "你好酒店典型楼层平面 CAD 图纸",
        width: 2000,
        height: 1126,
      },
      {
        kind: "material",
        label: "材料与尺度",
        caption: "大堂材料、灯具与关键安装尺度的标准化控制。",
        src: "assets/images/projects/nihao/material.webp",
        alt: "你好酒店大堂材料灯具及安装尺度标准",
        width: 2000,
        height: 1126,
      },
      {
        kind: "delivery",
        label: "立面标准",
        caption: "外立面招牌、照明与材料构件的组合关系。",
        src: "assets/images/projects/nihao/delivery.webp",
        alt: "你好酒店外立面招牌照明与材料标准",
        width: 2000,
        height: 799,
      },
    ],
    image: "assets/images/projects/nihao/hero.webp",
    imageWidth: 2000,
    imageHeight: 1042,
    alt: "你好酒店客房多视角空间展示",
    statement:
      "我在这个项目中的重点不是重新定义品牌，而是准确理解既有标准，并把它转化为可执行、可检查的空间图纸。",
    challenge:
      "同一套品牌语言需要适配不同客房与公共区域，同时保持尺寸、材料和构件表达的一致性。",
    approach:
      "先拆解品牌手册中的空间模块、材料与灯光规则，再以 CAD 建立客房、大堂和总图之间的完整图纸关系。",
    assetNote: "项目图片整理自你好酒店 2.0 品牌标准与个人参与的 CAD 图纸。",
  },
  {
    slug: "order-realm-office",
    title: "序境 · 无界",
    headline: "我把不同工作状态，组织进一套能自由切换的办公秩序。",
    concept: "以中心共享空间为枢纽，在专注、协作、休息与展示之间建立连续而清晰的转换。",
    category: "办公空间",
    status: "在校项目 · 独立设计",
    stage: "办公空间概念设计",
    year: "在校作品",
    tags: ["办公", "空间规划", "用户研究", "视觉表达"],
    role: "用户分析、空间规划、动线设计与效果表达",
    summary:
      "项目位于杭州。我从办公人群与工作状态出发，将健身、会议、开放办公、独立办公、休息与企业展示组织成环绕中心共享区的复合空间。",
    process: ["分析岗位与行为状态", "建立中心共享与环形动线", "以界面、光线和材质弱化边界"],
    mediaSlots: [
      {
        kind: "hero",
        label: "核心空间",
        caption: "连续的白色界面与环形动线共同塑造开放、流动的办公场景。",
        src: "assets/images/projects/office/hero.webp",
        alt: "序境无界办公空间的白色接待与阶梯区域",
        width: 2000,
        height: 912,
      },
      {
        kind: "overview",
        label: "场地与平面",
        caption: "区位、功能模块与中心共享空间的整体组织。",
        src: "assets/images/projects/office/overview.webp",
        alt: "序境无界办公空间区位分析与平面图",
        width: 2000,
        height: 1126,
      },
      {
        kind: "drawing",
        label: "动线与剖面",
        caption: "通过层间关系与环形路径串联不同办公状态。",
        src: "assets/images/projects/office/drawing.webp",
        alt: "序境无界办公空间动线图与展厅剖面图",
        width: 2000,
        height: 1126,
      },
      {
        kind: "material",
        label: "使用者研究",
        caption: "以岗位、年龄和稳定性拆解不同人群的办公行为需求。",
        src: "assets/images/projects/office/research.webp",
        alt: "序境无界办公人群与岗位行为分析图",
        width: 2000,
        height: 1126,
      },
      {
        kind: "delivery",
        label: "最终表达",
        caption: "接待、吧台、独立办公与开放协作场景。",
        src: "assets/images/projects/office/delivery.webp",
        alt: "序境无界办公空间四张效果图",
        width: 2000,
        height: 1126,
      },
    ],
    image: "assets/images/projects/office/hero.webp",
    imageWidth: 2000,
    imageHeight: 912,
    alt: "序境无界办公空间的白色接待与阶梯区域",
    statement:
      "我希望办公空间不再用封闭隔断定义身份，而是让人在移动中自然识别专注、协作与休息的不同状态。",
    challenge:
      "多种岗位与活动需要共享同一层空间，同时又要保留独立工作的私密性与安静度。",
    approach:
      "以中心共享区串联功能模块，用动静分区、环形动线和通透界面建立效率与开放感之间的平衡。",
    assetNote: "项目图片与分析图整理自《序境 · 无界》完整项目文件。",
  },
  {
    slug: "trace-adaptive-reuse",
    title: "筑 · 迹",
    headline: "我让旧厂房的时间痕迹，成为城市微型图书馆的新空间骨架。",
    concept: "保留工业建筑的记忆，让阅读、交流与短暂停留在新旧材料之间自然发生。",
    category: "旧建筑更新",
    status: "在校项目 · 独立设计",
    stage: "文化空间概念设计",
    year: "在校作品",
    tags: ["旧厂房", "图书馆", "文化更新", "材料策略"],
    role: "场地研究、更新策略、空间设计与效果表达",
    summary:
      "项目位于南京国创园。我把旧生产车间转化为面向城市工作者的微型图书馆，以连续书架、可停留的阶梯和轻盈楼梯，在保留工业痕迹的同时植入阅读与交流。",
    process: ["梳理国创园历史与场地边界", "保留工业结构并植入阅读功能", "用光线、红砖与金属建立新旧对话"],
    mediaSlots: [
      {
        kind: "hero",
        label: "新旧之间",
        caption: "轻盈楼梯穿过连续书架，使移动成为阅读空间的一部分。",
        src: "assets/images/projects/adaptive/hero.webp",
        alt: "筑迹微型图书馆的透明楼梯与连续书架",
        width: 2000,
        height: 912,
      },
      {
        kind: "overview",
        label: "场地判断",
        caption: "南京国创园的区位、道路、建筑肌理与开放空间关系。",
        src: "assets/images/projects/adaptive/overview.webp",
        alt: "筑迹项目南京国创园区位与场地分析",
        width: 2000,
        height: 1126,
      },
      {
        kind: "drawing",
        label: "构造与剖面",
        caption: "以红色标注介入部分，说明旧结构、新屋面与楼梯的衔接。",
        src: "assets/images/projects/adaptive/drawing.webp",
        alt: "筑迹旧厂房改造剖面与构造节点分析",
        width: 2000,
        height: 1126,
      },
      {
        kind: "material",
        label: "材料与陈设",
        caption: "红砖、暖白、深鼠尾草绿、胡桃木与金属共同建立温暖而克制的阅读气质。",
        src: "assets/images/projects/adaptive/material.webp",
        alt: "筑迹微型图书馆材料与陈设分析板",
        width: 2000,
        height: 1126,
      },
      {
        kind: "delivery",
        label: "最终表达",
        caption: "阶梯阅读、连续书架、透明楼梯与交流区的空间场景。",
        src: "assets/images/projects/adaptive/delivery.webp",
        alt: "筑迹微型图书馆四张空间效果图",
        width: 2000,
        height: 1126,
      },
    ],
    image: "assets/images/projects/adaptive/hero.webp",
    imageWidth: 2000,
    imageHeight: 912,
    alt: "筑迹微型图书馆的透明楼梯与连续书架",
    statement:
      "更新不是抹去旧厂房的痕迹，而是让它们成为识别场所、承载新活动的设计资源。",
    challenge:
      "如何在保留工业结构和时间质感的同时，让空间适合安静阅读、交流与短暂停留。",
    approach:
      "保留原有工业骨架，以书架、阶梯和透明楼梯植入新动线，再用自然采光与克制的材料对比连接新旧。",
    assetNote: "项目图片、分析图与效果图整理自《筑 · 迹》完整项目文件。",
  },
]);

export const featuredProject = projects[0];

export function getProjectBySlug(slug) {
  if (typeof slug !== "string") {
    return undefined;
  }

  return projects.find((project) => project.slug === slug);
}
