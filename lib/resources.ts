import type { Language } from "@/lib/types";

export type ResourceItem = [string, string, string, string?, string?];

export type Resource = {
  id: string;
  title: Record<Language, string>;
  intro: Record<Language, string>;
  image: string;
  groups: Array<{
    label: Record<Language, string>;
    items: ResourceItem[];
  }>;
};

export const resourceLibrary = [
  {
    id: "greetings",
    title: { en: "Daily Chinese Greetings", zh: "日常中文问候语" },
    intro: {
      en: "Start every conversation politely. These are high-frequency greetings for class, family, friends, and daily life.",
      zh: "从礼貌问候开始开口说中文，适合课堂、家庭、朋友和日常交流。"
    },
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    groups: [
      {
        label: { en: "First meetings", zh: "初次见面" },
        items: [
          ["你好", "nǐ hǎo", "Hello"],
          ["您好", "nín hǎo", "Hello, polite"],
          ["很高兴认识你", "hěn gāo xìng rèn shi nǐ", "Nice to meet you"],
          ["你叫什么名字？", "nǐ jiào shén me míng zi?", "What is your name?"],
          ["我叫 Lucy", "wǒ jiào Lucy", "My name is Lucy"],
          ["你来自哪里？", "nǐ lái zì nǎ lǐ?", "Where are you from?"],
          ["我来自中国", "wǒ lái zì zhōng guó", "I am from China"]
        ]
      },
      {
        label: { en: "Daily check-ins", zh: "日常寒暄" },
        items: [
          ["早上好", "zǎo shang hǎo", "Good morning"],
          ["下午好", "xià wǔ hǎo", "Good afternoon"],
          ["晚上好", "wǎn shang hǎo", "Good evening"],
          ["你好吗？", "nǐ hǎo ma?", "How are you?"],
          ["我很好，谢谢", "wǒ hěn hǎo, xiè xie", "I am fine, thank you"],
          ["最近怎么样？", "zuì jìn zěn me yàng?", "How have you been recently?"]
        ]
      },
      {
        label: { en: "Goodbyes and thanks", zh: "告别与感谢" },
        items: [
          ["谢谢", "xiè xie", "Thank you"],
          ["不客气", "bú kè qi", "You are welcome"],
          ["对不起", "duì bu qǐ", "Sorry"],
          ["没关系", "méi guān xi", "It is okay"],
          ["再见", "zài jiàn", "Goodbye"],
          ["明天见", "míng tiān jiàn", "See you tomorrow"]
        ]
      }
    ]
  },
  {
    id: "pinyin",
    title: { en: "Beginner's Pinyin Guide", zh: "拼音入门资料" },
    intro: {
      en: "This guide follows standard Hanyu Pinyin practice audio. Pinyin is shown without tone marks here, and each sound uses first-tone style demo audio where available.",
      zh: "本资料参考标准汉语拼音点读音频。页面拼音不标声调，练习音频按第一声示范音播放。"
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    groups: [
      {
        label: { en: "Initials / 声母", zh: "声母 / Initials" },
        items: [
          ["b", "bo", "Unaspirated bilabial initial", "", "b.mp3"],
          ["p", "po", "Aspirated bilabial initial", "", "p.mp3"],
          ["m", "mo", "Nasal bilabial initial", "", "m.mp3"],
          ["f", "fo", "Labiodental initial", "", "f.mp3"],
          ["d", "de", "Unaspirated tongue-tip initial", "", "d.mp3"],
          ["t", "te", "Aspirated tongue-tip initial", "", "t.mp3"],
          ["n", "ne", "Nasal tongue-tip initial", "", "n.mp3"],
          ["l", "le", "Lateral tongue-tip initial", "", "l.mp3"],
          ["g", "ge", "Unaspirated back initial", "", "g.mp3"],
          ["k", "ke", "Aspirated back initial", "", "k.mp3"],
          ["h", "he", "Back fricative initial", "", "h.mp3"],
          ["j", "ji", "Unaspirated palatal initial", "", "j.mp3"],
          ["q", "qi", "Aspirated palatal initial", "", "q.mp3"],
          ["x", "xi", "Palatal fricative initial", "", "x.mp3"],
          ["zh", "zhi", "Retroflex initial", "", "zh.mp3"],
          ["ch", "chi", "Aspirated retroflex initial", "", "ch.mp3"],
          ["sh", "shi", "Retroflex fricative initial", "", "sh.mp3"],
          ["r", "ri", "Retroflex voiced initial", "", "r.mp3"],
          ["z", "zi", "Unaspirated dental sibilant", "", "z.mp3"],
          ["c", "ci", "Aspirated dental sibilant", "", "c.mp3"],
          ["s", "si", "Dental sibilant", "", "s.mp3"],
          ["y", "yi", "Semivowel starting sound", "", "y.mp3"],
          ["w", "wu", "Semivowel starting sound", "", "w.mp3"]
        ]
      },
      {
        label: { en: "Finals / 韵母", zh: "韵母 / Finals" },
        items: [
          ["a", "a", "Single final", "", "a.mp3"],
          ["o", "o", "Single final", "", "o.mp3"],
          ["e", "e", "Single final", "", "e.mp3"],
          ["i", "i", "Single final", "", "i.mp3"],
          ["u", "u", "Single final", "", "u.mp3"],
          ["ü", "ü", "Rounded front final", "", "v.mp3"],
          ["ai", "ai", "Compound final", "", "ai.mp3"],
          ["ei", "ei", "Compound final", "", "ei.mp3"],
          ["ui", "ui", "Compound final; written ui, pronounced uei", "", "ui.mp3"],
          ["ao", "ao", "Compound final", "", "ao.mp3"],
          ["ou", "ou", "Compound final", "", "ou.mp3"],
          ["iu", "iu", "Compound final; written iu, pronounced iou", "", "iu.mp3"],
          ["ie", "ie", "Compound final", "", "ie.mp3"],
          ["üe", "üe", "Compound final", "", "ve.mp3"],
          ["er", "er", "Special final", "", "er.mp3"],
          ["an", "an", "Front nasal final", "", "an.mp3"],
          ["en", "en", "Front nasal final", "", "en.mp3"],
          ["in", "in", "Front nasal final", "", "in.mp3"],
          ["un", "un", "Front nasal final; written un, pronounced uen", "", "un.mp3"],
          ["ün", "ün", "Front nasal final", "", "vn.mp3"],
          ["ang", "ang", "Back nasal final", "", "ang.mp3"],
          ["eng", "eng", "Back nasal final", "", "eng.mp3"],
          ["ing", "ing", "Back nasal final", "", "ing.mp3"],
          ["ong", "ong", "Back nasal final", "", "ong.mp3"]
        ]
      },
      {
        label: { en: "Whole syllables / 整体认读", zh: "整体认读音节 / Whole syllables" },
        items: [
          ["zhi", "zhi", "Read as one whole syllable", "", "zhi1.mp3"],
          ["chi", "chi", "Read as one whole syllable", "", "chi1.mp3"],
          ["shi", "shi", "Read as one whole syllable", "", "shi1.mp3"],
          ["ri", "ri", "Read as one whole syllable", "", "ri1.mp3"],
          ["zi", "zi", "Read as one whole syllable", "", "zi1.mp3"],
          ["ci", "ci", "Read as one whole syllable", "", "ci1.mp3"],
          ["si", "si", "Read as one whole syllable", "", "si1.mp3"],
          ["yi", "yi", "Read as one whole syllable", "", "yi1.mp3"],
          ["wu", "wu", "Read as one whole syllable", "", "wu1.mp3"],
          ["yu", "yu", "Read as one whole syllable", "", "yu1.mp3"],
          ["ye", "ye", "Read as one whole syllable", "", "ye1.mp3"],
          ["yue", "yue", "Read as one whole syllable", "", "yue1.mp3"],
          ["yuan", "yuan", "Read as one whole syllable", "", "yuan1.mp3"],
          ["yin", "yin", "Read as one whole syllable", "", "yin1.mp3"],
          ["yun", "yun", "Read as one whole syllable", "", "yun1.mp3"],
          ["ying", "ying", "Read as one whole syllable", "", "ying1.mp3"]
        ]
      }
    ]
  },
  {
    id: "daily",
    title: { en: "Useful Daily Chinese Phrases", zh: "常用生活口语" },
    intro: {
      en: "Practical phrases for restaurants, shopping, directions, transportation, and classroom communication.",
      zh: "覆盖餐厅、购物、问路、交通和课堂交流的高频实用口语。"
    },
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
    groups: [
      {
        label: { en: "Classroom Chinese", zh: "课堂中文" },
        items: [
          ["请再说一遍", "qǐng zài shuō yí biàn", "Please say it again"],
          ["我不明白", "wǒ bù míng bai", "I do not understand"],
          ["我会说一点中文", "wǒ huì shuō yì diǎn zhōng wén", "I can speak a little Chinese"],
          ["这个怎么读？", "zhè ge zěn me dú?", "How do you read this?"],
          ["这个是什么意思？", "zhè ge shì shén me yì si?", "What does this mean?"],
          ["我准备好了", "wǒ zhǔn bèi hǎo le", "I am ready"]
        ]
      },
      {
        label: { en: "Food and shopping", zh: "吃饭与购物" },
        items: [
          ["我要这个", "wǒ yào zhè ge", "I want this one"],
          ["多少钱？", "duō shǎo qián?", "How much is it?"],
          ["太贵了", "tài guì le", "It is too expensive"],
          ["可以便宜一点吗？", "kě yǐ pián yi yì diǎn ma?", "Can it be a little cheaper?"],
          ["我不要辣", "wǒ bú yào là", "I do not want spicy food"],
          ["买单，谢谢", "mǎi dān, xiè xie", "The bill, please"]
        ]
      },
      {
        label: { en: "Directions and transport", zh: "问路与交通" },
        items: [
          ["洗手间在哪里？", "xǐ shǒu jiān zài nǎ lǐ?", "Where is the restroom?"],
          ["地铁站在哪里？", "dì tiě zhàn zài nǎ lǐ?", "Where is the subway station?"],
          ["请问怎么去这里？", "qǐng wèn zěn me qù zhè lǐ?", "How do I get here?"],
          ["我要去机场", "wǒ yào qù jī chǎng", "I want to go to the airport"],
          ["请开慢一点", "qǐng kāi màn yì diǎn", "Please drive a little slower"],
          ["到了请告诉我", "dào le qǐng gào su wǒ", "Please tell me when we arrive"]
        ]
      },
      {
        label: { en: "Needs and feelings", zh: "需求与感受" },
        items: [
          ["我需要帮助", "wǒ xū yào bāng zhù", "I need help"],
          ["我有点累", "wǒ yǒu diǎn lèi", "I am a little tired"],
          ["我很开心", "wǒ hěn kāi xīn", "I am happy"],
          ["没问题", "méi wèn tí", "No problem"],
          ["请等一下", "qǐng děng yí xià", "Please wait a moment"],
          ["我们可以开始吗？", "wǒ men kě yǐ kāi shǐ ma?", "Can we start?"]
        ]
      }
    ]
  },
  {
    id: "kids",
    title: { en: "Chinese Starter Words for Kids", zh: "儿童中文启蒙词汇" },
    intro: {
      en: "Concrete, image-friendly starter words for young learners. Great for flashcards, games, and picture-book reading.",
      zh: "适合低龄儿童的具象启蒙词汇，可用于闪卡、游戏和绘本共读。"
    },
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    groups: [
      {
        label: { en: "Family", zh: "家庭成员" },
        items: [
          ["爸爸", "bà ba", "Dad"],
          ["妈妈", "mā ma", "Mom"],
          ["哥哥", "gē ge", "Older brother"],
          ["姐姐", "jiě jie", "Older sister"],
          ["弟弟", "dì di", "Younger brother"],
          ["妹妹", "mèi mei", "Younger sister"]
        ]
      },
      {
        label: { en: "Animals", zh: "动物" },
        items: [
          ["猫", "māo", "Cat"],
          ["狗", "gǒu", "Dog"],
          ["鱼", "yú", "Fish"],
          ["鸟", "niǎo", "Bird"],
          ["兔子", "tù zi", "Rabbit"],
          ["熊猫", "xióng māo", "Panda"]
        ]
      },
      {
        label: { en: "Colors and numbers", zh: "颜色与数字" },
        items: [
          ["红色", "hóng sè", "Red"],
          ["蓝色", "lán sè", "Blue"],
          ["绿色", "lǜ sè", "Green"],
          ["黄色", "huáng sè", "Yellow"],
          ["一二三", "yī èr sān", "One, two, three"],
          ["四五六", "sì wǔ liù", "Four, five, six"]
        ]
      },
      {
        label: { en: "Daily objects", zh: "日常物品" },
        items: [
          ["书", "shū", "Book"],
          ["笔", "bǐ", "Pen"],
          ["水", "shuǐ", "Water"],
          ["苹果", "píng guǒ", "Apple"],
          ["球", "qiú", "Ball"],
          ["玩具", "wán jù", "Toy"]
        ]
      }
    ]
  }
] as Resource[];

export const resourceLinks = resourceLibrary.map((resource) => ({
  id: resource.id,
  href: `/resources/${resource.id}`,
  title: resource.title,
  intro: resource.intro,
  image: resource.image
}));

export function getResourceById(id: string) {
  return resourceLibrary.find((resource) => resource.id === id);
}
