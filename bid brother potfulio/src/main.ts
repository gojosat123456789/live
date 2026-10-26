import './style.css'

const phoneNumber = '03068778018'
const whatsappNumber = '923068778018'
const birdsScriptUrls = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js',
  'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js',
]

interface VantaBirdsEffect {
  destroy: () => void
}

interface VantaBirdsOptions {
  el: HTMLElement
  mouseControls: boolean
  touchControls: boolean
  gyroControls: boolean
  minHeight: number
  minWidth: number
  scale: number
  scaleMobile: number
}

declare global {
  interface Window {
    VANTA?: {
      BIRDS?: (options: VantaBirdsOptions) => VantaBirdsEffect
    }
  }
}

const projects = [
  {
    title: 'Serein Cafe',
    category: 'business',
    type: 'BUSINESS WEBSITE CONCEPT',
    description: 'A warm, welcoming website concept for a neighbourhood cafe.',
    detail: 'An editorial landing page concept with a calm palette, clear cafe information, and a responsive layout.',
    art: 'art-cafe',
    tags: ['Responsive UI', 'Website concept'],
  },
  {
    title: 'Casa Noir',
    category: 'business',
    type: 'HOTEL WEBSITE CONCEPT',
    description: 'A cinematic landing page concept for a boutique hotel.',
    detail: 'A hospitality website exploration using atmospheric imagery, considered typography, and a simple guest journey.',
    art: 'art-hotel',
    tags: ['Landing page', 'Hospitality'],
  },
  {
    title: 'Studio UA',
    category: 'portfolio',
    type: 'PORTFOLIO WEBSITE CONCEPT',
    description: 'A polished developer portfolio concept with a bold editorial hero.',
    detail: 'A personal portfolio website exploration pairing oversized typography, a clear work showcase, and a responsive layout.',
    art: 'art-portfolio',
    tags: ['Portfolio UI', 'Responsive design'],
  },
  {
    title: 'Vanta Footwear',
    category: 'ecommerce',
    type: 'SHOES E-COMMERCE CONCEPT',
    description: 'A premium shoe-store landing page concept with a bold editorial feel.',
    detail: 'A conceptual footwear storefront exploring product presentation, editorial art direction, and a clear shopping experience.',
    art: 'art-shoe',
    tags: ['E-commerce UI', 'Footwear concept'],
  },
]

const navItems = [
  ['home', 'Home', 'index.html'],
  ['about', 'About', 'about.html'],
  ['skills', 'Skills', 'skills.html'],
  ['projects', 'Projects', 'projects.html'],
  ['services', 'Services', 'services.html'],
  ['experience', 'Experience', 'experience.html'],
  ['resume', 'Resume', 'resume.html'],
  ['contact', 'Contact', 'contact.html'],
]

function projectCard(project: typeof projects[number], index: number): string {
  return `
    <article class="project-card" data-category="${project.category}">
      <button class="project-art ${project.art}" type="button" data-project="${index}" aria-label="View ${project.title} concept details">
        ${project.art === 'art-cafe' ? '<span class="window-sun"></span><span class="window-hill hill-one"></span><span class="window-hill hill-two"></span><span class="cafe-menu"><span class="mini-label">SLOW MORNINGS, GOOD COFFEE</span><strong>Serein<br><i>Cafe</i></strong><span class="menu-rule"></span><span class="menu-small">A PLACE TO PAUSE</span></span>' : ''}
        ${project.art === 'art-hotel' ? '<span class="hotel-sun"></span><span class="hotel-arch"><span class="hotel-view"></span><span class="hotel-caption">STAY A LITTLE LONGER</span></span><span class="hotel-wordmark">CASA <i>NOIR</i></span>' : ''}
        ${project.art === 'art-form' ? '<span class="form-orbit"></span><span class="form-mark">F<span>&</span>F</span><span class="form-name">FORM<br>AND FIELD</span>' : ''}
        ${project.art === 'art-portfolio' ? '<span class="portfolio-orbit"></span><span class="portfolio-brand">UA<span>.</span></span><span class="portfolio-preview"><span>DESIGN · BUILD · CREATE</span><strong>Digital<br>Experiences<span>.</span></strong><i>SELECTED WORK — 2026</i></span>' : ''}
        ${project.art === 'art-pulse' ? '<span class="pulse-top"><span>PULSE / CONCEPT</span><span>YOUR DAY, IN FLOW</span></span><span class="pulse-card"><span class="pulse-greeting">A MOMENT TO FOCUS</span><strong>Make space<br>for what <i>matters.</i></strong><span class="pulse-bottom"><span>01 — FOCUS</span><span class="pulse-play">↗</span></span></span>' : ''}
        ${project.art === 'art-shoe' ? '<span class="shoe-edition">OBJECTS FOR<br>THE EVERYDAY</span><span class="shoe-shape"><span class="shoe-sole"></span><span class="shoe-upper"></span><span class="shoe-detail"></span></span><span class="shoe-brand">VANTA <i>01</i></span>' : ''}
        <span class="art-stamp">${String(index + 1).padStart(2, '0')} / ${project.type}</span>
        <span class="project-arrow" aria-hidden="true">↗</span>
      </button>
      <div class="project-info">
        <div><h3>${project.title}</h3><p>${project.description}</p></div>
        <span class="project-type">${project.category.toUpperCase()}</span>
      </div>
      <div class="tech-labels">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <button class="project-detail-link" type="button" data-project="${index}">Explore concept <span aria-hidden="true">↗</span></button>
    </article>`
}

