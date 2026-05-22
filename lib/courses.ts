export const courses = [
  {
    id: "young-children",
    price: 49,
    age: "3-6",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Young Children 3-6",
      zh: "幼儿启蒙课"
    },
    subtitle: {
      en: "Playful Chinese foundations through songs, picture books, and daily words.",
      zh: "通过儿歌、绘本和日常词汇进行零基础中文趣味启蒙。"
    },
    points: {
      en: ["Nursery rhymes", "Simple characters", "Picture book reading"],
      zh: ["中文儿歌", "简单汉字", "中文绘本共读"]
    }
  },
  {
    id: "children-teens",
    price: 49,
    age: "7-16",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Children & Teens 7-16",
      zh: "少儿进阶课"
    },
    subtitle: {
      en: "Structured improvement in pinyin, characters, reading, and confident expression.",
      zh: "系统提升拼音、汉字、阅读和中文表达能力。"
    },
    points: {
      en: ["Pinyin system", "Character reading & writing", "Culture topics"],
      zh: ["拼音系统", "汉字读写", "中文文化科普"]
    }
  },
  {
    id: "adults",
    price: 49,
    age: "17+",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    title: {
      en: "Adults 17+",
      zh: "成人实用课"
    },
    subtitle: {
      en: "Practical Mandarin for life, work, travel, and social communication.",
      zh: "面向生活、工作、旅行和社交场景的实用中文课程。"
    },
    points: {
      en: ["Daily Chinese", "Business Chinese", "Travel conversation"],
      zh: ["生活口语", "商务中文", "旅游中文"]
    }
  }
] as const;
