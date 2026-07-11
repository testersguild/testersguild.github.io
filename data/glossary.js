window.TG_GLOSSARY = {
  pt: [
    { term: "QA (Quality Assurance)", def: "Prática de garantir qualidade do software por processos, testes e melhoria contínua." },
    { term: "Teste manual", def: "Execução de cenários por um humano, sem automação — essencial para exploratório e UX." },
    { term: "Automação de testes", def: "Scripts que executam verificações repetíveis. Ideal para regressão, não substitui tudo." },
    { term: "Bug / Defeito", def: "Comportamento diferente do esperado. Documente passos, esperado vs atual e evidências." },
    { term: "Regressão", def: "Verificar se mudanças novas quebraram funcionalidades que já funcionavam." },
    { term: "E2E (End-to-End)", def: "Teste do fluxo completo do usuário, do início ao fim (ex.: login → compra)." },
    { term: "API", def: "Interface para sistemas se comunicarem. Testar API = validar requests, responses e contratos." },
    { term: "CI/CD", def: "Integração e entrega contínuas. Testes rodam automaticamente a cada commit ou deploy." },
    { term: "BDD / Gherkin", def: "Escrever comportamentos em linguagem legível (Given/When/Then) alinhando negócio e tech." },
    { term: "Flaky test", def: "Teste instável que passa e falha sem mudança de código. Inimigo #1 de pipelines." },
    { term: "Page Object Model", def: "Padrão que encapsula elementos de página em classes — facilita manutenção." },
    { term: "Shift-left", def: "Testar cedo no ciclo (requisitos, design), não só no final." },
    { term: "OWASP", def: "Referência global em segurança de aplicações. OWASP Top 10 lista riscos críticos." },
    { term: "WCAG", def: "Padrão web de acessibilidade. Nível AA é o alvo comum em produtos." },
    { term: "Performance / Carga", def: "Como o sistema se comporta sob muitos usuários. Métricas: latência, throughput, erros." },
    { term: "Smoke test", def: "Suite mínima e rápida que valida se o build básico funciona." },
    { term: "Pirâmide de testes", def: "Muitos unitários na base, menos E2E no topo — equilíbrio entre velocidade e confiança." },
    { term: "DoD (Definition of Done)", def: "Critérios para considerar uma história pronta — inclui testes e qualidade." },
  ],
  en: [
    { term: "QA (Quality Assurance)", def: "Practice of ensuring software quality through processes, testing, and continuous improvement." },
    { term: "Manual testing", def: "Running scenarios by a human without automation — essential for exploratory and UX testing." },
    { term: "Test automation", def: "Scripts that run repeatable checks. Great for regression, does not replace everything." },
    { term: "Bug / Defect", def: "Behavior different from expected. Document steps, expected vs actual, and evidence." },
    { term: "Regression", def: "Checking whether new changes broke features that already worked." },
    { term: "E2E (End-to-End)", def: "Testing the full user flow start to finish (e.g. login → purchase)." },
    { term: "API", def: "Interface for systems to communicate. API testing validates requests, responses, and contracts." },
    { term: "CI/CD", def: "Continuous integration and delivery. Tests run automatically on every commit or deploy." },
    { term: "BDD / Gherkin", def: "Writing behaviors in readable language (Given/When/Then) aligning business and tech." },
    { term: "Flaky test", def: "Unstable test that passes and fails without code changes. Pipeline enemy #1." },
    { term: "Page Object Model", def: "Pattern encapsulating page elements in classes — easier maintenance." },
    { term: "Shift-left", def: "Testing early in the cycle (requirements, design), not only at the end." },
    { term: "OWASP", def: "Global app security reference. OWASP Top 10 lists critical risks." },
    { term: "WCAG", def: "Web accessibility standard. Level AA is the common product target." },
    { term: "Performance / Load", def: "How the system behaves under many users. Metrics: latency, throughput, errors." },
    { term: "Smoke test", def: "Minimal fast suite validating the basic build works." },
    { term: "Test pyramid", def: "Many unit tests at the base, fewer E2E at the top — balance speed and confidence." },
    { term: "DoD (Definition of Done)", def: "Criteria for a story to be done — includes tests and quality." },
  ],
};

window.TG_ROADMAPS = {
  beginner: {
    pt: {
      title: "Rota do Recruta",
      desc: "Zero experiência? Siga esta ordem. Cada passo constrói a base para o próximo.",
      steps: [
        { trackId: "starter", label: "1. Iniciação da Guilda", why: "Fundamentos, tipos de teste, bugs, Agile" },
        { trackId: "starter", lessonId: "s10-l3", label: "2. Primeiro teste automatizado", why: "Playwright Hello World — seu primeiro script verde" },
        { trackId: "web", label: "3. Forja Frontend", why: "Cypress ou Playwright com profundidade" },
        { trackId: "api", label: "4. Oficina de Integração", why: "APIs são requisito em quase toda vaga" },
      ],
    },
    en: {
      title: "Recruit Route",
      desc: "Zero experience? Follow this order. Each step builds on the last.",
      steps: [
        { trackId: "starter", label: "1. Guild Initiation", why: "Fundamentals, test types, bugs, Agile" },
        { trackId: "starter", lessonId: "s10-l3", label: "2. First automated test", why: "Playwright Hello World — your first green script" },
        { trackId: "web", label: "3. Frontend Forge", why: "Cypress or Playwright in depth" },
        { trackId: "api", label: "4. Integration Workshop", why: "APIs are required in almost every job posting" },
      ],
    },
  },
  senior: {
    pt: {
      title: "Rota do Mestre",
      desc: "Para QAs plenos/sênior que querem arquitetura, escala e liderança técnica.",
      steps: [
        { trackId: "leadership", label: "1. Maestria da Guilda", why: "Estratégia, métricas, cultura de qualidade" },
        { trackId: "performance", label: "2. Arena de Carga", why: "SLAs, gargalos, performance em CI" },
        { trackId: "security", label: "3. Sentinela de Segurança", why: "Shift-left security e OWASP na prática" },
        { trackId: "devops", label: "4. Artesanato de Pipeline", why: "Quality gates, Docker, Allure em escala" },
      ],
    },
    en: {
      title: "Master Route",
      desc: "For mid/senior QAs seeking architecture, scale, and technical leadership.",
      steps: [
        { trackId: "leadership", label: "1. Guild Mastery", why: "Strategy, metrics, quality culture" },
        { trackId: "performance", label: "2. Load Arena", why: "SLAs, bottlenecks, performance in CI" },
        { trackId: "security", label: "3. Security Sentinel", why: "Shift-left security and OWASP in practice" },
        { trackId: "devops", label: "4. Pipeline Craft", why: "Quality gates, Docker, Allure at scale" },
      ],
    },
  },
};
