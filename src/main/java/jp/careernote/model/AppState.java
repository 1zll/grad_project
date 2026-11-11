package jp.careernote.model;

import java.util.ArrayList;
import java.util.List;

public class AppState {
    public String profile;
    public ProfileDetails profileDetails;
    public List<Task> tasks;
    public List<Company> companies;
    public List<CalendarEvent> events;
    public List<SelectionRecord> records;
    public List<String> templates;

    public AppState() {
        profile = "岩崎 太郎";
        profileDetails = new ProfileDetails();
        tasks = new ArrayList<>();
        companies = new ArrayList<>();
        events = new ArrayList<>();
        records = new ArrayList<>();
        templates = new ArrayList<>();
    }

    public static AppState demo() {
        AppState state = new AppState();
        state.tasks.add(new Task("サイボウズのESを提出する", "エントリーシート", "今日まで", false));
        state.tasks.add(new Task("Sansanの面接対策", "面接準備", "11/06", false));
        state.tasks.add(new Task("マイナビの適性検査", "適性検査", "11/07", false));
        state.tasks.add(new Task("自己PRをブラッシュアップ", "自己分析", "11/08", true));

        state.companies.add(new Company("Sansan", "二次面接", 320000, "エンジニア職", 8, 9, 9));
        state.companies.add(new Company("サイボウズ", "一次面接", 300000, "エンジニア職", 9, 9, 8));
        state.companies.add(new Company("Sky", "エントリー", 270000, "システムエンジニア", 7, 8, 7));
        state.companies.add(new Company("マイナビ", "説明会", 250000, "開発職", 8, 8, 7));
        state.companies.add(new Company("コナミ", "ES提出", 280000, "プログラマー", 7, 9, 8));

        state.events.add(new CalendarEvent("event-1", "Sansan", "二次面接", "面接", "2026-11-05", "15:00", "16:30", "個人面接・オンライン"));
        state.events.add(new CalendarEvent("event-2", "コナミ", "会社説明会", "説明会", "2026-11-05", "18:00", "19:30", "事業内容と職場環境について"));
        state.events.add(new CalendarEvent("event-3", "マイナビ", "説明会・座談会", "説明会", "2026-11-06", "13:00", "15:00", "若手社員との座談会"));
        state.events.add(new CalendarEvent("event-4", "Sky", "SE体験ワーク", "インターン", "2026-11-07", "10:00", "13:00", "チームで課題を分析しシステムを提案"));
        state.events.add(new CalendarEvent("event-5", "サイボウズ", "一次面接", "面接", "2026-11-08", "12:00", "13:30", "自己紹介・志望理由"));

        state.records.add(new SelectionRecord(
                "record-1", "マイナビ", "説明会", "説明会", "2026-11-06", "13:00", "15:00",
                "事業内容と働き方について理解を深める。", "採用担当（人事部）",
                "若手社員との座談会で、研修制度やチームでの働き方を質問する。",
                "個人面接", "", "", "", "SPI"));
        state.records.add(new SelectionRecord(
                "record-2", "Sky", "SE体験ワーク", "インターンシップ", "2026-11-07", "10:00", "13:00",
                "チームで課題を分析し、システムの提案を行う。", "", "",
                "個人面接", "3日間", "チームで課題を分析して提案を作成", "", "SPI"));
        state.records.add(new SelectionRecord(
                "record-3", "サイボウズ", "一次面接", "面接", "2026-11-08", "12:00", "13:30",
                "自己紹介・学生時代に力を入れたこと・志望理由", "採用担当（人事部）",
                "自己紹介・学生時代に力を入れたこと・志望理由",
                "個人面接", "", "", "", "SPI"));

        state.templates.add("学生時代に力を入れたのは、チームでのアプリケーション開発です。メンバーと対話を重ね、一人ひとりの強みを活かす役割分担を行いました。課題を細分化して進捗を共有することで、目標としていたサービスを完成させることができました。この経験から、周囲を巻き込みながら課題を解決する大切さを学びました。");
        state.templates.add("学生時代に力を入れたのは、チームでのアプリケーション開発です。メンバーと対話を重ね、課題を細分化して進捗を共有しました。その結果、目標のサービスを完成させ、周囲と協力して課題を解決する大切さを学びました。");
        state.templates.add("チーム開発を通じて、課題の発見から解決まで主体的に取り組みました。");
        return state;
    }

    public static class ProfileDetails {
        public String birthDate;
        public String email;
        public String address;
        public String education;
        public String qualifications;
        public List<ProfileSection> sections;

