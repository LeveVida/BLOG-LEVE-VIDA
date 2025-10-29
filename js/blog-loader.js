class BlogLoader {
  constructor() {
    this.config = null;
    this.articles = null;
    this.news = null;
  }

  async init() {
    await this.loadConfig();
    await this.loadArticles();
    this.renderAll();
  }

  async loadConfig() {
    try {
      const response = await fetch('data/config.json');
      this.config = await response.json();
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }

  async loadArticles() {
    try {
      const response = await fetch('data/articles.json');
      const data = await response.json();
      this.articles = data.articles;
      this.news = data.news;
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    }
  }

  renderAll() {
    this.renderArticles();
    this.renderNews();
    this.renderContact();
    this.renderAbout();
  }

  renderArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

    container.innerHTML = this.articles.map(article => `
      <div class="article-card" data-id="${article.id}">
        ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-image">` : ''}
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <button class="read-more-btn" onclick="blogLoader.openArticle('${article.id}')">Leia mais</button>
      </div>
    `).join('');
  }

  renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    container.innerHTML = this.news.map(item => `
      <div class="article-card">
        ${item.image ? `<img src="${item.image}" alt="${item.title}" class="article-image">` : ''}
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
      </div>
    `).join('');
  }

  renderContact() {
    if (!this.config) return;
    
    const contact = this.config.contact;
    
    const addressEl = document.getElementById('contact-address');
    const phoneEl = document.getElementById('contact-phone');
    const emailEl = document.getElementById('contact-email');
    
    if (addressEl) addressEl.textContent = contact.address;
    if (phoneEl) phoneEl.textContent = contact.phone;
    if (emailEl) emailEl.textContent = contact.email;

    const socialLinks = {
      instagram: document.querySelector('[data-social="instagram"]'),
      kwai: document.querySelector('[data-social="kwai"]'),
      tiktok: document.querySelector('[data-social="tiktok"]'),
      youtube: document.querySelector('[data-social="youtube"]')
    };

    Object.keys(socialLinks).forEach(key => {
      if (socialLinks[key] && contact.social[key]) {
        socialLinks[key].href = contact.social[key];
      }
    });
  }

  renderAbout() {
    if (!this.config) return;
    
    const container = document.getElementById('about-content');
    if (!container) return;

    container.innerHTML = this.config.about.text.map(paragraph => 
      `<p>${paragraph}</p>`
    ).join('');
  }

  async openArticle(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (!article) return;

    try {
      const response = await fetch(article.content);
      const content = await response.text();
      
      this.showArticleModal(article.title, content);
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    }
  }

  showArticleModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'article-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>${title}</h2>
        <div class="article-full-content">
          ${content}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => {
      document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  }
}

const blogLoader = new BlogLoader();
document.addEventListener('DOMContentLoaded', () => {
  blogLoader.init();
});
