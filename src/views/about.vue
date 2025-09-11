<template>
  <div :class="isDarkMode ? 'dark-mode' : 'light-mode'">
    <NavBar />
    <div class="about-container">
      <header class="hero" ref="parallax">
        <div class="hero-content">
          <div class="founders-intro">
            <div class="floating-badge">Treinamento Excelente</div>
            <h1 class="title">Transformando o Futuro do Treinamento</h1>
            <p class="subtitle">Plataforma inteligente de gestão de treinos</p>
            <div class="hero-description">
              <p>
                Nossa missão é revolucionar o aprendizado organizacional através
                de soluções inovadoras de gerenciamento de treinamento que
                capacitam profissionais, otimizam performance e aceleram o
                crescimento em todas as plataformas digitais.
              </p>
            </div>
            <div class="hero-stats">
              <div class="stat-highlight">
                <span class="stat-number">10K+</span>
                <span class="stat-label">Usuários Ativos</span>
              </div>
              <div class="stat-highlight">
                <span class="stat-number">500+</span>
                <span class="stat-label">Organizações</span>
              </div>
              <div class="stat-highlight">
                <span class="stat-number">91%</span>
                <span class="stat-label">Satisfação</span>
              </div>
            </div>
            <div class="cta-buttons">
              <button class="btn-primary">Explore nossa Plataforma</button>
              <button class="btn-secondary">Fale Conosco</button>
            </div>
          </div>
        </div>
        <div class="scroll-indicator">
          <div class="scroll-arrow"></div>
          <span>Descubra mais</span>
        </div>
      </header>

      <section class="vision-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Nosso Propósito</span>
            <h2>Potencializando o Gerenciamento de Treinos</h2>
          </div>
          <div class="vision-grid">
            <div class="vision-card mission">
              <div class="card-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Missão</h3>
              <p>
                Proporcionar acesso a treinos de excelência, por meio de
                plataformas intuitivas e escaláveis que tornam o aprendizado e a
                prática física envolventes e de fácil controle em qualquer
                dispositivo.
              </p>
            </div>
            <div class="vision-card vision">
              <div class="card-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.5 16.5C-1.5 10.5 6 0 12 0C18 0 25.5 10.5 19.5 16.5L12 24L4.5 16.5Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <h3>Visão</h3>
              <p>
                Criar um ambiente onde o aprendizado contínuo impulsiona a
                evolução pessoal e profissional, garantindo acesso a ferramentas
                de treino que atendem às necessidades e aceleram o progresso
              </p>
            </div>
            <div class="vision-card values">
              <div class="card-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polygon
                    points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3>Valores</h3>
              <p>
                Personalização, acessibilidade, foco no usuário e excelência.
                Soluções que facilitam a criação e acompanhamento de treinos,
                garantindo que cada usuário alcance seus objetivos de forma
                prática eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Excelência da Plataforma</span>
            <h2>Soluções de Treinamento Multiplataforma</h2>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M10 4V2C10 1.44772 10.4477 1 11 1H13C13.5523 1 14 1.44772 14 2V4"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <h3>Acessibilidade Ampla</h3>
              <p>
                Experiência contínua e integrada em web, mobile e tablets, com
                design responsivo e desempenho nativo otimizado.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3V21L9 15L15 21L21 15V3L15 9L9 3L3 3Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3>Análises Avançadas</h3>
              <p>
                Relatórios e ferramentas de monitoramento que fornecem insights
                detalhados sobre o progresso e a eficácia dos treinos.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M21 9V7C21 5.89543 20.1046 5 19 5H17"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M7 5H5C3.89543 5 3 5.89543 3 7V9"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M3 15V17C3 18.1046 3.89543 19 5 19H7"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M17 19H19C20.1046 19 21 18.1046 21 17V15"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <h3>Trilhas de Aprendizado Personalizadas</h3>
              <p>
                Experiências de treino adaptativas, ajustadas aos níveis de
                habilidade, necessidades individuais e objetivos de cada
                usuário.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606L20.026 19.6606C20.0741 19.9162 20.0421 20.1816 19.9351 20.4166C19.8281 20.6516 19.6514 20.8434 19.426 20.9606L15.826 22.9606C15.6006 23.0778 15.3352 23.1098 15.0796 23.0618L11.3796 22.3218C11.1352 22.2764 10.8848 22.2764 10.6404 22.3218L6.94042 23.0618C6.68482 23.1098 6.41942 23.0778 6.19402 22.9606L2.59402 20.9606C2.36862 20.8434 2.19192 20.6516 2.08492 20.4166C1.97792 20.1816 1.94592 19.9162 1.99402 19.6606L2.73402 15.9606C2.79282 15.6362 2.75312 15.3016 2.62002 15L0.62002 11.4C0.50282 11.1746 0.47082 10.9092 0.51882 10.6536C0.56682 10.3980 0.69862 10.1666 0.89402 10L4.06002 7.4C4.25542 7.23342 4.38722 7.00202 4.43522 6.74642L5.17522 3.04642C5.22332 2.79082 5.29212 2.55942 5.46002 2.38L8.46002 0.38C8.62792 0.20058 8.85932 0.12822 9.11492 0.17622L12.8149 0.91622C13.0705 0.96422 13.2919 1.09602 13.4599 1.29142L15.4599 4.29142C15.6279 4.48682 15.7597 4.71822 15.8077 4.97382L16.5477 8.67382C16.5957 8.92942 16.6645 9.16082 16.8325 9.32882L19.8325 11.3288C20.0005 11.4968 20.0729 11.7282 20.0249 11.9838C19.9769 12.2394 19.8451 12.4708 19.6497 12.6388L16.4837 15.2388C16.2883 15.4052 16.1565 15.6366 16.1085 15.8922L15.3685 19.5922C15.3205 19.8478 15.2517 20.0792 15.0837 20.2472L12.0837 22.2472C11.9157 22.4152 11.6843 22.4876 11.4287 22.4396L8.42872 21.6996C8.17312 21.6516 7.94172 21.5828 7.77372 21.4148L5.77372 18.4148C5.60572 18.2468 5.47392 18.0154 5.42592 17.7598L4.68592 14.0598C4.63792 13.8042 4.56912 13.5728 4.40112 13.4048L1.40112 11.4048C1.23312 11.2368 1.16072 11.0054 1.20872 10.7498C1.25672 10.4942 1.38852 10.2628 1.58392 10.0948L4.74992 7.49482C4.94532 7.32682 5.07712 7.09542 5.12512 6.83982L5.86512 3.13982C5.91312 2.88422 5.98192 2.65282 6.14992 2.48482L9.14992 0.484824C9.31792 0.316824 9.54932 0.244424 9.80492 0.292424L13.5049 1.03242C13.7605 1.08042 13.9919 1.21222 14.1599 1.40762L16.1599 4.40762C16.3279 4.60302 16.4597 4.83442 16.5077 5.09002L17.2477 8.79002C17.2957 9.04562 17.3645 9.27702 17.5325 9.44502L20.5325 11.445C20.7005 11.613 20.7729 11.8444 20.7249 12.1L19.4 15Z"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <h3>Integração Personalizada</h3>
              <p>
                Conexão fluida com planos de treino, rotinas adaptáveis e
                comunicação direta entre alunos e instrutores.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2V6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 18V22"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.93 4.93L7.76 7.76"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.24 16.24L19.07 19.07"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2 12H6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18 12H22"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.93 19.07L7.76 16.24"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.24 7.76L19.07 4.93"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <h3>Histórico e Registro de Treinos</h3>
              <p>
                Registro completo do histórico de treinos e resultados, com
                acompanhamento de marcos pessoais para monitorar o progresso
                físico.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <rect
                    x="8"
                    y="2"
                    width="8"
                    height="4"
                    rx="1"
                    ry="1"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 14L11 16L15 10"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3>Verificação de Progresso e Avaliação</h3>
              <p>
                Monitoramento do progresso com análises de desempenho,
                acompanhamento individual que ajudam a alcançar metas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="methodology-section">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">Metodologia</span>
            <h2 class="methodology-title">Nossa abordagem de Treino</h2>
            <p class="section-description">
              Uma metodologia que transforma como alunos e instrutores organizam
              e acompanham a evolução nos treinos.
            </p>
          </div>

          <div class="methodology-timeline">
            <div class="timeline-container">
              <div class="timeline-track"></div>

              <div class="timeline-step">
                <div class="step-marker">
                  <div class="marker-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="step-content">
                  <div class="step-number">01</div>
                  <h3>Avaliação Personalizada</h3>
                  <p>
                    Planos cuidadosamente criados de acordo com o perfil,
                    objetivos e nível de experiência de cada aluno, permitindo
                    treinos realmente sob medida para alcançar resultados mais
                    rápidos e eficazes.
                  </p>
                  <div class="step-metrics">
                    <span class="metric">
                      <strong class="metric-strong">98%</strong> Maior precisão
                      nos treinos
                    </span>
                    <span class="metric">
                      <strong class="metric-strong">15min</strong> Configuração
                      simples
                    </span>
                  </div>
                </div>
              </div>

              <div class="timeline-step">
                <div class="step-marker">
                  <div class="marker-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <polyline
                        points="3,6 21,6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16 10C16 11.1046 15.1046 12 14 12H10C8.89543 12 8 11.1046 8 10"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="step-content">
                  <div class="step-number">02</div>
                  <h3>Entrega de Treinos Adaptativos</h3>
                  <p>
                    Rotinas dinâmicas que evoluem constantemente conforme o
                    progresso do aluno, incorporando ajustes inteligentes,
                    recomendações personalizadas e acompanhamento contínuo do
                    instrutor.
                  </p>
                  <div class="step-metrics">
                    <span class="metric">
                      <strong class="metric-strong">40%</strong> Evolução mais
                      rápida
                    </span>
                    <span class="metric">
                      <strong class="metric-strong">85%</strong> Maior retenção
                    </span>
                  </div>
                </div>
              </div>

              <div class="timeline-step">
                <div class="step-marker">
                  <div class="marker-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3V21L9 15L15 21L21 15V3L15 9L9 3L3 3Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="step-content">
                  <div class="step-number">03</div>
                  <h3>Monitoramento de Desempenho</h3>
                  <p>
                    Monitoramento detalhado das métricas de treino, evolução
                    física e histórico do aluno, oferecendo relatórios claros e
                    feedbacks para os praticantes e insights estratégicos para
                    os instrutores.
                  </p>
                  <div class="step-metrics">
                    <span class="metric">
                      <strong class="metric-strong">92%</strong> Feedback
                      preciso
                    </span>
                    <span class="metric">
                      <strong class="metric-strong">360°</strong> Histórico
                      completo
                    </span>
                  </div>
                </div>
              </div>

              <div class="timeline-step">
                <div class="step-marker">
                  <div class="marker-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 10V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V10C3.10457 10 4 10.8954 4 12C4 13.1046 3.10457 14 2 14V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V14C20.8954 14 20 13.1046 20 12C20 10.8954 20.8954 10 22 10Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M6 16L10 12L6 8"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 16H18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div class="step-content">
                  <div class="step-number">04</div>
                  <h3>Otimização Contínua</h3>
                  <p>
                    Ajustes frequentes e estratégicos baseados em desempenho,
                    histórico de treinos e objetivos individuais, garantindo uma
                    evolução sustentável e adaptada ao longo prazo.
                  </p>
                  <div class="step-metrics">
                    <span class="metric">
                      <strong class="metric-strong">25%</strong> Aumento de
                      Perfomance
                    </span>
                    <span class="metric">
                      <strong class="metric-strong">Evolução</strong> a longo
                      prazo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">Alunos Ativos</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Instrutores e Academias Cadastradas</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">91%</div>
              <div class="stat-label">Taxa de Satisfação</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Disponibilidade</div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div class="footer-content">
          <div class="footer-brand">
            <h3>TrainingPlatform</h3>
            <p>
              Potencializando sua evolução nos treinos com tecnologia e
              praticidade.
            </p>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>Plataforma</h4>
              <a href="#">Preço</a>
              <a href="#">Suporte</a>
            </div>
            <div class="link-group">
              <h4>Empresa</h4>
              <a href="#">Sobre nós</a>
              <a href="#">Contato</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 TrainingPlatform. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import { useThemeStore } from "@/store/theme";
