/* Blog logic module */

let postsData = [];
let activeCategory = 'all';
let searchQuery = '';

export function initBlog() {
  const categoriesContainer = document.getElementById('blog-categories');
  const searchInput = document.getElementById('blog-search');
  const backBtn = document.getElementById('blog-detail-back-btn');
  
  if (!categoriesContainer) return;

  // Fetch posts metadata JSON
  fetch('posts/posts.json')
    .then(response => {
      if (!response.ok) throw new Error('Không thể tải danh sách bài viết.');
      return response.json();
    })
    .then(data => {
      postsData = data;
      renderCategories();
      renderPosts();
    })
    .catch(err => {
      console.error(err);
      document.getElementById('blog-list-container').innerHTML = `
        <p style="text-align: center; color: var(--text-muted); grid-column: 1/-1;">
          Đã xảy ra lỗi khi tải danh sách bài viết. Vui lòng thử lại sau.
        </p>
      `;
    });

  // Search filter listener
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderPosts();
  });

  // Back button in post detail view listener
  backBtn.addEventListener('click', () => {
    closePostDetail();
  });
}

function renderCategories() {
  const categoriesContainer = document.getElementById('blog-categories');
  
  // Collect unique categories
  const categories = ['all', ...new Set(postsData.map(post => post.category))];
  
  categoriesContainer.innerHTML = categories.map(cat => {
    const label = cat === 'all' ? 'Tất cả' : cat;
    const isActive = cat === activeCategory ? 'active' : '';
    return `<button class="category-chip ${isActive}" data-category="${cat}">${label}</button>`;
  }).join('');

  // Add click listeners to filter chips
  categoriesContainer.querySelectorAll('.category-chip').forEach(button => {
    button.addEventListener('click', () => {
      categoriesContainer.querySelectorAll('.category-chip').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.getAttribute('data-category');
      renderPosts();
    });
  });
}

function renderPosts() {
  const container = document.getElementById('blog-list-container');
  const emptyState = document.getElementById('blog-no-posts');
  
  // Filter logic
  const filteredPosts = postsData.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery) || 
                          post.excerpt.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filteredPosts.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  
  emptyState.style.display = 'none';

  container.innerHTML = filteredPosts.map(post => {
    // Format Date nicely
    const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="blog-card glass-card" data-id="${post.id}">
        <div class="blog-card-img-wrapper">
          <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
          <span class="blog-card-badge">${post.category}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span>${formattedDate}</span>
            <span>•</span>
            <span>${post.readTime}</span>
          </div>
          <h4 class="blog-card-title">${post.title}</h4>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-footer">
            <span>Đọc tiếp 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Add click listeners to cards
  container.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const postId = card.getAttribute('data-id');
      const post = postsData.find(p => p.id === postId);
      if (post) openPostDetail(post);
    });
  });
}

function openPostDetail(post) {
  const listView = document.getElementById('blog-list-view');
  const detailView = document.getElementById('blog-detail-view');
  
  // Elements inside detail view
  const categoryElem = document.getElementById('post-detail-category');
  const titleElem = document.getElementById('post-detail-title');
  const metaElem = document.getElementById('post-detail-meta');
  const contentElem = document.getElementById('post-detail-content');

  categoryElem.textContent = post.category;
  titleElem.textContent = post.title;
  
  const formattedDate = new Date(post.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  metaElem.innerHTML = `
    <span>Đăng ngày: ${formattedDate}</span>
    <span>•</span>
    <span>Thời gian đọc: ${post.readTime}</span>
  `;

  contentElem.innerHTML = `<p style="text-align: center; color: var(--text-muted);">Đang tải nội dung bài viết...</p>`;

  // Fade out list view and fade in detail view
  listView.style.display = 'none';
  detailView.classList.add('active');

  // Fetch the markdown content
  fetch(post.filePath)
    .then(res => {
      if (!res.ok) throw new Error('Không thể mở nội dung bài viết.');
      return res.text();
    })
    .then(markdown => {
      // Use marked library loaded via CDN
      if (window.marked) {
        contentElem.innerHTML = window.marked.parse(markdown);
      } else {
        // Fallback if marked is not loaded
        contentElem.innerHTML = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
      }
    })
    .catch(err => {
      console.error(err);
      contentElem.innerHTML = `
        <p style="color: var(--accent-primary); text-align: center;">
          Lỗi: Không thể tải nội dung bài viết này. Vui lòng quay lại danh sách.
        </p>
      `;
    });
  
  // Scroll to top of detail view
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePostDetail() {
  const listView = document.getElementById('blog-list-view');
  const detailView = document.getElementById('blog-detail-view');
  
  detailView.classList.remove('active');
  listView.style.display = 'block';
  
  // Scroll back to toolbar
  document.querySelector('.blog-toolbar').scrollIntoView({ behavior: 'smooth' });
}
