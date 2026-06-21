/**
 * English copy for mock-data content (tickets / sessions / add-ons), keyed by
 * entity id. The mock files are provided and must not be edited, so their
 * user-facing text is mirrored here and resolved by id at render time.
 */
export default {
  perks: {
    allSessions: 'All sessions',
    keynoteAccess: 'Keynote access',
    lunchIncluded: 'Lunch included',
    vipLounge: 'VIP lounge',
    speakerMeetGreet: 'Speaker meet & greet',
    workshopDiscount: '10% off workshops',
  },
  tracks: {
    main: 'Main',
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
  },
  tickets: {
    general: { name: 'General', description: 'Access to all sessions and keynotes' },
    vip: { name: 'VIP', description: 'Premium experience with exclusive perks' },
    student: { name: 'Student', description: 'Discounted rate for students with valid ID' },
  },
  sessions: {
    s1: { title: 'Opening Keynote: The Future of the Web Platform', speakerTitle: 'VP of Engineering, WebCorp' },
    s2: { title: 'Advanced Vue.js Patterns', speakerTitle: 'Core Team, Vue.js' },
    s3: { title: 'Building Scalable APIs with Node.js', speakerTitle: 'Senior Engineer, CloudScale' },
    s4: { title: 'Modern CSS: Beyond Tailwind', speakerTitle: 'Design Systems Lead, DesignLab' },
    s5: { title: 'Database Performance Tuning', speakerTitle: 'DBA, DataForge' },
    s6: { title: 'CI/CD Pipelines That Actually Work', speakerTitle: 'DevOps Architect, ShipFast' },
    s7: { title: 'Day 2 Keynote: AI-Assisted Development', speakerTitle: 'CTO, CodeAssist AI' },
    s8: { title: 'State Management in 2028', speakerTitle: 'Staff Engineer, FrontEnd Co' },
    s9: { title: 'Microservices Communication Patterns', speakerTitle: 'Architect, ScaleUp Inc' },
    s10: { title: 'Observability for Frontend Apps', speakerTitle: 'Monitoring Lead, ObserveAll' },
    s11: { title: 'Accessibility Deep Dive', speakerTitle: 'A11y Specialist, InclusiveWeb' },
    s12: { title: 'Edge Computing with Cloudflare Workers', speakerTitle: 'Developer Advocate, Cloudflare' },
  },
  addons: {
    ws1: { name: 'Hands-on Vue.js Testing', description: 'Write unit and component tests with Vitest and Vue Test Utils. Bring your laptop.' },
    ws2: { name: 'Docker & Kubernetes for Frontend Devs', description: 'Containerize your apps and deploy to Kubernetes from scratch.' },
    meal1: { name: 'Standard Lunch (Both Days)', description: 'Buffet lunch with vegetarian and vegan options.' },
    meal2: { name: 'Premium Dinner — Day 1 Networking Event', description: 'Three-course dinner at rooftop venue with open bar and live music.' },
    merch1: { name: 'Conference T-Shirt', description: '100% organic cotton, WebDev Summit 2028 edition.' },
    merch2: { name: 'Developer Sticker Pack', description: 'Set of 12 holographic developer stickers.' },
    merch3: { name: 'Insulated Water Bottle', description: 'Stainless steel, 500ml, laser-engraved logo.' },
    merch4: { name: 'Laptop Sleeve (15")', description: 'Neoprene sleeve with conference branding.' },
  },
}
