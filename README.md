# Testers Guild QA Course

Plataforma **100% gratuita** de formação em Qualidade de Software — pensada para **iniciantes** e com profundidade para **seniors**.

📁 **Pasta:** `/home/kaiorampz/Desktop/Testers-Guild-QA/`

## Para quem é?

| Perfil | O que usar |
|--------|------------|
| **Iniciante** | Selecione perfil 🌱 → Rota do Recruta → Glossário → aulas com "Comece por aqui" |
| **Intermediário** | Trilhas técnicas (Web, API, Mobile, DevOps) |
| **Sênior** | Rota do Mestre → Maestria da Guilda → notas "Guild Master" em cada aula |

## Trilhas da Guilda (9)

| Trilha | Público | Foco |
|--------|---------|------|
| Iniciação da Guilda | Iniciante | Fundamentos, BDD, Git, primeira automação |
| Forja Frontend | Intermediário | Cypress, Playwright, Selenium |
| Oficina de Integração | Intermediário | REST, Postman, contratos |
| Laboratório Mobile | Intermediário | Appium, WebdriverIO |
| Arena de Carga | Sênior | JMeter, K6, SLAs |
| Sentinela de Segurança | Intermediário+ | OWASP, ZAP, SQLi/XSS |
| Artesanato de Pipeline | Intermediário+ | CI/CD, Docker, Allure |
| Testes Inclusivos | Intermediário | WCAG, axe-core, a11y |
| Maestria da Guilda | Sênior | Estratégia, liderança, escala |

## Funcionalidades

- **Perfil do aluno** — Iniciante / Intermediário / Sênior (reordena trilhas recomendadas)
- **Rotas curadas** — Rota do Recruta e Rota do Mestre
- **Glossário QA** — 18 termos explicados (PT/EN)
- **Dual content** — 🌱 dicas para iniciantes + 👑 notas Guild Master por aula
- **Badges de nível** — Iniciante / Intermediário / Avançado em cada aula
- **PT ↔ ENG** — botão no header
- **Progresso local** — sem cadastro

## Como abrir

```bash
xdg-open /home/kaiorampz/Desktop/Testers-Guild-QA/index.html
```

Ou:

```bash
cd /home/kaiorampz/Desktop/Testers-Guild-QA && python3 -m http.server 8080
```

## Estrutura

```
Testers-Guild-QA/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js
│   └── i18n.js
└── data/
    ├── tracks.js              # 9 trilhas, 151 aulas
    ├── translations-en.js     # Traduções EN
    ├── lesson-enrichment.js   # Tier + dicas iniciante/sênior
    └── glossary.js            # Glossário + rotas
```

## Próximas melhorias sugeridas

- Exercícios práticos interativos (quiz por módulo)
- Certificado PDF ao concluir uma rota
- Modo claro/escuro
- Vídeos embedados (YouTube) por aula
