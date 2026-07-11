window.TG_QUIZZES = {
  "starter": {
    "pt": {
      "title": "Quiz — Iniciação da Guilda",
      "passScore": 2,
      "questions": [
        {
          "q": "O que um QA faz principalmente?",
          "options": [
            "Só clica na tela",
            "Garante qualidade via testes e análise",
            "Escreve código de produção",
            "Gerencia o budget"
          ],
          "correct": 1,
          "explain": "QA planeja, executa testes, reporta bugs e colabora com o time."
        },
        {
          "q": "Qual nível de teste valida fluxo completo do usuário?",
          "options": [
            "Unitário",
            "Integração",
            "E2E",
            "Estático"
          ],
          "correct": 2,
          "explain": "E2E simula o usuário real do início ao fim."
        },
        {
          "q": "Bug report eficaz deve incluir:",
          "options": [
            "Só \"não funciona\"",
            "Passos, esperado vs atual, evidências",
            "Opinião pessoal",
            "Nada, só avisar verbalmente"
          ],
          "correct": 1,
          "explain": "Clareza no report economiza tempo de dev e reprodução."
        }
      ]
    },
    "en": {
      "title": "Quiz — Guild Initiation",
      "passScore": 2,
      "questions": [
        {
          "q": "What does a QA mainly do?",
          "options": [
            "Just clicks around",
            "Ensures quality via testing and analysis",
            "Writes production code",
            "Manages budget"
          ],
          "correct": 1,
          "explain": "QA plans, executes tests, reports bugs, and collaborates with the team."
        },
        {
          "q": "Which test level validates the full user flow?",
          "options": [
            "Unit",
            "Integration",
            "E2E",
            "Static"
          ],
          "correct": 2,
          "explain": "E2E simulates the real user from start to finish."
        },
        {
          "q": "An effective bug report should include:",
          "options": [
            "Just \"it doesn't work\"",
            "Steps, expected vs actual, evidence",
            "Personal opinion",
            "Nothing, just tell verbally"
          ],
          "correct": 1,
          "explain": "Clear reports save dev time and reproduction effort."
        }
      ]
    }
  },
  "web": {
    "pt": {
      "title": "Quiz — Forja Frontend",
      "passScore": 2,
      "questions": [
        {
          "q": "Melhor seletor para automação estável?",
          "options": [
            "XPath por posição",
            "data-testid ou roles acessíveis",
            "CSS frágil com nth-child",
            "ID dinâmico"
          ],
          "correct": 1,
          "explain": "data-testid e ARIA roles resistem a mudanças de layout."
        },
        {
          "q": "Playwright tem vantagem de:",
          "options": [
            "Só Chrome",
            "Auto-wait built-in",
            "Sem suporte a API",
            "Obriga Selenium Grid"
          ],
          "correct": 1,
          "explain": "Auto-wait reduz flaky tests significativamente."
        },
        {
          "q": "Page Object Model serve para:",
          "options": [
            "Decorar UI",
            "Encapsular seletores e ações de página",
            "Substituir testes manuais 100%",
            "Gerar relatórios"
          ],
          "correct": 1,
          "explain": "POM centraliza locators e reduz duplicação."
        }
      ]
    },
    "en": {
      "title": "Quiz — Frontend Forge",
      "passScore": 2,
      "questions": [
        {
          "q": "Best selector for stable automation?",
          "options": [
            "Position XPath",
            "data-testid or accessible roles",
            "Fragile nth-child CSS",
            "Dynamic ID"
          ],
          "correct": 1,
          "explain": "data-testid and ARIA roles resist layout changes."
        },
        {
          "q": "Playwright advantage includes:",
          "options": [
            "Chrome only",
            "Built-in auto-wait",
            "No API support",
            "Requires Selenium Grid"
          ],
          "correct": 1,
          "explain": "Auto-wait significantly reduces flaky tests."
        },
        {
          "q": "Page Object Model is for:",
          "options": [
            "UI decoration",
            "Encapsulating page selectors and actions",
            "Replacing 100% manual tests",
            "Generating reports"
          ],
          "correct": 1,
          "explain": "POM centralizes locators and reduces duplication."
        }
      ]
    }
  },
  "api": {
    "pt": {
      "title": "Quiz — Oficina de Integração",
      "passScore": 2,
      "questions": [
        {
          "q": "HTTP 404 significa:",
          "options": [
            "Sucesso",
            "Recurso não encontrado",
            "Erro de servidor",
            "Auth inválida"
          ],
          "correct": 1,
          "explain": "404 = endpoint ou recurso inexistente."
        },
        {
          "q": "Postman Newman é usado para:",
          "options": [
            "Design UI",
            "Rodar collections em CI headless",
            "Editar vídeo",
            "Deploy"
          ],
          "correct": 1,
          "explain": "Newman executa collections Postman na pipeline."
        },
        {
          "q": "Contract testing (Pact) previne:",
          "options": [
            "Bugs de UI",
            "Breaking changes silenciosos entre serviços",
            "Lentidão de rede",
            "Typos em docs"
          ],
          "correct": 1,
          "explain": "Contratos garantem compatibilidade consumer/provider."
        }
      ]
    },
    "en": {
      "title": "Quiz — Integration Workshop",
      "passScore": 2,
      "questions": [
        {
          "q": "HTTP 404 means:",
          "options": [
            "Success",
            "Resource not found",
            "Server error",
            "Invalid auth"
          ],
          "correct": 1,
          "explain": "404 = endpoint or resource does not exist."
        },
        {
          "q": "Postman Newman is used to:",
          "options": [
            "UI design",
            "Run collections headless in CI",
            "Edit video",
            "Deploy"
          ],
          "correct": 1,
          "explain": "Newman runs Postman collections in the pipeline."
        },
        {
          "q": "Contract testing (Pact) prevents:",
          "options": [
            "UI bugs",
            "Silent breaking changes between services",
            "Network slowness",
            "Doc typos"
          ],
          "correct": 1,
          "explain": "Contracts ensure consumer/provider compatibility."
        }
      ]
    }
  },
  "mobile": {
    "pt": {
      "title": "Quiz — Laboratório Mobile",
      "passScore": 2,
      "questions": [
        {
          "q": "Appium usa drivers como:",
          "options": [
            "uiautomator2 / xcuitest",
            "chromedriver only",
            "curl",
            "JMeter"
          ],
          "correct": 0,
          "explain": "Appium 2 usa drivers específicos por plataforma."
        },
        {
          "q": "Testar em emulador vs device real:",
          "options": [
            "Sempre igual",
            "Device real captura mais issues de hardware/gestos",
            "Emulador é sempre superior",
            "Nunca use emulador"
          ],
          "correct": 1,
          "explain": "Devices reais revelam problemas que emuladores mascaram."
        },
        {
          "q": "Locator preferido em mobile:",
          "options": [
            "XPath longo",
            "accessibility id",
            "Coordenadas fixas",
            "Cor do pixel"
          ],
          "correct": 1,
          "explain": "accessibility id é estável e acessível."
        }
      ]
    },
    "en": {
      "title": "Quiz — Mobile Lab",
      "passScore": 2,
      "questions": [
        {
          "q": "Appium uses drivers like:",
          "options": [
            "uiautomator2 / xcuitest",
            "chromedriver only",
            "curl",
            "JMeter"
          ],
          "correct": 0,
          "explain": "Appium 2 uses platform-specific drivers."
        },
        {
          "q": "Testing on emulator vs real device:",
          "options": [
            "Always the same",
            "Real device catches more hardware/gesture issues",
            "Emulator is always better",
            "Never use emulator"
          ],
          "correct": 1,
          "explain": "Real devices reveal issues emulators mask."
        },
        {
          "q": "Preferred mobile locator:",
          "options": [
            "Long XPath",
            "accessibility id",
            "Fixed coordinates",
            "Pixel color"
          ],
          "correct": 1,
          "explain": "accessibility id is stable and accessible."
        }
      ]
    }
  },
  "performance": {
    "pt": {
      "title": "Quiz — Arena de Carga",
      "passScore": 2,
      "questions": [
        {
          "q": "Métrica p95 significa:",
          "options": [
            "95% dos requests falharam",
            "95% das requests foram mais rápidas que esse valor",
            "95 usuários",
            "95% CPU"
          ],
          "correct": 1,
          "explain": "p95 = latência abaixo da qual 95% das requests caem."
        },
        {
          "q": "Load test vs Stress test:",
          "options": [
            "Iguais",
            "Load = carga esperada; Stress = além do limite",
            "Stress é sempre menor",
            "Load não usa ferramentas"
          ],
          "correct": 1,
          "explain": "Load simula tráfego normal; stress busca o breaking point."
        },
        {
          "q": "K6 scripts são escritos em:",
          "options": [
            "Java",
            "JavaScript",
            "Bash only",
            "SQL"
          ],
          "correct": 1,
          "explain": "K6 usa JS para scripts de carga."
        }
      ]
    },
    "en": {
      "title": "Quiz — Load Arena",
      "passScore": 2,
      "questions": [
        {
          "q": "Metric p95 means:",
          "options": [
            "95% of requests failed",
            "95% of requests were faster than this value",
            "95 users",
            "95% CPU"
          ],
          "correct": 1,
          "explain": "p95 = latency below which 95% of requests fall."
        },
        {
          "q": "Load test vs Stress test:",
          "options": [
            "Same",
            "Load = expected load; Stress = beyond limits",
            "Stress is always smaller",
            "Load uses no tools"
          ],
          "correct": 1,
          "explain": "Load simulates normal traffic; stress finds breaking point."
        },
        {
          "q": "K6 scripts are written in:",
          "options": [
            "Java",
            "JavaScript",
            "Bash only",
            "SQL"
          ],
          "correct": 1,
          "explain": "K6 uses JS for load scripts."
        }
      ]
    }
  },
  "security": {
    "pt": {
      "title": "Quiz — Sentinela de Segurança",
      "passScore": 2,
      "questions": [
        {
          "q": "OWASP Top 10 lista:",
          "options": [
            "Frameworks JS",
            "Vulnerabilidades críticas web",
            "Salários de QA",
            "Design patterns"
          ],
          "correct": 1,
          "explain": "Top 10 = riscos mais críticos em apps web."
        },
        {
          "q": "SQL Injection explora:",
          "options": [
            "CSS",
            "Entradas não sanitizadas em queries SQL",
            "Imagens",
            "DNS"
          ],
          "correct": 1,
          "explain": "Input mal validado permite manipular SQL."
        },
        {
          "q": "OWASP ZAP é usado para:",
          "options": [
            "Load test",
            "Proxy e scan de segurança",
            "Mobile deploy",
            "Git merge"
          ],
          "correct": 1,
          "explain": "ZAP intercepta tráfego e encontra vulnerabilidades."
        }
      ]
    },
    "en": {
      "title": "Quiz — Security Sentinel",
      "passScore": 2,
      "questions": [
        {
          "q": "OWASP Top 10 lists:",
          "options": [
            "JS frameworks",
            "Critical web vulnerabilities",
            "QA salaries",
            "Design patterns"
          ],
          "correct": 1,
          "explain": "Top 10 = most critical risks in web apps."
        },
        {
          "q": "SQL Injection exploits:",
          "options": [
            "CSS",
            "Unsanitized inputs in SQL queries",
            "Images",
            "DNS"
          ],
          "correct": 1,
          "explain": "Poorly validated input allows SQL manipulation."
        },
        {
          "q": "OWASP ZAP is used for:",
          "options": [
            "Load testing",
            "Proxy and security scanning",
            "Mobile deploy",
            "Git merge"
          ],
          "correct": 1,
          "explain": "ZAP intercepts traffic and finds vulnerabilities."
        }
      ]
    }
  },
  "devops": {
    "pt": {
      "title": "Quiz — Artesanato de Pipeline",
      "passScore": 2,
      "questions": [
        {
          "q": "Quality gate bloqueia merge quando:",
          "options": [
            "Dev pede",
            "Testes críticos falham ou métricas degradam",
            "Sempre",
            "Nunca"
          ],
          "correct": 1,
          "explain": "Gates protegem main branch de regressões."
        },
        {
          "q": "docker-compose ajuda QA a:",
          "options": [
            "Editar fotos",
            "Subir app+deps reproduzíveis",
            "Enviar email",
            "Criar slides"
          ],
          "correct": 1,
          "explain": "Ambiente idêntico local e CI."
        },
        {
          "q": "Allure Reports oferecem:",
          "options": [
            "Chat",
            "Relatórios HTML ricos com steps e history",
            "IDE",
            "VPN"
          ],
          "correct": 1,
          "explain": "Allure visualiza execução de testes com detalhes."
        }
      ]
    },
    "en": {
      "title": "Quiz — Pipeline Craft",
      "passScore": 2,
      "questions": [
        {
          "q": "Quality gate blocks merge when:",
          "options": [
            "Dev asks",
            "Critical tests fail or metrics degrade",
            "Always",
            "Never"
          ],
          "correct": 1,
          "explain": "Gates protect main branch from regressions."
        },
        {
          "q": "docker-compose helps QA:",
          "options": [
            "Edit photos",
            "Run reproducible app+deps",
            "Send email",
            "Create slides"
          ],
          "correct": 1,
          "explain": "Identical environment locally and in CI."
        },
        {
          "q": "Allure Reports provide:",
          "options": [
            "Chat",
            "Rich HTML reports with steps and history",
            "IDE",
            "VPN"
          ],
          "correct": 1,
          "explain": "Allure visualizes test execution in detail."
        }
      ]
    }
  },
  "accessibility": {
    "pt": {
      "title": "Quiz — Testes Inclusivos",
      "passScore": 2,
      "questions": [
        {
          "q": "WCAG nível recomendado para produtos:",
          "options": [
            "A only",
            "AA",
            "AAA sempre obrigatório",
            "Nenhum"
          ],
          "correct": 1,
          "explain": "AA é o alvo comum na indústria."
        },
        {
          "q": "POUR significa:",
          "options": [
            "Tipo de café",
            "Perceivable, Operable, Understandable, Robust",
            "Protocolo HTTP",
            "Ferramenta Java"
          ],
          "correct": 1,
          "explain": "Quatro princípios fundamentais de acessibilidade."
        },
        {
          "q": "axe-core automatiza checks de:",
          "options": [
            "Performance",
            "Acessibilidade WCAG",
            "SQL",
            "Deploy"
          ],
          "correct": 1,
          "explain": "axe encontra violações a11y automaticamente."
        }
      ]
    },
    "en": {
      "title": "Quiz — Inclusive Testing",
      "passScore": 2,
      "questions": [
        {
          "q": "WCAG level recommended for products:",
          "options": [
            "A only",
            "AA",
            "AAA always required",
            "None"
          ],
          "correct": 1,
          "explain": "AA is the common industry target."
        },
        {
          "q": "POUR stands for:",
          "options": [
            "Coffee type",
            "Perceivable, Operable, Understandable, Robust",
            "HTTP protocol",
            "Java tool"
          ],
          "correct": 1,
          "explain": "Four fundamental accessibility principles."
        },
        {
          "q": "axe-core automates checks for:",
          "options": [
            "Performance",
            "WCAG accessibility",
            "SQL",
            "Deploy"
          ],
          "correct": 1,
          "explain": "axe finds a11y violations automatically."
        }
      ]
    }
  },
  "leadership": {
    "pt": {
      "title": "Quiz — Maestria da Guilda",
      "passScore": 2,
      "questions": [
        {
          "q": "Risk-based testing prioriza:",
          "options": [
            "Testar tudo igual",
            "Impacto × probabilidade",
            "Só UI",
            "Só unitários"
          ],
          "correct": 1,
          "explain": "Foque onde o risco de falha é maior."
        },
        {
          "q": "Flaky tests na main branch:",
          "options": [
            "Ignorar",
            "Zero tolerância com quarentena e SLA",
            "Celebrar",
            "Duplicar"
          ],
          "correct": 1,
          "explain": "Flakes destroem confiança na pipeline."
        },
        {
          "q": "Test strategy document deve ser:",
          "options": [
            "Morto na gaveta",
            "Vivo e revisado com o time",
            "Secreto",
            "Só para juniors"
          ],
          "correct": 1,
          "explain": "Estratégia evolui com o produto."
        }
      ]
    },
    "en": {
      "title": "Quiz — Guild Mastery",
      "passScore": 2,
      "questions": [
        {
          "q": "Risk-based testing prioritizes:",
          "options": [
            "Test everything equally",
            "Impact × probability",
            "UI only",
            "Unit only"
          ],
          "correct": 1,
          "explain": "Focus where failure risk is highest."
        },
        {
          "q": "Flaky tests on main branch:",
          "options": [
            "Ignore",
            "Zero tolerance with quarantine and SLA",
            "Celebrate",
            "Duplicate"
          ],
          "correct": 1,
          "explain": "Flakes destroy pipeline trust."
        },
        {
          "q": "Test strategy document should be:",
          "options": [
            "Dead in a drawer",
            "Living and reviewed with the team",
            "Secret",
            "For juniors only"
          ],
          "correct": 1,
          "explain": "Strategy evolves with the product."
        }
      ]
    }
  }
};
