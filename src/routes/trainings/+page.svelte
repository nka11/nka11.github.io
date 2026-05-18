<script lang="ts">
  import { locale } from 'svelte-i18n';

  type Entry = {
    code: string;
    titleFr: string;
    titleEn: string;
    leadFr: string;
    leadEn: string;
    bulletsFr: string[];
    bulletsEn: string[];
    tags: string[];
    flavour?: 'cinnabar' | 'forest' | 'ink';
  };

  type Section = {
    index: string;
    titleFr: string;
    titleEn: string;
    captionFr: string;
    captionEn: string;
    entries: Entry[];
  };

  const headline: Entry[] = [
    {
      code: 'HL · 01',
      titleFr: 'Sécuriser et opérer une infrastructure virtualisée',
      titleEn: 'Securing & operating a virtualized infrastructure',
      leadFr: "Du noyau Linux au cluster Kubernetes : un parcours opérationnel complet.",
      leadEn: 'From the Linux kernel to a Kubernetes cluster: a full operational journey.',
      bulletsFr: ['Linux · KVM/Libvirt · Vagrant', 'Docker · orchestration K8s', 'Réseau virtuel, clustering, hardening'],
      bulletsEn: ['Linux · KVM/Libvirt · Vagrant', 'Docker · K8s orchestration', 'Virtual networking, clustering, hardening'],
      tags: ['OPS', 'INFRA', 'SECURITY'],
      flavour: 'cinnabar'
    },
    {
      code: 'HL · 02',
      titleFr: "IAM/SSO en entreprise : du protocole à l'architecture",
      titleEn: 'Enterprise IAM/SSO: from protocol to architecture',
      leadFr: 'OAuth2, OIDC, SAML décortiqués, puis assemblés en architecture SSO réaliste.',
      leadEn: 'OAuth2, OIDC, SAML dissected, then assembled into a realistic SSO architecture.',
      bulletsFr: ['OAuth 2.0 · OIDC · SAML 2.0', 'IBM ISAM · LDAP · AzureAD/EntraID', 'Patterns SSO, federation, MFA'],
      bulletsEn: ['OAuth 2.0 · OIDC · SAML 2.0', 'IBM ISAM · LDAP · AzureAD/EntraID', 'SSO patterns, federation, MFA'],
      tags: ['IAM', 'SECURITY', 'ARCHITECTURE'],
      flavour: 'forest'
    },
    {
      code: 'HL · 03',
      titleFr: 'EBIOS-RM & NIS2 en pratique pour DSI',
      titleEn: 'EBIOS-RM & NIS2 in practice for CIOs',
      leadFr: "Du référentiel ANSSI au plan d'action, sans charabia réglementaire.",
      leadEn: 'From the ANSSI framework to an action plan, without regulatory jargon.',
      bulletsFr: ['EBIOS Risk Manager (méthode complète)', 'ISO/27001 · NIS2 · RGPD · PCI-DSS', 'Cartographie des risques et trajectoire'],
      bulletsEn: ['EBIOS Risk Manager (full method)', 'ISO/27001 · NIS2 · GDPR · PCI-DSS', 'Risk mapping and roadmap'],
      tags: ['GRC', 'COMPLIANCE', 'ANSSI'],
      flavour: 'forest'
    },
    {
      code: 'HL · 04',
      titleFr: 'CI/CD industriel : Git → pipeline → production',
      titleEn: 'Industrial CI/CD: Git → pipeline → production',
      leadFr: 'Une chaîne de livraison robuste, testée et observable, posée sur de vraies organisations.',
      leadEn: 'A robust, tested, observable delivery chain — designed for real organizations.',
      bulletsFr: ['Git workflows · revue · release', 'Gitlab CI · Jenkins · Gitea Actions', 'Tests, qualité, déploiement progressif'],
      bulletsEn: ['Git workflows · review · release', 'Gitlab CI · Jenkins · Gitea Actions', 'Testing, quality, progressive delivery'],
      tags: ['DEVOPS', 'SQA', 'CI/CD'],
      flavour: 'cinnabar'
    },
    {
      code: 'HL · 05',
      titleFr: 'Web sémantique pour développeurs',
      titleEn: 'Semantic web for developers',
      leadFr: 'RDF, SPARQL, ontologies — illustrés par ce CV sémantique lui-même.',
      leadEn: 'RDF, SPARQL, ontologies — illustrated by this very semantic CV.',
      bulletsFr: ['RDF · Turtle · SPARQL', 'Ontologies (schema.org · ESCO · Europass)', 'Oxigraph WASM en pratique'],
      bulletsEn: ['RDF · Turtle · SPARQL', 'Ontologies (schema.org · ESCO · Europass)', 'Oxigraph WASM in practice'],
      tags: ['SEMANTIC', 'DATA', 'NICHE'],
      flavour: 'ink'
    },
    {
      code: 'HL · 06',
      titleFr: 'IA générative outillée pour équipes de dev',
      titleEn: 'Tooled generative AI for dev teams',
      leadFr: 'Claude, Gemini, Antigravity — non pas comme démo, mais comme outillage quotidien.',
      leadEn: 'Claude, Gemini, Antigravity — not as a demo, but as daily tooling.',
      bulletsFr: ['Principes : LLM, agents, RAG', 'Prompt engineering & cache', 'Intégration CLI/IDE, hooks, MCP'],
      bulletsEn: ['Principles: LLMs, agents, RAG', 'Prompt engineering & caching', 'CLI/IDE integration, hooks, MCP'],
      tags: ['AI', 'AGENTIC', 'PRODUCTIVITY'],
      flavour: 'cinnabar'
    }
  ];

  const sections: Section[] = [
    {
      index: '01',
      titleFr: 'Déjà éprouvées',
      titleEn: 'Already proven',
      captionFr: 'Modules au répertoire pédagogique actif — IUT de Caen, Paris XII, EEM, Kassoumai.',
      captionEn: 'Active teaching repertoire — Caen, Paris XII, EEM, Kassoumai.',
      entries: [
        {
          code: 'PR · 01',
          titleFr: 'Virtualisation : du fondamental à l\'avancé',
          titleEn: 'Virtualization: foundations to advanced',
          leadFr: 'Cours R5.09 (3e année) et R4.08 (2e année) à l\'IUT de Caen.',
          leadEn: 'Courses R5.09 (3rd year) and R4.08 (2nd year), Caen IUT.',
          bulletsFr: ['Libvirt/KVM, Vagrant, Docker', 'Kubernetes, réseau virtuel', 'Clustering, sécurisation d\'exploitation'],
          bulletsEn: ['Libvirt/KVM, Vagrant, Docker', 'Kubernetes, virtual networking', 'Clustering, secure operations'],
          tags: ['IUT R5.09', 'IUT R4.08']
        },
        {
          code: 'PR · 02',
          titleFr: 'Maintenance applicative & cycle de vie',
          titleEn: 'Application maintenance & lifecycle',
          leadFr: "Cours R6.06 — l'art de maintenir, refactorer, livrer.",
          leadEn: 'Course R6.06 — the art of maintaining, refactoring, shipping.',
          bulletsFr: ['Git · branches · revue de code', 'CI/CD (Gitlab · Jenkins · Gitea)', 'Refactoring · tests · JIRA'],
          bulletsEn: ['Git · branching · code review', 'CI/CD (Gitlab · Jenkins · Gitea)', 'Refactoring · testing · JIRA'],
          tags: ['IUT R6.06']
        },
        {
          code: 'PR · 03',
          titleFr: 'Programmation Java & Android',
          titleEn: 'Java & Android programming',
          leadFr: 'IUT GE2I Sénart et IUT Informatique Fontainebleau.',
          leadEn: 'IUT GE2I Sénart and IUT Informatique Fontainebleau.',
          bulletsFr: ['Java 8+ · SDK · patterns objet', 'Android SDK · cycle d\'activité', 'Pratique guidée'],
          bulletsEn: ['Java 8+ · SDK · OO patterns', 'Android SDK · activity lifecycle', 'Guided practice'],
          tags: ['UNIVERSITY']
        },
        {
          code: 'PR · 04',
          titleFr: 'Architecture des ordinateurs & assembleur',
          titleEn: 'Computer architecture & assembly',
          leadFr: 'Système Unix, programmation bas niveau ARM et x86.',
          leadEn: 'Unix systems, low-level ARM and x86 programming.',
          bulletsFr: ['Unix · internals · processus', 'Assembleur ARM & x86', 'C et interactions matériel'],
          bulletsEn: ['Unix · internals · processes', 'ARM & x86 assembly', 'C and hardware interactions'],
          tags: ['UNIVERSITY', 'LOW-LEVEL']
        }
      ]
    },
    {
      index: '02',
      titleFr: 'Champ d\'expertise pleinement instrumenté',
      titleEn: 'Fully instrumented expertise',
      captionFr: 'Modules adossés à une pratique professionnelle approfondie — prêts à industrialiser.',
      captionEn: 'Modules backed by deep professional practice — ready to industrialize.',
      entries: [
        {
          code: 'EX · 01',
          titleFr: 'Identity & Access Management (IAM/SSO)',
          titleEn: 'Identity & Access Management (IAM/SSO)',
          leadFr: 'Plus de quinze ans à concevoir et opérer des architectures d\'identité.',
          leadEn: 'Over fifteen years designing and operating identity architectures.',
          bulletsFr: ['OAuth2 · OIDC · SAML · IBM ISAM', 'LDAP · AzureAD · RACF (mainframe)', 'Patterns SSO d\'entreprise'],
          bulletsEn: ['OAuth2 · OIDC · SAML · IBM ISAM', 'LDAP · AzureAD · RACF (mainframe)', 'Enterprise SSO patterns'],
          tags: ['IAM', 'SECURITY']
        },
        {
          code: 'EX · 02',
          titleFr: 'Gouvernance, Risque & Conformité (GRC)',
          titleEn: 'Governance, Risk & Compliance (GRC)',
          leadFr: 'Cadres et méthodes au service d\'une décision claire.',
          leadEn: 'Frameworks and methods supporting clear decisions.',
          bulletsFr: ['EBIOS-RM (analyse ANSSI)', 'ISO/27001 · NIS2 · RGPD · PCI-DSS', 'Construire un programme de conformité'],
          bulletsEn: ['EBIOS-RM (ANSSI analysis)', 'ISO/27001 · NIS2 · GDPR · PCI-DSS', 'Build a compliance programme'],
          tags: ['GRC', 'COMPLIANCE']
        },
        {
          code: 'EX · 03',
          titleFr: 'DevOps & Infrastructure as Code',
          titleEn: 'DevOps & Infrastructure as Code',
          leadFr: 'Du commit à la production observable, par l\'automatisation.',
          leadEn: 'From commit to observable production, through automation.',
          bulletsFr: ['Terraform · Ansible · Docker · K8s', 'Pipelines CI/CD bout en bout', 'Observabilité & SecOps'],
          bulletsEn: ['Terraform · Ansible · Docker · K8s', 'End-to-end CI/CD pipelines', 'Observability & SecOps'],
          tags: ['DEVOPS', 'IAC']
        },
        {
          code: 'EX · 04',
          titleFr: 'Architecture logicielle & SQA',
          titleEn: 'Software architecture & SQA',
          leadFr: 'Concevoir, modéliser, tester — dans cet ordre.',
          leadEn: 'Design, model, test — in that order.',
          bulletsFr: ['UML · design patterns', 'Architectures distribuées', 'Event-driven : Kafka, RabbitMQ'],
          bulletsEn: ['UML · design patterns', 'Distributed architectures', 'Event-driven: Kafka, RabbitMQ'],
          tags: ['ARCHITECTURE', 'SQA']
        },
        {
          code: 'EX · 05',
          titleFr: 'Modernisation mainframe & migrations',
          titleEn: 'Mainframe modernization & migrations',
          leadFr: 'z/OS, COBOL, Natural, DB2 — vers le distribué ou le cloud, sans casse.',
          leadEn: 'z/OS, COBOL, Natural, DB2 — toward distributed or cloud, with no breakage.',
          bulletsFr: ['Stratégie de migration mainframe', 'Retour d\'expérience ISIS/LUW, sortie de Z', 'Cible : DSI grands comptes'],
          bulletsEn: ['Mainframe migration strategy', 'ISIS/LUW & Z exit feedback', 'For: large enterprise CIOs'],
          tags: ['MAINFRAME', 'MIGRATION']
        },
        {
          code: 'EX · 06',
          titleFr: 'Web sémantique & données structurées',
          titleEn: 'Semantic web & structured data',
          leadFr: 'Un différenciateur rare. Démonstration vivante : ce site lui-même.',
          leadEn: 'A rare differentiator. Live demonstration: this very site.',
          bulletsFr: ['RDF · Turtle · SPARQL', 'schema.org · ESCO · Europass', 'Oxigraph WASM en pratique'],
          bulletsEn: ['RDF · Turtle · SPARQL', 'schema.org · ESCO · Europass', 'Oxigraph WASM in practice'],
          tags: ['SEMANTIC', 'NICHE']
        },
        {
          code: 'EX · 07',
          titleFr: 'IA générative pour développeurs',
          titleEn: 'Generative AI for developers',
          leadFr: 'Outils, modèles, intégrations — sans hype, avec mesure.',
          leadEn: 'Tools, models, integrations — without hype, with measurement.',
          bulletsFr: ['Claude · Gemini · Antigravity', 'Principes des réseaux de neurones', 'Prompt engineering & intégration outillée'],
          bulletsEn: ['Claude · Gemini · Antigravity', 'Neural network principles', 'Prompt engineering & tooled integration'],
          tags: ['AI', 'AGENTIC']
        },
        {
          code: 'EX · 08',
          titleFr: 'PRA / PCA — continuité d\'activité',
          titleEn: 'DR/BCP — business continuity',
          leadFr: 'Concevoir la reprise comme une fonctionnalité, pas comme un sinistre.',
          leadEn: 'Design recovery as a feature, not as a disaster.',
          bulletsFr: ['Infra DR · load balancing · CDN', 'Exercices de bascule', 'Datacenter migration en pratique'],
          bulletsEn: ['DR infra · load balancing · CDN', 'Failover exercises', 'Datacenter migration in practice'],
          tags: ['DR', 'BCP', 'INFRA']
        },
        {
          code: 'EX · 09',
          titleFr: 'Développement full-stack moderne',
          titleEn: 'Modern full-stack development',
          leadFr: 'Front contemporain, back maîtrisé, déploiement intégré.',
          leadEn: 'Contemporary front-end, controlled back-end, integrated delivery.',
          bulletsFr: ['TypeScript · Svelte · Vue · React', 'Django · Python', 'Node.js · architecture & déploiement'],
          bulletsEn: ['TypeScript · Svelte · Vue · React', 'Django · Python', 'Node.js · architecture & deployment'],
          tags: ['FULL-STACK']
        }
      ]
    },
    {
      index: '03',
      titleFr: 'Modules spécialistes & ateliers courts',
      titleEn: 'Specialist modules & short workshops',
      captionFr: 'Sujets pointus, formats courts, à positionner finement selon le public.',
      captionEn: 'Focused topics, short formats, to position carefully by audience.',
      entries: [
        {
          code: 'SP · 01',
          titleFr: 'Blockchain — Ethereum & Solana',
          titleEn: 'Blockchain — Ethereum & Solana',
          leadFr: 'Introduction technique, sans religion.',
          leadEn: 'Technical introduction, without religion.',
          bulletsFr: ['Modèles UTXO vs comptes', 'Smart contracts (Solidity, Anchor)', 'Cas d\'usage et limites'],
          bulletsEn: ['UTXO vs account models', 'Smart contracts (Solidity, Anchor)', 'Use cases and limits'],
          tags: ['BLOCKCHAIN', 'WORKSHOP']
        },
        {
          code: 'SP · 02',
          titleFr: 'Rust — atelier découverte',
          titleEn: 'Rust — discovery workshop',
          leadFr: 'Le langage qui change la donne pour les outils CLI et systèmes.',
          leadEn: 'The language that changes the game for CLI and systems tooling.',
          bulletsFr: ['Ownership & borrowing', 'Cargo · crates · tests', 'Cas pratique : un outil CLI'],
          bulletsEn: ['Ownership & borrowing', 'Cargo · crates · tests', 'Case study: a CLI tool'],
          tags: ['RUST', 'WORKSHOP']
        },
        {
          code: 'SP · 03',
          titleFr: 'Gestion de projet Agile & budgétaire',
          titleEn: 'Agile & budget project management',
          leadFr: 'Module transverse, pensé pour équipes techniques.',
          leadEn: 'Transverse module, designed for technical teams.',
          bulletsFr: ['Scrum · Kanban en réalité', 'JIRA & instrumentation', 'Tenir un budget projet'],
          bulletsEn: ['Scrum · Kanban for real', 'JIRA & instrumentation', 'Holding a project budget'],
          tags: ['MANAGEMENT', 'TRANSVERSE']
        }
      ]
    }
  ];

  const isFr = $derived($locale?.startsWith('fr'));

  const introFr = `Catalogue raisonné des formations que je dispense — issu d'un parcours d'architecte logiciel, d'expert sécurité et d'enseignant vacataire. Les modules sont déclinables en format court (atelier), intensif (3-5 jours), ou cursus (plusieurs semaines). Tous sont organisables via Deepthought Solutions, organisme de formation enregistré en France.`;
  const introEn = `A reasoned catalogue of trainings I deliver — drawn from a career as software architect, security expert, and part-time university teacher. Modules can be packaged as short workshops, intensive (3–5 days), or full curricula. All are deliverable through Deepthought Solutions, a registered French training organization.`;