import { storeToRefs } from "pinia";

export default {
  name: "AboutUs",
  components: {
    NavBar,
  },
  setup() {
    const themeStore = useThemeStore();
    const { isDarkMode } = storeToRefs(themeStore);

    return {
      isDarkMode,
    };
  },
  data() {
    return {
      observer: null,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.setupIntersectionObserver();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    handleScroll() {
      const parallax = this.$refs.parallax;
      if (parallax) {
        let scrollPosition = window.pageYOffset;
        parallax.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    },

    setupIntersectionObserver() {
      const options = {
        threshold: 0.1,
        rootMargin: "-50px 0px -50px 0px",
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      }, options);

      const animatedElements = document.querySelectorAll(
        ".vision-card, .feature-card, .stat-item, .timeline-step"
      );

      animatedElements.forEach((element) => {
        this.observer.observe(element);
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap");

.light-mode {
  --primary-color: #2563eb;
  --primary-gradient: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --secondary-gradient: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  --accent-gradient: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --card-background: rgba(255, 255, 255, 0.9);
  --text-color: #1e293b;
  --text-secondary: #64748b;
  --border-color: rgba(226, 232, 240, 0.8);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
  --hero-bg: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%);

  --methodology-primary-color: #2563eb;
  --methodology-primary-gradient: linear-gradient(
    135deg,
    #2563eb 0%,
    #1d4ed8 100%
  );
  --methodology-hover-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
}

.dark-mode {
  --primary-color: #8b5cf6;
  --primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --secondary-gradient: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  --accent-gradient: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
  --background-color: #0a0a0a;
  --surface-color: #1a1a1a;
  --card-background: rgba(42, 42, 42, 0.8);
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --shadow-hover: 0 35px 60px -12px rgba(0, 0, 0, 0.7);
  --hero-bg: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);

  /* Metodologia com cores da versão 1 dark mode */
  --methodology-primary-color: #3b82f6;
  --methodology-primary-gradient: linear-gradient(
    135deg,
    #3b82f6 0%,
    #8b5cf6 100%
  );
  --methodology-hover-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
}

.light-mode,
.dark-mode {
  font-family: "Inter", sans-serif;
  transition: all 0.3s ease;
}

.light-mode::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(37, 99, 235, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    );
  z-index: -1;
  opacity: 0.3;
}

.dark-mode::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(139, 92, 246, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(168, 85, 247, 0.1) 0%,
      transparent 50%
    );
  z-index: -1;
  opacity: 0.5;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.about-container {
  background: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
  min-height: 100vh;
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  background: var(--hero-bg);
  background-attachment: fixed;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.dark-mode .hero::before {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(139, 92, 246, 0.1) 0%,
    transparent 50%
  );
}

.hero-content {
  z-index: 2;
  max-width: 800px;
  animation: fadeInUp 1s ease-out;
}

.floating-badge {
  display: inline-block;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  animation: float 3s ease-in-out infinite;
  color: var(--text-secondary);
}

.title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  margin-bottom: 30px;
  color: var(--text-secondary);
  font-weight: 300;
}

.hero-description {
  margin-bottom: 40px;
}

.hero-description p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-highlight {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-width: 120px;
}

.stat-highlight:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
}

.stat-highlight .stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-highlight .stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-align: center;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  font-family: inherit;
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.btn-secondary {
  background: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: var(--surface-color);
  transform: translateY(-2px);
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
  color: var(--text-secondary);
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  margin-bottom: 10px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  background: var(--methodology-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}

.section-header h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-color);
}

