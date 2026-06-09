document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. Lenis Smooth Scrolling
       ========================================= */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    /* =========================================
       2. Clean Entrance Animations
       ========================================= */
    const tl = gsap.timeline();

    // Subtle Preloader
    tl.to('.preloader-progress-bar', {
        width: '100%',
        duration: 0.8,
        ease: 'power2.inOut'
    })
    .to('.preloader-text', { opacity: 1, y: -5, duration: 0.4, ease: 'power2.out' }, "-=0.4")
    .to('.preloader', { opacity: 0, duration: 0.5, ease: 'power2.inOut', delay: 0.2 })
    .set('.preloader', { display: 'none' })
    .to('.site-wrapper', { opacity: 1, duration: 0.1 }, "-=0.5")
    
    // Fade up items cleanly
    .from('.navbar', { y: -10, opacity: 0, duration: 0.6, ease: 'power2.out' }, "-=0.3")
    .from('.bento-item', { 
        y: 20, 
        opacity: 0, 
        duration: 0.6, 
        stagger: 0.05, 
        ease: 'power2.out' 
    }, "-=0.4");

    /* =========================================
       3. GitHub Repositories Fetch
       ========================================= */
    const githubUsername = 'PashamDhanushReddy';
    const reposContainer = document.getElementById('github-repos');

    async function fetchGitHubRepos() {
        if (!reposContainer) return;
        
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=4`);
            if (!response.ok) throw new Error('Failed to fetch');
            const repos = await response.json();
            
            reposContainer.innerHTML = '';
            if (repos.length === 0) {
                reposContainer.innerHTML = '<p class="text-sm text-secondary">No repos found.</p>';
                return;
            }

            repos.forEach(repo => {
                if (repo.fork) return; 

                const repoEl = document.createElement('a');
                repoEl.href = repo.html_url;
                repoEl.target = '_blank';
                repoEl.className = 'repo-item';
                const language = repo.language ? `<span><span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#888; margin-right:4px;"></span>${repo.language}</span>` : '';
                
                repoEl.innerHTML = `
                    <div class="repo-item-header">
                        <span class="repo-item-name">${repo.name}</span>
                        <div class="repo-item-stats">
                            ${language}
                            <span style="margin-left: 12px;">★ ${repo.stargazers_count}</span>
                        </div>
                    </div>
                    <p class="text-sm text-secondary" style="margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        ${repo.description || 'No description available'}
                    </p>
                `;
                reposContainer.appendChild(repoEl);
            });
        } catch (error) {
            console.error(error);
            reposContainer.innerHTML = '<p class="text-sm text-secondary">Failed to load repositories.</p>';
        }
    }
    
    // Small delay to ensure clean load
    setTimeout(fetchGitHubRepos, 1000);
});