function projectsSection(preview = false): string {
  const items = preview ? projects.slice(0, 2) : projects
  return `
    <section class="work-section section-shell" id="work">
      <div class="section-kicker"><span>0${preview ? 2 : 1}</span> ${preview ? 'SELECTED CONCEPTS' : 'PROJECT EXPLORATIONS'}</div>
      <div class="section-heading-row">
        <h2>${preview ? 'A few ideas,<br><span>taking shape.</span>' : 'Made to make<br><span>an impression.</span>'}</h2>
        <p>These are illustrative concept studies—not launched client projects. Live and source links will be added when real projects are ready.</p>
      </div>
      ${preview ? '' : `<div class="project-filters" role="group" aria-label="Filter projects">
        <button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">All <span>04</span></button>
        <button class="filter-button" type="button" data-filter="business" aria-pressed="false">Business <span>02</span></button>
        <button class="filter-button" type="button" data-filter="ecommerce" aria-pressed="false">E-commerce <span>01</span></button>
        <button class="filter-button" type="button" data-filter="portfolio" aria-pressed="false">Portfolio <span>01</span></button>
      </div>`}
      <div class="project-grid">${items.map((project) => projectCard(project, projects.indexOf(project))).join('')}</div>
      <p class="concept-note">Concept explorations only · Demo and source-code links are not available yet.</p>
      ${preview ? '<a class="button button-outline section-more" href="projects.html">View all concepts <span aria-hidden="true">↗</span></a>' : ''}
    </section>`
}