.vision-section {
  padding: 120px 0;
  background: var(--surface-color);
}

.vision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.vision-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 1;
  transform: translateY(0) scale(1);
  box-shadow: var(--shadow);
}

.vision-card.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.vision-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-hover);
}

.card-icon {
  margin-bottom: 25px;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
}

.dark-mode .card-icon svg {
  filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.3));
}

.light-mode .card-icon svg {
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
}

.vision-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-color);
}

.vision-card p {
  color: var(--text-secondary);
  line-height: 1.7;
}

.features-section {
  padding: 120px 0;
  background: var(--background-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  padding: 30px;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 1;
  transform: translateY(0);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(139, 92, 246, 0.1),
    transparent
  );
  transition: left 0.5s;
}

.light-mode .feature-card::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(59, 130, 246, 0.1),
    transparent
  );
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0);
  animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
  border-color: var(--primary-color);
}

.feature-icon {
  margin-bottom: 25px;
  color: var(--primary-color);
  display: flex;
  justify-content: flex-start;
}

.dark-mode .feature-icon svg {
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.2));
}

.light-mode .feature-icon svg {
  filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.2));
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-color);
}

.feature-card p {
  color: var(--text-secondary);
}

.methodology-section {
  padding: 120px 0;
  background: var(--surface-color);
  position: relative;
  overflow: hidden;
}

