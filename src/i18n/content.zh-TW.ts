import type contentEn from 'src/i18n/content.en'

/** Traditional Chinese copy for mock-data content. Shape mirrors content.en. */
const content: typeof contentEn = {
  perks: {
    allSessions: '所有場次',
    keynoteAccess: '主題演講入場',
    lunchIncluded: '含午餐',
    vipLounge: 'VIP 貴賓室',
    speakerMeetGreet: '講者見面會',
    workshopDiscount: '工作坊 9 折',
  },
  tracks: {
    main: '主場',
    frontend: '前端',
    backend: '後端',
    devops: 'DevOps',
  },
  tickets: {
    general: { name: '一般', description: '可參加所有場次與主題演講' },
    vip: { name: 'VIP', description: '頂級體驗，享專屬禮遇' },
    student: { name: '學生', description: '憑有效學生證享優惠價' },
  },
  sessions: {
    s1: { title: '開幕主題演講：Web 平台的未來', speakerTitle: '工程副總, WebCorp' },
    s2: { title: 'Vue.js 進階模式', speakerTitle: '核心團隊, Vue.js' },
    s3: { title: '用 Node.js 打造可擴展 API', speakerTitle: '資深工程師, CloudScale' },
    s4: { title: '現代 CSS：超越 Tailwind', speakerTitle: '設計系統主管, DesignLab' },
    s5: { title: '資料庫效能調校', speakerTitle: '資料庫管理員, DataForge' },
    s6: { title: '真正可用的 CI/CD 流水線', speakerTitle: 'DevOps 架構師, ShipFast' },
    s7: { title: '第二天主題演講：AI 輔助開發', speakerTitle: '技術長, CodeAssist AI' },
    s8: { title: '2028 年的狀態管理', speakerTitle: 'Staff 工程師, FrontEnd Co' },
    s9: { title: '微服務通訊模式', speakerTitle: '架構師, ScaleUp Inc' },
    s10: { title: '前端應用的可觀測性', speakerTitle: '監控主管, ObserveAll' },
    s11: { title: '無障礙設計深入解析', speakerTitle: '無障礙專家, InclusiveWeb' },
    s12: { title: '使用 Cloudflare Workers 的邊緣運算', speakerTitle: '開發者倡導者, Cloudflare' },
  },
  addons: {
    ws1: { name: 'Vue.js 測試實戰', description: '使用 Vitest 與 Vue Test Utils 撰寫單元與元件測試。請自備筆電。' },
    ws2: { name: '前端工程師的 Docker 與 Kubernetes', description: '從零開始將應用容器化並部署到 Kubernetes。' },
    meal1: { name: '標準午餐（兩日）', description: '自助式午餐，提供素食與全素選項。' },
    meal2: { name: '頂級晚宴 — 第一天交流活動', description: '頂樓場地三道式晚宴，含 open bar 與現場音樂。' },
    merch1: { name: '大會 T 恤', description: '100% 有機棉，WebDev Summit 2028 限定版。' },
    merch2: { name: '開發者貼紙包', description: '12 張雷射全息開發者貼紙組。' },
    merch3: { name: '保溫水瓶', description: '不鏽鋼 500ml，雷射雕刻 logo。' },
    merch4: { name: '筆電保護套（15 吋）', description: '潛水布材質，印有大會品牌。' },
  },
}

export default content