</script>

<svelte:head>
  <title>Trainings — Nicolas Karageuzian</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,30..100;1,9..144,300..900,30..100&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap"
  />
</svelte:head>

<div class="prospectus">
  <div class="paper-noise" aria-hidden="true"></div>

  <!-- MASTHEAD -->
  <header class="masthead">
    <div class="mast-meta">
      <span class="mono">VOL. I · ED. {new Date().getFullYear()}</span>
      <span class="mono dot">·</span>
      <span class="mono">NK · TRAINING PROSPECTUS</span>
      <span class="mono dot">·</span>
      <span class="mono accent">DEEPTHOUGHT SOLUTIONS</span>
    </div>
    <h1 class="mast-title">
      <span class="line-a">Catalogue</span>
      <span class="line-b"><em>de&nbsp;formations</em></span>
    </h1>
    <div class="mast-foot">
      <div class="lede">
        <p>{isFr ? introFr : introEn}</p>
      </div>
      <div class="rubric">
        <div class="rub-row"><span class="mono">§ HL</span><span>{isFr ? 'Offres phares' : 'Headline offerings'}</span><span class="mono num">06</span></div>
        <div class="rub-row"><span class="mono">§ 01</span><span>{isFr ? 'Déjà éprouvées' : 'Already proven'}</span><span class="mono num">04</span></div>
        <div class="rub-row"><span class="mono">§ 02</span><span>{isFr ? 'Pleinement instrumentées' : 'Fully instrumented'}</span><span class="mono num">09</span></div>
        <div class="rub-row"><span class="mono">§ 03</span><span>{isFr ? 'Spécialistes & ateliers' : 'Specialist & workshops'}</span><span class="mono num">03</span></div>
      </div>
    </div>
  </header>

  <!-- HEADLINE -->
  <section class="section headline-section">
    <div class="section-head">
      <span class="section-index mono">§ HL</span>
      <h2 class="section-title">{isFr ? 'Offres phares' : 'Headline offerings'}</h2>
      <p class="section-caption">
        {isFr
          ? 'Six modules taillés pour le marché actuel — sécurité, plateforme, IA, données.'
          : 'Six modules cut for today\'s market — security, platform, AI, data.'}
      </p>
    </div>

    <div class="headline-grid">
      {#each headline as h, i}
        <article class="hl-card flavour-{h.flavour ?? 'ink'}" style="--idx:{i};">
          <div class="hl-corner mono">{h.code}</div>
          <h3 class="hl-title">{isFr ? h.titleFr : h.titleEn}</h3>
          <p class="hl-lead">{isFr ? h.leadFr : h.leadEn}</p>
          <ul class="hl-bullets">
            {#each (isFr ? h.bulletsFr : h.bulletsEn) as b}
              <li>{b}</li>
            {/each}
          </ul>
          <div class="hl-tags">
            {#each h.tags as t}
              <span class="tag mono">{t}</span>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </section>

  <!-- DETAILED SECTIONS -->
  {#each sections as section}
    <section class="section detail-section">
      <div class="section-head">
        <span class="section-index mono">§ {section.index}</span>
        <h2 class="section-title">{isFr ? section.titleFr : section.titleEn}</h2>
        <p class="section-caption">{isFr ? section.captionFr : section.captionEn}</p>
      </div>

      <ol class="entry-list">
        {#each section.entries as entry, i}
          <li class="entry">
            <div class="entry-code mono">{entry.code}</div>
            <div class="entry-body">
              <h3 class="entry-title">{isFr ? entry.titleFr : entry.titleEn}</h3>
              <p class="entry-lead">{isFr ? entry.leadFr : entry.leadEn}</p>
              <ul class="entry-bullets">
                {#each (isFr ? entry.bulletsFr : entry.bulletsEn) as b}
                  <li>{b}</li>
                {/each}
              </ul>
            </div>
            <div class="entry-tags">
              {#each entry.tags as t}
                <span class="tag mono">{t}</span>
              {/each}
            </div>
          </li>
        {/each}
      </ol>
    </section>
  {/each}

  <!-- COLOPHON / CTA -->
  <footer class="colophon">
    <div class="colophon-rule"></div>
    <div class="colophon-grid">
      <div class="colo-block">
        <span class="mono label">{isFr ? 'Formats' : 'Formats'}</span>
        <p>{isFr ? 'Atelier · Intensif 3–5 j · Cursus pluri-semaines · En présentiel ou distanciel.' : 'Workshop · 3–5 day intensive · Multi-week curriculum · On-site or remote.'}</p>
      </div>
      <div class="colo-block">
        <span class="mono label">{isFr ? 'Langues' : 'Languages'}</span>
        <p>{isFr ? 'Français · Anglais. Supports trilingues sur demande.' : 'French · English. Trilingual materials on request.'}</p>
      </div>
      <div class="colo-block">
        <span class="mono label">{isFr ? 'Organisme' : 'Provider'}</span>
        <p><a href="https://deepthought-solutions.com/" target="_blank" rel="noopener noreferrer">Deepthought Solutions</a> — {isFr ? 'organisme de formation enregistré.' : 'registered training provider.'}</p>
      </div>
    </div>

    <div class="colophon-cta">
      <a class="cta-primary" href="https://deepthought-solutions.com/" target="_blank" rel="noopener noreferrer">
        <span>{isFr ? 'Composer une formation' : 'Compose a training'}</span>
        <span class="arrow">→</span>
      </a>
      <a class="cta-secondary" href="/#contact">
        {isFr ? 'Me contacter directement' : 'Contact me directly'}
      </a>
    </div>
    <div class="mark">
      <span class="mono">NK</span>
      <span class="mono small">— typeset with Fraunces &amp; IBM Plex Mono —</span>
    </div>
  </footer>
</div>

<style>
  /* Scoped reset within prospectus */
  .prospectus {
    --paper: #faf5ec;
    --paper-soft: #f3ecdf;
    --ink: #1a1410;
    --ink-soft: #4a3f37;
    --ink-faint: #1a141022;
    --rule: #1a141026;
    --cinnabar: #b6311f;
    --cinnabar-soft: #d65a47;
    --forest: #2f4a35;
    --gold: #b88a3e;

    --font-display: 'Fraunces', 'Times New Roman', serif;
    --font-body: 'Fraunces', 'Times New Roman', serif;
    --font-mono: 'IBM Plex Mono', ui-monospace, monospace;

    position: relative;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--font-body);
    font-feature-settings: 'kern' 1, 'liga' 1, 'ss01' 1;
    padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 4vw, 3.5rem);
    margin: -1rem calc(-1 * var(--padding-desktop, 1rem));
    overflow: hidden;
    isolation: isolate;
  }

  .paper-noise {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
    mix-blend-mode: multiply;
    background-image:
      radial-gradient(circle at 20% 10%, rgba(184, 138, 62, 0.08), transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(182, 49, 31, 0.06), transparent 45%),
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.18 0'/></filter><rect width='180' height='180' filter='url(%23n)'/></svg>");
  }

  .mono {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 400;
  }
  .mono.accent { color: var(--cinnabar); }
  .mono.small { font-size: 0.62rem; opacity: 0.6; }
  .dot { opacity: 0.35; }

  /* MASTHEAD */
  .masthead {
    position: relative;
    z-index: 1;
    border-top: 2px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    padding: 1.25rem 0 2.5rem;
    margin-bottom: 4rem;
  }

  .mast-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    align-items: center;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--rule);
  }

  .mast-title {
    font-family: var(--font-display);
    font-weight: 350;
    font-size: clamp(3.5rem, 10vw, 9.5rem);
    line-height: 0.88;
    letter-spacing: -0.04em;
    margin: 2.5rem 0 0;
    font-variation-settings: 'opsz' 144, 'SOFT' 30;
  }
  .mast-title .line-a { display: block; }
  .mast-title .line-b {
    display: block;
    text-align: right;
    color: var(--cinnabar);
    font-style: italic;
    font-variation-settings: 'opsz' 144, 'SOFT' 100;
    font-weight: 300;
  }

  .mast-foot {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .lede p {
    font-family: var(--font-display);
    font-size: 1.18rem;
    line-height: 1.55;
    margin: 0;
    font-weight: 350;
    color: var(--ink);
    max-width: 50ch;
    text-wrap: pretty;
  }
  .lede p::first-letter {
    font-size: 3.4em;
    float: left;
    line-height: 0.85;
    padding: 0.3rem 0.5rem 0 0;
    font-weight: 400;
    font-style: italic;
    color: var(--cinnabar);
    font-variation-settings: 'opsz' 144, 'SOFT' 60;
  }

  .rubric {
    border-left: 1px solid var(--ink);
    padding-left: 1.5rem;
  }
  .rub-row {
    display: grid;
    grid-template-columns: 5ch 1fr auto;
    align-items: baseline;
    gap: 1rem;
    padding: 0.65rem 0;
    border-bottom: 1px dotted var(--rule);
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 350;
  }
  .rub-row:last-child { border-bottom: none; }
  .rub-row .num { opacity: 0.5; }

  @media (max-width: 720px) {
    .mast-foot { grid-template-columns: 1fr; gap: 2rem; }
    .rubric { border-left: none; border-top: 1px solid var(--ink); padding-left: 0; padding-top: 1rem; }
  }

  /* SECTIONS */
  .section {
    position: relative;
    z-index: 1;
    margin: 5rem 0;
  }
  .section-head {
    display: grid;
    grid-template-columns: 7ch 1fr;
    column-gap: 2rem;
    row-gap: 0.5rem;
    align-items: baseline;
    margin-bottom: 2.5rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid var(--ink);
  }
  .section-index {
    align-self: start;
    padding-top: 0.6rem;
    color: var(--cinnabar);
    font-weight: 500;
  }
  .section-title {
    font-family: var(--font-display);
    font-weight: 350;
    font-style: italic;
    font-size: clamp(1.9rem, 4vw, 3.2rem);
    line-height: 1;
    letter-spacing: -0.02em;
    margin: 0;
    font-variation-settings: 'opsz' 144, 'SOFT' 80;
  }
  .section-caption {
    grid-column: 2;
    margin: 0.4rem 0 0;
    font-size: 0.95rem;
    color: var(--ink-soft);
    max-width: 60ch;
    line-height: 1.5;
  }

  /* HEADLINE GRID */
  .headline-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.25rem;
  }
  .hl-card {
    grid-column: span 6;
    position: relative;
    background: var(--paper-soft);
    border: 1px solid var(--ink);
    padding: 2rem 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), background 0.4s;
    animation: rise 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
    animation-delay: calc(var(--idx) * 60ms);
  }
  .hl-card::before {
    content: "";
    position: absolute;
    inset: 6px;
    border: 1px solid var(--rule);
    pointer-events: none;
  }
  .hl-card:hover {
    transform: translateY(-3px);
    background: var(--paper);
  }
  .hl-card:nth-child(3n+1) { grid-column: span 6; }
  .hl-card:nth-child(2) { grid-column: span 6; }

  @media (min-width: 980px) {
    .hl-card:nth-child(1) { grid-column: span 7; }
    .hl-card:nth-child(2) { grid-column: span 5; }
    .hl-card:nth-child(3) { grid-column: span 4; }
    .hl-card:nth-child(4) { grid-column: span 4; }
    .hl-card:nth-child(5) { grid-column: span 4; }
    .hl-card:nth-child(6) { grid-column: span 12; }
  }
  @media (max-width: 720px) {
    .hl-card { grid-column: span 12 !important; }
  }

  .hl-corner {
    position: absolute;
    top: 0.85rem;
    right: 1rem;
    color: var(--ink);
    opacity: 0.6;
  }
  .flavour-cinnabar .hl-corner { color: var(--cinnabar); opacity: 0.9; }
  .flavour-forest .hl-corner { color: var(--forest); opacity: 0.9; }
  .flavour-ink .hl-corner { color: var(--gold); opacity: 0.9; }

  .hl-title {
    font-family: var(--font-display);
    font-weight: 350;
    font-size: clamp(1.5rem, 2.6vw, 2.1rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0;
    max-width: 22ch;
    font-variation-settings: 'opsz' 144, 'SOFT' 50;
  }
  .flavour-cinnabar .hl-title em,
  .flavour-cinnabar .hl-title { color: var(--ink); }
  .flavour-cinnabar .hl-title::after {
    content: " ●";
    color: var(--cinnabar);
    font-size: 0.55em;
    vertical-align: 0.4em;
  }
  .flavour-forest .hl-title::after {
    content: " ●";
    color: var(--forest);
    font-size: 0.55em;
    vertical-align: 0.4em;
  }
  .flavour-ink .hl-title::after {
    content: " ●";
    color: var(--gold);
    font-size: 0.55em;
    vertical-align: 0.4em;
  }

  .hl-lead {
    font-family: var(--font-display);
    font-style: italic;
    color: var(--ink-soft);
    font-size: 1.02rem;
    line-height: 1.45;
    margin: 0;
    max-width: 38ch;
    font-variation-settings: 'opsz' 14, 'SOFT' 70;
  }

  .hl-bullets {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0.75rem;
    border-top: 1px dotted var(--rule);
    padding-top: 0.75rem;
  }
  .hl-bullets li {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.6;
    letter-spacing: 0.02em;
    padding: 0.15rem 0;
    color: var(--ink);
  }
  .hl-bullets li::before {
    content: "→ ";
    color: var(--cinnabar);
    margin-right: 0.4rem;
  }
  .flavour-forest .hl-bullets li::before { color: var(--forest); }
  .flavour-ink .hl-bullets li::before { color: var(--gold); }

  .hl-tags {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding-top: 0.5rem;
  }
  .tag {
    display: inline-block;
    padding: 0.18rem 0.55rem;
    border: 1px solid var(--ink-faint);
    background: transparent;
    font-size: 0.62rem;
    color: var(--ink-soft);
  }

  /* DETAIL ENTRY LIST */
  .entry-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .entry {
    display: grid;
    grid-template-columns: 9ch 1fr 14ch;
    column-gap: 2rem;
    align-items: start;
    padding: 1.6rem 0;
    border-bottom: 1px solid var(--rule);
    position: relative;
    transition: background 0.3s;
  }
  .entry:hover {
    background: linear-gradient(90deg, transparent, rgba(184, 138, 62, 0.06) 30%, rgba(184, 138, 62, 0.06) 70%, transparent);
  }
  .entry:last-child { border-bottom: none; }

  .entry-code {
    padding-top: 0.4rem;
    color: var(--cinnabar);
    font-weight: 500;
  }
  .entry-title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.45rem;
    line-height: 1.1;
    letter-spacing: -0.015em;
    margin: 0 0 0.4rem;
    font-variation-settings: 'opsz' 36, 'SOFT' 40;
  }
  .entry-lead {
    font-family: var(--font-display);
    font-style: italic;
    color: var(--ink-soft);
    margin: 0 0 0.65rem;
    font-size: 1rem;
    line-height: 1.45;
    max-width: 58ch;
    font-variation-settings: 'opsz' 14, 'SOFT' 70;
  }
  .entry-bullets {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0 1.5rem;
  }
  .entry-bullets li {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    line-height: 1.7;
    color: var(--ink);
    position: relative;
    padding-left: 0.9rem;
  }
  .entry-bullets li::before {
    content: "·";
    position: absolute;
    left: 0;
    color: var(--cinnabar);
    font-weight: 700;
  }
  .entry-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: flex-end;
    padding-top: 0.45rem;
  }

  @media (max-width: 820px) {
    .entry {
      grid-template-columns: 1fr;
      row-gap: 0.6rem;
    }
    .entry-tags { justify-content: flex-start; }
  }

  /* COLOPHON */
  .colophon {
    position: relative;
    z-index: 1;
    margin-top: 6rem;
    padding-top: 2rem;
  }
  .colophon-rule {
    height: 0;
    border-top: 2px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    height: 6px;
    margin-bottom: 2.5rem;
  }
  .colophon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 2.5rem;
  }
  .colo-block .label {
    display: block;
    color: var(--cinnabar);
    margin-bottom: 0.6rem;
  }
  .colo-block p {
    font-family: var(--font-display);
    font-size: 1.05rem;
    line-height: 1.5;
    margin: 0;
    color: var(--ink);
    max-width: 28ch;
  }
  .colo-block a {
    color: var(--cinnabar);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  @media (max-width: 720px) {
    .colophon-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  }

  .colophon-cta {
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    align-items: center;
  }
  .cta-primary {
    display: inline-flex;
    align-items: baseline;
    gap: 1rem;
    background: var(--ink);
    color: var(--paper);
    padding: 1.1rem 1.6rem;
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-style: italic;
    text-decoration: none;
    border: 1px solid var(--ink);
    transition: background 0.3s, color 0.3s, transform 0.3s;
    font-variation-settings: 'opsz' 36, 'SOFT' 90;
  }
  .cta-primary:hover {
    background: var(--cinnabar);
    border-color: var(--cinnabar);
    transform: translateY(-2px);
  }
  .cta-primary .arrow {
    font-family: var(--font-display);
    font-style: normal;
    transition: transform 0.3s;
  }
  .cta-primary:hover .arrow {
    transform: translateX(6px);
  }
  .cta-secondary {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink);
    text-decoration: none;
    border-bottom: 1px solid var(--ink);
    padding-bottom: 0.15rem;
  }
  .cta-secondary:hover { color: var(--cinnabar); border-color: var(--cinnabar); }

  .mark {
    margin-top: 3rem;
    display: flex;
    align-items: baseline;
    gap: 1rem;
    border-top: 1px dotted var(--rule);
    padding-top: 1rem;
  }
  .mark .mono:first-child {
    font-size: 1.2rem;
    letter-spacing: 0.2em;
    color: var(--cinnabar);
    font-weight: 500;
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Override sveltepress page-layout h2 borders within our prospectus */
  :global(.theme-default--page-layout .prospectus h2) {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
  }

  @media print {
    .prospectus { background: white; padding: 0; }
    .paper-noise { display: none; }
    .hl-card, .entry { break-inside: avoid; }
  }
</style>