.methodology-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(59, 130, 246, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(139, 92, 246, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.methodology-section .container {
  position: relative;
  z-index: 2;
}

.methodology-section .section-header {
  margin-bottom: 80px;
}

.section-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.methodology-timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-container {
  position: relative;
}

.timeline-track {
  position: absolute;
  left: 40px;
  top: 60px;
  bottom: 60px;
  width: 2px;
  background: var(--methodology-primary-gradient);
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 80px;
  position: relative;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 1;
  transform: translateX(0);
}

.timeline-step.animate-in {
  opacity: 1;
  transform: translateX(0);
  animation: slideInFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-step:hover .step-marker {
  transform: scale(1.1);
  box-shadow: var(--methodology-hover-shadow);
}

.timeline-step:hover .step-content {
  background: var(--card-background);
  border-color: var(--methodology-primary-color);
  transform: translateY(-5px);
}

.timeline-step:hover .step-content::before {
  transform: scaleX(1);
}

.step-marker {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--methodology-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30px;
  flex-shrink: 0;
  z-index: 3;
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.marker-icon {
  color: white;
  z-index: 2;
}

.marker-icon svg {
  width: 28px;
  height: 28px;
}

.step-content {
  flex: 1;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.step-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--methodology-primary-gradient);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-number {
  position: absolute;
  top: -10px;
  right: 20px;
  font-size: 4rem;
  font-weight: 900;
  color: var(--border-color);
  line-height: 1;
  opacity: 0.3;
}

.step-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-color);
  position: relative;
  z-index: 2;
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.step-metrics {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.metric {
  background: var(--card-background);
  border: 1px solid var(--border-color);
  padding: 8px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.metric:hover {
  border-color: var(--methodology-primary-color);
  transform: translateY(-2px);
}

.metric strong {
  color: var(--methodology-primary-color);
  font-weight: 700;
}

.dark-mode .metric-strong {
  background: var(--methodology-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.stats-section {
  padding: 80px 0;
  background: var(--background-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.stat-item {
  text-align: center;
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-item.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.stat-item:hover {
  transform: translateY(-5px) scale(1.05);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  animation: glow 2s ease-in-out infinite alternate;
}

.light-mode .stat-number {
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.stat-label {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

footer {
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;
  padding: 60px 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.footer-brand h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: var(--text-color);
}

.footer-brand p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.footer-links {
  display: flex;
  gap: 50px;
}

.link-group h4 {
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-color);
}

.link-group a {
  display: block;
  color: var(--text-secondary);
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  text-align: center;
  padding: 30px 20px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes glow {
  0% {
    text-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  }
  100% {
    text-shadow: 0 0 30px rgba(139, 92, 246, 0.6),
      0 0 40px rgba(139, 92, 246, 0.4);
  }
}

.light-mode .stat-number {
  animation: glowLight 2s ease-in-out infinite alternate;
}

@keyframes glowLight {
  0% {
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  100% {
    text-shadow: 0 0 30px rgba(59, 130, 246, 0.6),
      0 0 40px rgba(59, 130, 246, 0.4);
  }
}

@media (max-width: 768px) {
  .timeline-track {
    left: 30px;
  }

  .step-marker {
    width: 60px;
    height: 60px;
    margin-right: 20px;
  }

  .marker-icon svg {
    width: 20px;
    height: 20px;
  }

  .step-content {
    padding: 20px;
  }

  .step-number {
    font-size: 3rem;
    top: -5px;
    right: 15px;
  }

  .vision-grid {
    grid-template-columns: 1fr;
  }

  .vision-card {
    min-width: auto;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .vision-card {
    min-width: auto;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 200px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .timeline-step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .timeline-track {
    display: none;
  }

  .step-marker {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .step-metrics {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