        public ProfileDetails() {
            birthDate = "2006-07-08";
            email = "test@example.com";
            address = "〒231-8588\n神奈川県横浜市中区日本大通1";
            education = "20xx年 3月　横浜市立〇〇中学校　卒業\n"
                    + "20xx年 4月　神奈川県立〇〇高校 普通科　入学\n"
                    + "20xx年 3月　神奈川県立〇〇高校 普通科　卒業\n"
                    + "20xx年 4月　みらい情報専門学校 システム開発学科　入学\n"
                    + "20xx年 3月　みらい情報専門学校 システム開発学科　卒業見込み";
            qualifications = "20xx年 10月　ITパスポート試験　合格\n"
                    + "20xx年 6月　日商簿記検定試験 3級　合格\n"
                    + "20xx年 11月　基本情報技術者試験　合格\n"
                    + "20xx年 1月　Oracle Certified Java Programmer, Silver　合格\n"
                    + "20xx年 3月　Microsoft Office Specialist (MOS) Excel 365　合格\n"
                    + "20xx年 9月　普通自動車第一種運転免許　取得";
            sections = new ArrayList<>();
            sections.add(new ProfileSection("ガクチカ",
                    "チーム開発を通じて、課題解決に取り組みました。",
                    "メンバーと対話を重ね、課題を細分化して進捗を共有しました。役割分担を工夫し、目標としていたサービスを完成させました。"));
            sections.add(new ProfileSection("強み",
                    "周囲と協力しながら、最後までやり遂げる力です。",
                    "意見が分かれたときも一人ひとりの考えを聞き、共通の目標を確認してから行動することを大切にしています。"));
            sections.add(new ProfileSection("弱み",
                    "慎重になり、判断に時間がかかることがあります。",
                    "優先順位と期限を先に決め、小さく試して早めに相談することで、考え込みすぎないよう改善しています。"));
            sections.add(new ProfileSection("現在籍を置いている学校への進学理由",
                    "実践的な学びを通じて、ITの基礎を身につけたいと考えたためです。",
                    "プログラミングやシステム開発を基礎から学び、チームでの制作経験を積める環境に魅力を感じて進学しました。"));
            sections.add(new ProfileSection("エンジニア志望理由",
                    "技術で身近な課題を解決できることに魅力を感じています。",
                    "学習やチーム開発を通じて、アイデアを形にし、使う人の役に立つものを作ることにやりがいを感じました。"));
            sections.add(new ProfileSection("就活の軸",
                    "成長できる環境で、チームと協力して価値を届けることです。",
                    "学び続けられること、相談しながら挑戦できること、利用者の課題解決に向き合えることを大切にしています。"));
        }
    }

    public static class ProfileSection {
        public String title;
        public String summary;
        public String details;

        public ProfileSection() {}

        public ProfileSection(String title, String summary, String details) {
            this.title = title;
            this.summary = summary;
            this.details = details;
        }
    }

    public static class Task {
        public String title;
        public String sub;
        public String date;
        public boolean done;

        public Task() {}

        public Task(String title, String sub, String date, boolean done) {
            this.title = title;
            this.sub = sub;
            this.date = date;
            this.done = done;
        }
    }

    public static class Company {
        public String name;
        public String status;
        public int salary;
        public String role;
        public int environment;
        public int growth;
        public int preference;
        public String industry;
        public String url;
        public Integer employees;
        public Integer averageAge;
        public String location;
        public String established;
        public String capital;
        public String revenue;
        public String workHours;
        public String holidays;
        public Integer hiringCount;
        public String business;

        public Company() {}

        public Company(String name, String status, int salary, String role, int environment, int growth, int preference) {
            this.name = name;
            this.status = status;
            this.salary = salary;
            this.role = role;
            this.environment = environment;
            this.growth = growth;
            this.preference = preference;
        }
    }

    public static class CalendarEvent {
        public String id;
        public String company;
        public String title;
        public String type;
        public String date;
        public String start;
        public String end;
        public String summary;

        public CalendarEvent() {}

        public CalendarEvent(String id, String company, String title, String type, String date, String start, String end, String summary) {
            this.id = id;
            this.company = company;
            this.title = title;
            this.type = type;
            this.date = date;
            this.start = start;
            this.end = end;
            this.summary = summary;
        }
    }

    public static class SelectionRecord extends CalendarEvent {
        public String contact;
        public String notes;
        public String interview;
        public String period;
        public String activities;
        public String reflection;
        public String test;

        public SelectionRecord() {}

        public SelectionRecord(String id, String company, String title, String type, String date, String start, String end,
                              String summary, String contact, String notes, String interview, String period,
                              String activities, String reflection, String test) {
            super(id, company, title, type, date, start, end, summary);
            this.contact = contact;
            this.notes = notes;
            this.interview = interview;
            this.period = period;
            this.activities = activities;
            this.reflection = reflection;
            this.test = test;
        }
    }
}
