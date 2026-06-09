document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       GitHub Repositories Fetch
       ========================================= */
    const githubUsername = 'PashamDhanushReddy';
    const reposContainer = document.getElementById('github-repos');

    async function fetchGitHubRepos() {
        if (!reposContainer) return;
        
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=4`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            // Clear loading spinner
            reposContainer.innerHTML = '';
            
            if (repos.length === 0) {
                reposContainer.innerHTML = '<p class="text-sm text-secondary">No public repositories found.</p>';
                return;
            }

            repos.forEach(repo => {
                // Skip forks if desired
                if (repo.fork) return; 

                const repoEl = document.createElement('a');
                repoEl.href = repo.html_url;
                repoEl.target = '_blank';
                repoEl.className = 'repo-item';
                
                const language = repo.language ? `<span><i class="fas fa-circle" style="font-size: 6px; vertical-align: middle;"></i> ${repo.language}</span>` : '';
                
                repoEl.innerHTML = `
                    <div class="repo-item-header">
                        <span class="repo-item-name"><i class="far fa-folder text-secondary"></i> ${repo.name}</span>
                        <div class="repo-item-stats">
                            ${language}
                            <span style="margin-left: 8px;"><i class="far fa-star"></i> ${repo.stargazers_count}</span>
                        </div>
                    </div>
                    <p class="text-sm text-secondary" style="margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        ${repo.description || 'No description available'}
                    </p>
                `;
                
                reposContainer.appendChild(repoEl);
            });

        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            reposContainer.innerHTML = '<p class="text-sm text-secondary">Failed to load repositories.</p>';
        }
    }

    // Initialize fetch
    fetchGitHubRepos();
});