const skills = [
  { group: 'FRONTEND', items: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design', 'React.js'] },
  { group: 'BACKEND', items: ['PHP', 'Laravel', 'Node.js', 'Express.js', 'REST APIs'] },
  { group: 'DATABASES', items: ['MySQL', 'MongoDB'] },
  { group: 'TOOLS', items: ['Git', 'GitHub', 'VS Code'] },
]

function skillsSection(preview = false): string {
  const groups = preview ? skills.slice(0, 2) : skills
  return `
    <section class="skills-section section-shell" id="skills">
      <div class="section-kicker"><span>0${preview ? 3 : 1}</span> TECH TOOLKIT</div>
      <div class="skills-content">
        <div class="skills-heading"><h2>Tools for turning<br><span>ideas into reality.</span></h2><p>Technologies suggested for this portfolio. Please confirm which ones reflect your real experience before publishing.</p></div>
        <div class="skill-groups">${groups.map(({ group, items }) => `<div class="skill-group"><span class="skill-label">${group}</span><div class="skill-tags">${items.map((item) => `<span>${item}</span>`).join('')}</div></div>`).join('')}</div>
        <p class="details-note">No proficiency percentages are shown. Remove any tools you have not used.</p>
        ${preview ? '<a class="text-link" href="skills.html">See all technologies <span aria-hidden="true">↗</span></a>' : ''}
      </div>
    </section>`
}

const services = [
  ['01', 'Custom websites', 'Distinctive websites shaped around your brand and goals.'],
  ['02', 'Business & portfolio sites', 'Clear, polished online homes for people and businesses.'],
  ['03', 'E-commerce websites', 'Responsive storefront concepts that make browsing simple.'],
  ['04', 'Web applications', 'Interactive experiences built with modern web technologies.'],
  ['05', 'Responsive UI development', 'Interfaces designed to work across screen sizes.'],
  ['06', 'Maintenance & bug fixes', 'Practical updates, fixes, and ongoing website care.'],
]

const serviceCards = services.map(([number, title, description]) => `
  <article class="service-card">
    <span class="service-number">${number}</span><span class="service-icon" aria-hidden="true">✳</span>
    <h3>${title}</h3><p>${description}</p>
    <a href="contact.html" aria-label="Ask about ${title}">Discuss a project <span aria-hidden="true">↗</span></a>
  </article>`).join('')

const pageContent: Record<string, string> = {
  home: `
    <main>
      <section class="hero section-shell" id="home">
        <div class="hero-copy">
          <p class="eyebrow"><span class="status-dot"></span> WEB DEVELOPER <span class="eyebrow-location">· PAKISTAN</span></p>
          <h1>Building<br>digital <span class="name-highlight">worlds.</span></h1>
          <p class="hero-intro">I'm <strong>Umair Akbar</strong> — I build modern websites and web experiences with thoughtful design, responsive layouts, and useful functionality.</p>
          <div class="hero-actions"><a class="button button-primary" href="projects.html">View my work <span aria-hidden="true">↘</span></a><a class="text-link" href="contact.html">Hire me <span aria-hidden="true">↗</span></a></div>
          <div class="hero-meta"><span>DESIGN-MINDED DEVELOPMENT</span><span class="meta-divider"></span><span>BUILT FOR THE WEB</span></div>
        </div>
        <div class="hero-visual" aria-label="Portrait of Umair Akbar">
          <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
          <div class="portrait-frame"><img src="/umair-akbar.jpg" alt="Portrait of Umair Akbar" fetchpriority="high"><span class="portrait-caption">UMAIR AKBAR <span>✳</span> DEVELOPER</span></div>
          <div class="float-card float-note"><span class="note-star">✳</span><span>Code with purpose.<br>Design with care.</span></div>
          <div class="float-card float-index">01 <span>/ 08</span></div>
        </div>
        <a class="scroll-cue" href="#about"><span></span> SCROLL TO EXPLORE</a>
      </section>
      <section class="intro-section section-shell" id="about">
        <div class="section-kicker"><span>01</span> ABOUT ME</div><div class="intro-content">
          <h2>Ideas into interfaces.<br><span>Purpose into pixels.</span></h2>
          <div class="intro-bottom"><p>I'm Umair Akbar, a web developer interested in creating polished, responsive digital experiences. I enjoy bringing together thoughtful visual design and practical web functionality.</p><a class="circle-link" href="about.html" aria-label="Read more about Umair">ABOUT<br>UMAIR <span>↘</span></a></div>
        </div>
      </section>
      ${projectsSection(true)}
      ${skillsSection(true)}
      <section class="services-section section-shell">
        <div class="section-kicker"><span>04</span> SERVICES</div>
        <div class="services-content"><h2>From first sketch<br><span>to final launch.</span></h2><div class="value-list">${services.slice(0, 3).map(([number, title, description]) => `<div class="value-row"><span>${number}</span><h3>${title}</h3><p>${description}</p><span class="value-icon">↗</span></div>`).join('')}</div><a class="text-link" href="services.html">Explore services <span aria-hidden="true">↗</span></a></div>
      </section>
      <section class="process-section section-shell"><div class="section-kicker"><span>05</span> THE PROCESS</div><div class="process-content"><h2>Good work, step<br><span>by thoughtful step.</span></h2><div class="process-steps">${processSteps()}</div></div></section>
      <section class="home-cta section-shell"><div><p class="eyebrow"><span class="status-dot"></span> HAVE A PROJECT IN MIND?</p><h2>Let's build<br><span>something great.</span></h2></div><a class="button button-primary" href="contact.html">Get in touch <span aria-hidden="true">↗</span></a></section>
    </main>`,
  about: `
    <main>
      <section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> A LITTLE ABOUT ME</p><h1>Meet <span class="name-highlight">Umair.</span></h1><p class="page-lede">A curious web developer who enjoys making the internet feel a little more thoughtful.</p></section>
      <section class="about-feature section-shell">
        <div class="about-photo"><img src="/umair-akbar.jpg" alt="Umair Akbar" loading="lazy"><span class="photo-caption">UMAIR AKBAR · PAKISTAN</span></div>
        <div class="about-copy"><span class="section-kicker"><span>01</span> THE PERSON BEHIND THE PIXELS</span><h2>Good technology<br><span>should feel human.</span></h2><p>I'm Umair Akbar. I'm interested in web development and the craft of turning ideas into clear, useful digital experiences. I value thoughtful layouts, responsive design, accessible interfaces, and the details that make a website feel finished.</p><p>This portfolio is a work in progress. As my projects and experience grow, I'll share the real work and lessons here.</p><a class="button button-outline" href="projects.html">Explore concepts <span aria-hidden="true">↗</span></a></div>
      </section>
      <section class="about-values section-shell"><div class="section-kicker"><span>02</span> HOW I APPROACH THE WORK</div><div class="value-grid"><article><span>01 / CLARITY</span><h3>Make it easy to understand.</h3><p>Start with what people need, and keep the experience clear.</p></article><article><span>02 / CRAFT</span><h3>Care about the details.</h3><p>Good visual design and dependable functionality belong together.</p></article><article><span>03 / CURIOSITY</span><h3>Keep learning.</h3><p>Stay open to new ideas and better ways to solve problems.</p></article></div></section>
      <section class="empty-detail section-shell"><span class="section-kicker"><span>03</span> EDUCATION & EXPERIENCE</span><div><h2>Your real story goes here.</h2><p>Education, roles, dates, and achievements have not been provided yet. Add confirmed details when you're ready.</p><a class="text-link" href="experience.html">Experience page <span aria-hidden="true">↗</span></a></div></section>
    </main>`,
  skills: `
    <main><section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> TECH TOOLKIT</p><h1>Built with<br><span class="name-highlight">the right tools.</span></h1><p class="page-lede">A flexible web toolkit. This suggested list needs your confirmation before it's presented as your experience.</p></section>
      ${skillsSection(false)}
      <section class="notice-box section-shell"><span class="notice-icon" aria-hidden="true">i</span><div><h2>Make this list yours.</h2><p>Only keep technologies you've actually used. Tell me which skills are correct and I can update the portfolio; proficiency percentages are intentionally omitted.</p></div></section>
      <section class="home-cta section-shell"><div><p class="eyebrow"><span class="status-dot"></span> READY TO DISCUSS AN IDEA?</p><h2>Let's make<br><span>something useful.</span></h2></div><a class="button button-primary" href="contact.html">Contact me <span aria-hidden="true">↗</span></a></section>
    </main>`,
  projects: `
    <main><section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> SELECTED EXPLORATIONS</p><h1>Ideas in<br><span class="name-highlight">the making.</span></h1><p class="page-lede">An evolving gallery of visual concepts. Each card is labeled clearly so concept work isn't mistaken for a launched client project.</p></section>
      ${projectsSection(false)}
      <section class="notice-box section-shell"><span class="notice-icon" aria-hidden="true">i</span><div><h2>Live work will go here.</h2><p>Real screenshots, repository links, and demos can be added when actual project details are available. No fake links or client claims are shown.</p></div></section>
    </main>`,
  services: `
    <main><section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> WAYS TO WORK TOGETHER</p><h1>Websites built<br><span class="name-highlight">with intention.</span></h1><p class="page-lede">A selection of web design and development services. Contact me to talk through your needs and confirm scope.</p></section>
      <section class="services-page-section section-shell"><div class="services-grid">${serviceCards}</div><p class="concept-note">No fixed prices are listed; project scope and requirements determine the quote.</p></section>
      <section class="process-section section-shell"><div class="section-kicker"><span>01</span> HOW A PROJECT FLOWS</div><div class="process-content"><h2>From first idea<br><span>to a thoughtful launch.</span></h2><div class="process-steps">${processSteps()}</div></div></section>
      <section class="home-cta section-shell"><div><p class="eyebrow"><span class="status-dot"></span> HAVE A PROJECT IN MIND?</p><h2>Let's talk<br><span>about it.</span></h2></div><a class="button button-primary" href="contact.html">Get a quote <span aria-hidden="true">↗</span></a></section>
    </main>`,
  experience: `
    <main><section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> THE JOURNEY SO FAR</p><h1>Experience &<br><span class="name-highlight">education.</span></h1><p class="page-lede">A place for the real roles, learning, and milestones that shape my work.</p></section>
      <section class="timeline-section section-shell"><div class="section-kicker"><span>01</span> PROFESSIONAL EXPERIENCE</div><div class="empty-detail"><span class="timeline-dot"></span><div><span class="timeline-date">DETAILS TO BE ADDED</span><h2>Your work history, accurately told.</h2><p>Job titles, companies, dates, and responsibilities haven't been provided. This section will be updated when you share confirmed details.</p></div></div></section>
      <section class="timeline-section section-shell"><div class="section-kicker"><span>02</span> EDUCATION</div><div class="empty-detail"><span class="timeline-dot"></span><div><span class="timeline-date">DETAILS TO BE ADDED</span><h2>Your education belongs here.</h2><p>School, institution, qualification, and dates are intentionally left blank until you provide them.</p></div></div></section>
      <section class="timeline-section section-shell"><div class="section-kicker"><span>03</span> CERTIFICATIONS & ACHIEVEMENTS</div><div class="empty-detail"><span class="timeline-dot"></span><div><span class="timeline-date">OPTIONAL</span><h2>Add verified credentials.</h2><p>No certificates or awards have been listed. Add only achievements you can verify.</p></div></div></section>
    </main>`,
  contact: `
    <main><section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> GET IN TOUCH</p><h1>Let's talk<br><span class="name-highlight">about your idea.</span></h1><p class="page-lede">Have a website or digital project in mind? Send a note or contact me directly on WhatsApp.</p></section>
      <section class="contact-page section-shell"><div class="contact-details"><span class="section-kicker"><span>01</span> CONTACT DETAILS</span><h2>Start a conversation.</h2><p>For a quick reply, message me on WhatsApp or call the number below.</p><a class="contact-method" href="https://wa.me/${whatsappNumber}" target="_blank" rel="noreferrer"><span>WHATSAPP</span><strong>${phoneNumber}</strong><span aria-hidden="true">↗</span></a><a class="contact-method" href="tel:+92${phoneNumber.slice(1)}"><span>PHONE</span><strong>${phoneNumber}</strong><span aria-hidden="true">↗</span></a><p class="details-note">Email and social profile links can be added when you provide them.</p></div>
        <form class="contact-form contact-form-full" id="contact-form" novalidate><h2>Tell me about it.</h2>
          <div class="form-field"><label for="full-name">Your name</label><input id="full-name" name="name" autocomplete="name" aria-describedby="name-error" required><span class="field-error" id="name-error"></span></div>
          <div class="form-field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" aria-describedby="email-error" required><span class="field-error" id="email-error"></span></div>
          <div class="form-field"><label for="subject">Subject</label><input id="subject" name="subject" aria-describedby="subject-error" required><span class="field-error" id="subject-error"></span></div>
          <div class="form-field"><label for="message">Message</label><textarea id="message" name="message" rows="4" aria-describedby="message-error" required></textarea><span class="field-error" id="message-error"></span></div>
          <p class="form-setup-notice" role="status">Email delivery isn't configured yet. Submitting this form will not send or store your message. Please use the WhatsApp link above to contact me directly.</p>
          <button class="button button-primary" type="submit">Check my message <span aria-hidden="true">↗</span></button><p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>
    </main>`,
  resume: `
    <main><section class="page-hero section-shell"><p class="eyebrow"><span class="status-dot"></span> RESUME</p><h1>A professional<br><span class="name-highlight">snapshot.</span></h1><p class="page-lede">A concise introduction to my interests and web technology toolkit.</p></section>
      <section class="resume-sheet section-shell"><div class="resume-header"><div><span class="resume-label">WEB DEVELOPER</span><h2>Umair Akbar</h2><p>Pakistan · <a href="tel:+92${phoneNumber.slice(1)}">${phoneNumber}</a></p></div><span class="resume-monogram">UA<span>.</span></span></div>
        <div class="resume-block"><h3>Profile</h3><p>Web developer interested in building responsive websites and practical digital experiences with thoughtful visual design.</p></div>
        <div class="resume-block"><h3>Technology toolkit <span class="resume-caveat">TO CONFIRM</span></h3><p>HTML5 · CSS3 · JavaScript · React.js · PHP · Laravel · Node.js · Express.js · MySQL · MongoDB · Git · REST APIs</p><p class="details-note">Confirm or remove skills to accurately reflect your experience.</p></div>
        <div class="resume-block"><h3>Experience & education</h3><p>Details will be added when confirmed information is provided. No employment or qualifications are fabricated.</p></div>
        <div class="cv-download"><div><h3>Download my CV</h3><p class="cv-status" role="status">CV not added yet. To enable downloads, place your PDF at <code>public/assets/documents/umair-akbar-cv.pdf</code>.</p></div><a class="button button-disabled" id="cv-download" aria-disabled="true">CV unavailable <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>`,
}

function processSteps(): string {
  return [
    ['01', 'Discover', 'Understand your goals and audience.'],
    ['02', 'Plan', 'Shape the scope and direction.'],
    ['03', 'Design', 'Find the right visual approach.'],
    ['04', 'Develop', 'Build a responsive experience.'],
    ['05', 'Test', 'Check details across screens.'],
    ['06', 'Launch', 'Prepare the work for the web.'],
  ].map(([number, title, description]) => `<article><span>${number}</span><h3>${title}</h3><p>${description}</p></article>`).join('')
}

const page = document.body.dataset.page ?? 'home'
const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('Portfolio root element #app was not found.')
if (!pageContent[page]) throw new Error(`Unknown portfolio page "${page}".`)

app.innerHTML = `
  <header class="site-header" id="top">
    <a class="wordmark" href="index.html" aria-label="Umair Akbar home">UA<span>.</span></a>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav"><span></span><span></span></button>
    <nav class="main-nav" id="main-nav" aria-label="Main navigation">
      ${navItems.map(([id, label, href]) => `<a href="${href}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <a class="header-cta" href="contact.html">Hire me <span aria-hidden="true">↗</span></a>
  </header>
  ${pageContent[page]}
  <footer class="site-footer section-shell">
    <a class="wordmark" href="index.html" aria-label="Back to Umair Akbar home">UA<span>.</span></a>
    <p>© ${new Date().getFullYear()} Umair Akbar. Built with purpose.</p>
    <div class="footer-links"><span>PROFILE LINKS TO BE ADDED</span><a href="#top">BACK TO TOP ↑</a></div>
  </footer>
  <div class="project-modal" id="project-modal" hidden>
    <div class="modal-backdrop" data-modal-close></div>
    <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
      <button class="modal-close" type="button" aria-label="Close project details">×</button>
      <span class="section-kicker">PROJECT CONCEPT</span>
      <h2 id="modal-title"></h2><p id="modal-description"></p>
      <p class="modal-note">Illustrative concept only. A live demo and source-code link are not available.</p>
      <a class="button button-primary" href="contact.html">Discuss a project <span aria-hidden="true">↗</span></a>
    </section>
  </div>
  <a class="back-to-top" href="#top" aria-label="Back to top">↑</a>
`

const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
const navigation = document.querySelector<HTMLElement>('.main-nav')
menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true'
  menuToggle.setAttribute('aria-expanded', String(!open))
  menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation')
  navigation?.classList.toggle('is-open', !open)
})
navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false')
    menuToggle?.setAttribute('aria-label', 'Open navigation')
    navigation?.classList.remove('is-open')
  })
})

document.querySelectorAll<HTMLButtonElement>('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter
    document.querySelectorAll<HTMLButtonElement>('.filter-button').forEach((item) => {
      const active = item === button
      item.classList.toggle('is-active', active)
      item.setAttribute('aria-pressed', String(active))
    })
    document.querySelectorAll<HTMLElement>('.project-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter
    })
  })
})

const modal = document.querySelector<HTMLDivElement>('#project-modal')
let modalTrigger: HTMLButtonElement | null = null
function closeModal(): void {
  if (!modal) return
  modal.hidden = true
  document.body.classList.remove('modal-open')
  modalTrigger?.focus()
}
document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!modal) return
    const project = projects[Number(trigger.dataset.project)]
    if (!project) return
    modalTrigger = trigger
    modal.querySelector<HTMLElement>('#modal-title')!.textContent = project.title
    modal.querySelector<HTMLElement>('#modal-description')!.textContent = project.detail
    modal.hidden = false
    document.body.classList.add('modal-open')
    modal.querySelector<HTMLButtonElement>('.modal-close')?.focus()
  })
})
modal?.querySelectorAll<HTMLElement>('[data-modal-close], .modal-close').forEach((control) => control.addEventListener('click', closeModal))
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.hidden) closeModal()
  if (event.key === 'Tab' && modal && !modal.hidden) {
    const focusable = [...modal.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')]
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }
})

document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault()
  const form = event.currentTarget as HTMLFormElement
  const fields = [
    { name: 'name', errorId: 'name-error', label: 'Name' },
    { name: 'email', errorId: 'email-error', label: 'Email' },
    { name: 'subject', errorId: 'subject-error', label: 'Subject' },
    { name: 'message', errorId: 'message-error', label: 'Message' },
  ]
  let valid = true
  fields.forEach(({ name, errorId, label }) => {
    const input = form.elements.namedItem(name)
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) return
    const error = document.getElementById(errorId)
    const value = input.value.trim()
    let message = ''
    if (!value) message = `${label} is required.`
    else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email address.'
    input.setAttribute('aria-invalid', String(Boolean(message)))
    if (error) error.textContent = message
    if (message) valid = false
  })
  const status = form.querySelector<HTMLElement>('.form-status')
  if (status) status.textContent = valid
    ? 'Your details look valid, but email delivery is not configured. Please use the WhatsApp contact above.'
    : 'Please fix the highlighted fields and try again.'
})

const cvLink = document.querySelector<HTMLAnchorElement>('#cv-download')
if (cvLink) {
  fetch('/assets/documents/umair-akbar-cv.pdf', { method: 'HEAD' }).then((response) => {
    const isPdf = response.headers.get('content-type')?.toLowerCase().includes('application/pdf') ?? false
    if (response.ok && isPdf) {
      cvLink.href = '/assets/documents/umair-akbar-cv.pdf'
      cvLink.removeAttribute('aria-disabled')
      cvLink.classList.remove('button-disabled')
      cvLink.textContent = 'Download CV ↗'
      cvLink.setAttribute('download', 'umair-akbar-cv.pdf')
      const status = document.querySelector<HTMLElement>('.cv-status')
      if (status) status.textContent = 'Your CV is ready to download.'
    } else {
      const status = document.querySelector<HTMLElement>('.cv-status')
      if (status) status.textContent = 'CV unavailable. Add the PDF at public/assets/documents/umair-akbar-cv.pdf to enable downloads.'
    }
  }).catch(() => {
    const status = document.querySelector<HTMLElement>('.cv-status')
    if (status) status.textContent = 'CV unavailable. Add the PDF at public/assets/documents/umair-akbar-cv.pdf to enable downloads.'
  })
}

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        currentObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.section-kicker, .intro-content, .project-card, .skills-content, .service-card, .process-steps article, .about-copy, .about-values article, .contact-form-full, .resume-sheet').forEach((element) => {
    element.classList.add('reveal')
    observer.observe(element)
  })
}

function loadExternalScript(id: string, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null
    if (existing?.dataset.loaded === 'true') {
      resolve()
      return
    }

    const script = existing ?? document.createElement('script')
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      resolve()
    }, { once: true })
    script.addEventListener('error', () => {
      reject(new Error(`Unable to load the Halo animation library: ${src}`))
    }, { once: true })
    if (!existing) {
      script.id = id
      script.src = src
      script.async = true
      document.head.append(script)
    }
  })
}

async function initializeBirdsBackground(): Promise<void> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const root = document.createElement('div')
  root.className = 'vanta-background'
  root.setAttribute('aria-hidden', 'true')
  document.body.prepend(root)

  try {
    await loadExternalScript('three-js-r134', birdsScriptUrls[0])
    await loadExternalScript('vanta-birds', birdsScriptUrls[1])
    const birds = window.VANTA?.BIRDS
    if (!birds) throw new Error('Vanta Birds did not initialize correctly.')

    birds({
      el: root,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
    })
  } catch (error) {
    root.remove()
    console.warn('Animated Birds background is unavailable; the static background remains active.', error)
  }
}

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLElement>('.project-art').forEach((card) => {
    let frame = 0
    card.addEventListener('pointermove', (event) => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5
        card.style.setProperty('--tilt-x', `${x * 5}deg`)
        card.style.setProperty('--tilt-y', `${y * -5}deg`)
      })
    })
    card.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame)
      card.style.setProperty('--tilt-x', '0deg')
      card.style.setProperty('--tilt-y', '0deg')
    })
  })
}

void initializeBirdsBackground()

const backToTop = document.querySelector<HTMLElement>('.back-to-top')
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('is-visible', window.scrollY > 550)
}, { passive: true })
