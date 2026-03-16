document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check system preference or local storage
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
        body.classList.replace('light', 'dark');
        themeIcon.setAttribute('data-feather', 'sun');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light')) {
            body.classList.replace('light', 'dark');
            themeIcon.setAttribute('data-feather', 'sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark', 'light');
            themeIcon.setAttribute('data-feather', 'moon');
            localStorage.setItem('theme', 'light');
        }
        feather.replace(); // re-render icon
    });

    // Initialize Feather Icons
    feather.replace();

    // 2. Data Fetching & Rendering
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderPortfolio(data))
        .catch(err => {
            console.error('Error loading data.json:', err);
            document.getElementById('dynamic-content').innerHTML = '<p style="color:red">Failed to load portfolio data. Make sure data.json exists and is valid JSON.</p>';
        });

    function renderPortfolio(data) {
        // Render Header
        document.getElementById('brand-name').textContent = data.profile.name;
        
        // Render Hero
        document.getElementById('hero-name').textContent = data.profile.name;
        document.getElementById('hero-about').textContent = data.about;
        document.getElementById('hero-location').textContent = data.profile.location;
        document.getElementById('hero-availability').textContent = data.profile.availability;
        
        if (data.profile.cv) {
            document.getElementById('hero-cv').href = data.profile.cv;
            // Killer Download Logic: Force download on click
            document.getElementById('hero-cv').addEventListener('click', (e) => {
                const link = e.currentTarget;
                if (link.href && !link.href.startsWith('blob:')) {
                    console.log("Direct download triggered for:", link.href);
                }
            });
        } else {
            document.getElementById('hero-cv').parentElement.style.display = 'none';
        }

        // Helper: Parse Icons (Material Symbols & Emojis)
        function parseIcons(text) {
            if (!text) return '';
            // Match :material/icon_name:
            return text.replace(/:material\/([a-z0-9_]+):/g, '<span class="material-symbols-outlined">$1</span>');
        }

        const heroImg = document.getElementById('hero-image');
        if (data.profile.image) {
            heroImg.src = data.profile.image;
        } else {
            // Fallback placeholder
            heroImg.src = 'https://ui-avatars.com/api/?name=Rohit+More&background=137fec&color=fff&size=300';
        }

        // Render Dynamic Container
        const container = document.getElementById('dynamic-content');
        let html = '';

        // Socials Grid (New Header Section)
        if (data.profile.socials && data.profile.socials.length > 0) {
            html += `
                <div class="socials-grid" data-aos="fade-down">
                    ${data.profile.socials.map(social => `
                        <a href="${social.url}" target="_blank" class="social-card">
                            <div class="social-icon-wrapper">
                                <img src="https://cdn.simpleicons.org/${social.icon}/${body.classList.contains('dark') ? 'ffffff' : '121212'}" alt="${social.platform}">
                            </div>
                            <div class="social-info">
                                <span class="social-platform">${social.platform}</span>
                                <span class="social-handle">${social.handle}</span>
                            </div>
                            <span class="external-arrow">↗</span>
                        </a>
                    `).join('')}
                </div>
            `;
        }

        // Skills (Dashboard Grid style)
        if (data.skills && data.skills.length > 0) {
            html += `
                <section class="mb-5" data-aos="fade-up" style="margin-bottom: 5rem;">
                    <h2 class="section-title">Professional Expertise</h2>
                    <div class="skills-dashboard">
                        ${data.skills.map(s => `
                            <div class="skill-tile">
                                ${parseIcons(s)}
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }

        // Tech Stack
        // Tech Stack (New Icons Style)
        if (data.techstack && data.techstack.length > 0) {
            html += `
                <section data-aos="fade-up" style="margin-bottom: 5rem;">
                    <h2 class="section-title">Tech Stack</h2>
                    <div class="tech-container">
            `;
            data.techstack.forEach(group => {
                html += `
                        <div class="tech-category" style="margin-bottom: 2.5rem;">
                            <h3 style="font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 1rem; border-left: 3px solid var(--accent); padding-left: 0.75rem;">${group.category}</h3>
                            <div class="tech-list" style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                                ${group.items.map(item => `
                                    <div class="tech-chip">
                                        <img src="https://cdn.simpleicons.org/${item.icon}/${body.classList.contains('dark') ? 'ffffff' : '121212'}" alt="${item.name}">
                                        <span>${item.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                `;
            });
            html += `</div></section>`;
        }

        // Experience Builder
        function buildAccordion(title, items) {
            if (!items || items.length === 0) return '';
            let accHtml = `<section data-aos="fade-up" style="margin-bottom: 5rem;">
                <h2 class="section-title">${title}</h2>
                <div class="experience-list">`;
            
            items.forEach((item, index) => {
                accHtml += `
                    <div class="accordion-item">
                        <button class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                            <div class="accordion-meta">
                                <span class="accordion-title">${item.role} <span class="accent-text">@ ${item.company}</span></span>
                                <span class="accordion-subtitle">${item.duration}</span>
                            </div>
                            <i data-feather="chevron-down" class="accordion-icon"></i>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-inner">
                                <ul>
                                    ${item.details.map(d => `<li>${d}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });
            accHtml += `</div></section>`;
            return accHtml;
        }

        html += buildAccordion('Experience', data.experience);
        html += buildAccordion('Internships', data.internships);

        // Education Builder (slightly different schema)
        if (data.education && data.education.length > 0) {
            html += `<section data-aos="fade-up" style="margin-bottom: 5rem;">
                <h2 class="section-title">Education</h2>
                <div class="experience-list">`;
            data.education.forEach(item => {
                html += `
                    <div class="accordion-item">
                        <button class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                            <div class="accordion-meta">
                                <span class="accordion-title">${item.degree} <span class="accent-text">@ ${item.institution}</span></span>
                                <span class="accordion-subtitle">${item.duration}</span>
                            </div>
                            <i data-feather="chevron-down" class="accordion-icon"></i>
                        </button>
                        <div class="accordion-content">
                            <div class="accordion-inner">
                                <ul>
                                    ${item.details.map(d => `<li>${d}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += `</div></section>`;
        }

        // Projects (Enhanced with Features and Tech)
        if (data.projects && data.projects.length > 0) {
            html += `
                <section data-aos="fade-up" style="margin-bottom: 5rem;">
                    <h2 class="section-title">Featured Projects</h2>
                    <div class="card-grid">
            `;
            data.projects.forEach(proj => {
                const hasFeatures = proj.key_features && proj.key_features.length > 0;
                const hasTech = proj.tech_stack && proj.tech_stack.length > 0;

                html += `
                        <div class="card project-card">
                            <div class="project-header">
                                <h3 class="project-title">${proj.title}</h3>
                                <span class="project-date">${proj.date}</span>
                            </div>
                            ${proj.tagline ? `<p class="project-tagline"><em>${proj.tagline}</em></p>` : ''}
                            <p class="project-desc">${proj.description}</p>
                            
                            ${hasFeatures ? `
                                <div class="project-features">
                                    <h4 style="margin: 0.5rem 0; font-size: 0.9rem; color: var(--accent);">Key Features:</h4>
                                    <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary);">
                                        ${proj.key_features.map(f => `<li>${f}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}

                            ${hasTech ? `
                                <div class="project-tech-tags" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem;">
                                    ${proj.tech_stack.map(t => `<span class="mini-badge" style="font-size: 0.75rem; background: var(--border-color); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px dashed var(--accent);">${t}</span>`).join('')}
                                </div>
                            ` : ''}

                            <div class="project-links" style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                                ${proj.link && proj.link !== '#' ? `<a href="${proj.link}" target="_blank" style="color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem;"><i data-feather="external-link" style="width: 16px;"></i> Live Demo</a>` : ''}
                                ${proj.source && proj.source !== '#' ? `<a href="${proj.source}" target="_blank" style="color: var(--text-secondary); text-decoration: none; font-weight: 500; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem;"><i data-feather="github" style="width: 16px;"></i> Source Code</a>` : ''}
                            </div>
                        </div>
                `;
            });
            html += `</div></section>`;
        }

        // Contact Section
        const contactEmail = data.profile.email || "mustafaayyub.dev@gmail.com";
        html += `
            <section data-aos="fade-up" style="margin-bottom: 5rem;">
                <h2 class="section-title">Let's Connect</h2>
                <div class="contact-container">
                    <div class="contact-info">
                        <div>
                            <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">Talk to me</h3>
                            <p class="contact-email"><a href="mailto:${contactEmail}">${contactEmail}</a></p>
                        </div>
                        <p style="color: var(--text-secondary); margin-top: 1rem;">
                            I'm always open to discussing new projects, internships, or any backend development opportunities!
                        </p>
                    </div>
                    <form class="contact-form" action="https://formsubmit.co/${contactEmail}" method="POST">
                        <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Write Me</h3>
                        <!-- Formsubmit Hidden Configuration -->
                        <input type="hidden" name="_captcha" value="false">
                        <input type="hidden" name="_subject" value="New Portfolio Message!">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" class="form-control" placeholder="Type your name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-control" placeholder="Type your email" required>
                        </div>
                        <div class="form-group">
                            <label for="project">Project Details</label>
                            <textarea id="project" name="message" class="form-control" placeholder="Provide some project details..." required></textarea>
                        </div>
                        <button type="submit" class="btn-submit">Send Message</button>
                    </form>
                </div>
            </section>
        `;

        container.innerHTML = html;

        // Footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
        document.getElementById('footer-name').textContent = data.profile.name;

        // Re-initialize feather icons for newly injected HTML
        feather.replace();
        
        // Initialize AOS animations
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
});
