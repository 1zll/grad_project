export type Task = {
  title: string

  sub: string

  date: string

  done: boolean
}

export type Company = {
  name: string

  status: string

  salary: number

  role: string

  environment: number

  growth: number

  preference: number

  industry?: string

  url?: string

  employees?: number

  averageAge?: number

  location?: string

  established?: string

  capital?: string

  revenue?: string

  workHours?: string

  holidays?: string

  hiringCount?: number

  business?: string
}

export type CalendarEvent = {
  id: string

  company: string

  title: string

  type: string

  date: string

  start: string

  end: string

  summary: string
}

export type SelectionRecord = CalendarEvent & {
  contact: string

  notes: string

  interview: string

  period: string

  activities: string

  reflection: string

  test: string
}

export type ProfileSection = {
  title: string

  summary: string

  details: string
}

export type ProfileDetails = {
  birthDate: string

  email: string

  address: string

  education: string

  qualifications: string

  sections: ProfileSection[]
}

export type AppState = {
  profile: string

  profileDetails: ProfileDetails

  tasks: Task[]

  companies: Company[]

  events: CalendarEvent[]

  records: SelectionRecord[]

  templates: string[]
}

export const initialState: AppState = {
  profile: "岩崎 太郎",

  profileDetails: {
    birthDate: "2006-07-08",
    email: "test@example.com",
    address: "〒231-8588\n神奈川県横浜市中区日本大通1",
    education:
      "20xx年 3月　横浜市立〇〇中学校　卒業\n20xx年 4月　神奈川県立〇〇高校 普通科　入学\n20xx年 3月　神奈川県立〇〇高校 普通科　卒業\n20xx年 4月　みらい情報専門学校 システム開発学科　入学\n20xx年 3月　みらい情報専門学校 システム開発学科　卒業見込み",
    qualifications:
      "20xx年 10月　ITパスポート試験　合格\n20xx年 6月　日商簿記検定試験 3級　合格\n20xx年 11月　基本情報技術者試験　合格\n20xx年 1月　Oracle Certified Java Programmer, Silver　合格\n20xx年 3月　Microsoft Office Specialist (MOS) Excel 365　合格\n20xx年 9月　普通自動車第一種運転免許　取得",
    sections: [
      {
        title: "ガクチカ",
        summary: "チーム開発を通じて、課題解決に取り組みました。",
        details:
          "メンバーと対話を重ね、課題を細分化して進捗を共有しました。役割分担を工夫し、目標としていたサービスを完成させました。",
      },
      {
        title: "強み",
        summary: "周囲と協力しながら、最後までやり遂げる力です。",
        details:
          "意見が分かれたときも一人ひとりの考えを聞き、共通の目標を確認してから行動することを大切にしています。",
      },
      {
        title: "弱み",
        summary: "慎重になり、判断に時間がかかることがあります。",
        details:
          "優先順位と期限を先に決め、小さく試して早めに相談することで、考え込みすぎないよう改善しています。",
      },
      {
        title: "現在籍を置いている学校への進学理由",
        summary:
          "実践的な学びを通じて、ITの基礎を身につけたいと考えたためです。",
        details:
          "プログラミングやシステム開発を基礎から学び、チームでの制作経験を積める環境に魅力を感じて進学しました。",
      },
      {
        title: "エンジニア志望理由",
        summary: "技術で身近な課題を解決できることに魅力を感じています。",
        details:
          "学習やチーム開発を通じて、アイデアを形にし、使う人の役に立つものを作ることにやりがいを感じました。",
      },
      {
        title: "就活の軸",
        summary: "成長できる環境で、チームと協力して価値を届けることです。",
        details:
          "学び続けられること、相談しながら挑戦できること、利用者の課題解決に向き合えることを大切にしています。",
      },
    ],
  },

  tasks: [
    {
      title: "サイボウズのESを提出する",
      sub: "エントリーシート",
      date: "今日まで",
      done: false,
    },

    { title: "Sansanの面接対策", sub: "面接準備", date: "11/06", done: false },

    {
      title: "マイナビの適性検査",
      sub: "適性検査",
      date: "11/07",
      done: false,
    },

    {
      title: "自己PRをブラッシュアップ",
      sub: "自己分析",
      date: "11/08",
      done: true,
    },
  ],

  companies: [
    {
      name: "Sansan",
      status: "二次面接",
      salary: 320000,
      role: "エンジニア職",
      environment: 8,
      growth: 9,
      preference: 9,
    },

    {
      name: "サイボウズ",
      status: "一次面接",
      salary: 300000,
      role: "エンジニア職",
      environment: 9,
      growth: 9,
      preference: 8,
    },

    {
      name: "Sky",
      status: "エントリー",
      salary: 270000,
      role: "システムエンジニア",
      environment: 7,
      growth: 8,
      preference: 7,
    },

    {
      name: "マイナビ",
      status: "説明会",
      salary: 250000,
      role: "開発職",
      environment: 8,
      growth: 8,
      preference: 7,
    },

    {
      name: "コナミ",
      status: "ES提出",
      salary: 280000,
      role: "プログラマー",
      environment: 7,
      growth: 9,
      preference: 8,
    },
  ],

  events: [
    {
      id: "event-1",
      company: "Sansan",
      title: "二次面接",
      type: "面接",
      date: "2026-11-05",
      start: "15:00",
      end: "16:30",
      summary: "個人面接・オンライン",
    },

    {
      id: "event-2",
      company: "コナミ",
      title: "会社説明会",
      type: "説明会",
      date: "2026-11-05",
      start: "18:00",
      end: "19:30",
      summary: "事業内容と職場環境について",
    },

    {
      id: "event-3",
      company: "マイナビ",
      title: "説明会・座談会",
      type: "説明会",
      date: "2026-11-06",
      start: "13:00",
      end: "15:00",
      summary: "若手社員との座談会",
    },

    {
      id: "event-4",
      company: "Sky",
      title: "SE体験ワーク",
      type: "インターン",
      date: "2026-11-07",
      start: "10:00",
      end: "13:00",
      summary: "チームで課題を分析しシステムを提案",
    },

    {
      id: "event-5",
      company: "サイボウズ",
      title: "一次面接",
      type: "面接",
      date: "2026-11-08",
      start: "12:00",
      end: "13:30",
      summary: "自己紹介・志望理由",
    },
  ],

  records: [
    {
      id: "record-1",
      company: "マイナビ",
      title: "説明会",
      type: "説明会",
      date: "2026-11-06",
      start: "13:00",
      end: "15:00",
      summary: "事業内容と働き方について理解を深める。",

      contact: "採用担当（人事部）",
      notes: "若手社員との座談会で、研修制度やチームでの働き方を質問する。",

      interview: "個人面接",
      period: "",
      activities: "",
      reflection: "",
      test: "SPI",
    },

    {
      id: "record-2",
      company: "Sky",
      title: "SE体験ワーク",
      type: "インターンシップ",
      date: "2026-11-07",
      start: "10:00",
      end: "13:00",
      summary: "チームで課題を分析し、システムの提案を行う。",

      contact: "",
      notes: "",
      interview: "個人面接",
      period: "3日間",
      activities: "チームで課題を分析して提案を作成",
      reflection: "",
      test: "SPI",
    },

    {
      id: "record-3",
      company: "サイボウズ",
      title: "一次面接",
      type: "面接",
      date: "2026-11-08",
      start: "12:00",
      end: "13:30",
      summary: "自己紹介・学生時代に力を入れたこと・志望理由",

      contact: "採用担当（人事部）",
      notes: "自己紹介・学生時代に力を入れたこと・志望理由",

      interview: "個人面接",
      period: "",
      activities: "",
      reflection: "",
      test: "SPI",
    },
  ],

  templates: [
    "学生時代に力を入れたのは、チームでのアプリケーション開発です。メンバーと対話を重ね、一人ひとりの強みを活かす役割分担を行いました。課題を細分化して進捗を共有することで、目標としていたサービスを完成させることができました。この経験から、周囲を巻き込みながら課題を解決する大切さを学びました。",

    "学生時代に力を入れたのは、チームでのアプリケーション開発です。メンバーと対話を重ね、課題を細分化して進捗を共有しました。その結果、目標のサービスを完成させ、周囲と協力して課題を解決する大切さを学びました。",

    "チーム開発を通じて、課題の発見から解決まで主体的に取り組みました。",
  ],
}

export const eventTypes = [
  "説明会",
  "インターンシップ",
  "面接",
  "面談",
  "適性検査",
]

export const companyStatuses = [
  "エントリー",
  "説明会",
  "ES提出",
  "適性検査",
  "一次面接",
  "二次面接",
  "最終面接",
  "内定",
  "不合格",
]
