const productListEl = document.getElementById('productList');
const paginationEl = document.getElementById('pagination');
const paginationInfoEl = document.getElementById('paginationInfo');
const searchInputEl = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const brandFilterEl = document.getElementById('brandFilter');
const sortSelectEl = document.getElementById('sortSelect');
const resultCountEl = document.getElementById('resultCount');

const ITEMS_PER_PAGE = 6;
const PLACEHOLDER_IMG = 'https://placehold.co/300x300?text=No+Image';
let searchTimer = null;
let currentPage = 1;

function imgTag(url, altText) {
  const src = url || PLACEHOLDER_IMG;
  return (
    '<img src="' + src + '" class="product-img" alt="' + (altText || '') + '" ' +
    'onerror="this.onerror=null;this.src=\'' + PLACEHOLDER_IMG + '\';">'
  );
}

function formatPrice(amount) {
  return '$' + Number(amount).toFixed(2);
}

function getDiscountBadge(product) {
  if (product.originalPrice && product.originalPrice > product.price) {
    const off = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    return '<span class="badge-sale">SAVE ' + off + '% OFF</span>';
  }
  return '';
}

function getPriceHtml(product) {
  if (product.originalPrice && product.originalPrice > product.price) {
    return (
      '<span class="price-sale">' + formatPrice(product.price) + '</span> ' +
      '<span class="price-old">' + formatPrice(product.originalPrice) + '</span>'
    );
  }
  return '<span class="price-sale">' + formatPrice(product.price) + '</span>';
}

function toggleClearButton() {
  if (searchInputEl.value.trim().length > 0) {
    clearSearchBtn.classList.add('is-visible');
  } else {
    clearSearchBtn.classList.remove('is-visible');
  }
}

function clearSearch() {
  searchInputEl.value = '';
  toggleClearButton();
  loadProductList(1);
}

async function loadBrandFilter() {
  const response = await fetch('/api/products/meta/brands');
  const result = await response.json();
  if (!result.success) return;

  result.data.forEach(function (brandName) {
    const option = document.createElement('option');
    option.value = brandName;
    option.textContent = brandName;
    brandFilterEl.appendChild(option);
  });
}

function renderPagination(pageInfo) {
  paginationEl.innerHTML = '';
  paginationInfoEl.textContent = '';

  if (!pageInfo || pageInfo.total === 0) {
    return;
  }

  const start = (pageInfo.currentPage - 1) * pageInfo.limit + 1;
  const end = Math.min(pageInfo.currentPage * pageInfo.limit, pageInfo.total);

  paginationInfoEl.textContent =
    'Showing ' + start + '-' + end + ' of ' + pageInfo.total + ' products' +
    ' (Page ' + pageInfo.currentPage + ' of ' + pageInfo.totalPages + ')';

  // Previous
  const prevItem = document.createElement('li');
  prevItem.className = 'page-item' + (pageInfo.currentPage <= 1 ? ' disabled' : '');
  prevItem.innerHTML = '<a class="page-link" href="#">Previous</a>';
  if (pageInfo.currentPage > 1) {
    prevItem.onclick = function (e) {
      e.preventDefault();
      loadProductList(pageInfo.currentPage - 1);
    };
  }
  paginationEl.appendChild(prevItem);

  // Page numbers
  for (let page = 1; page <= pageInfo.totalPages; page++) {
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item' + (page === pageInfo.currentPage ? ' active' : '');
    pageItem.innerHTML = '<a class="page-link" href="#">' + page + '</a>';
    pageItem.onclick = function (e) {
      e.preventDefault();
      loadProductList(page);
    };
    paginationEl.appendChild(pageItem);
  }

  // Next
  const nextItem = document.createElement('li');
  nextItem.className = 'page-item' + (pageInfo.currentPage >= pageInfo.totalPages ? ' disabled' : '');
  nextItem.innerHTML = '<a class="page-link" href="#">Next</a>';
  if (pageInfo.currentPage < pageInfo.totalPages) {
    nextItem.onclick = function (e) {
      e.preventDefault();
      loadProductList(pageInfo.currentPage + 1);
    };
  }
  paginationEl.appendChild(nextItem);
}

async function loadProductList(pageNumber) {
  pageNumber = pageNumber || 1;
  currentPage = pageNumber;

  const keyword = searchInputEl.value.trim();
  const brand = brandFilterEl.value;
  const sort = sortSelectEl.value;

  let apiUrl = '/api/products?page=' + pageNumber + '&limit=' + ITEMS_PER_PAGE;
  if (keyword) apiUrl += '&q=' + encodeURIComponent(keyword);
  if (brand) apiUrl += '&brand=' + encodeURIComponent(brand);
  if (sort === 'price') apiUrl += '&sort=price';

  const response = await fetch(apiUrl);
  const result = await response.json();

  productListEl.innerHTML = '';
  toggleClearButton();

  if (!result.success) {
    resultCountEl.textContent = 'Could not load products';
    productListEl.innerHTML =
      '<p class="text-danger">' + (result.message || 'Error loading products') + '</p>';
    renderPagination(null);
    return;
  }

  const pageInfo = result.data.pagination;
  const total = pageInfo.total;

  if (keyword) {
    resultCountEl.textContent = total + " results for '" + keyword + "' (name or brand)";
  } else {
    resultCountEl.textContent = total + ' results';
  }

  if (result.data.products.length === 0) {
    if (keyword || brand) {
      productListEl.innerHTML =
        '<div class="no-results col-12">' +
        '<p>No products match your search.</p>' +
        '<p class="text-muted small">Search matches product <strong>name</strong> or <strong>brand</strong> only.</p>' +
        '</div>';
    } else {
      productListEl.innerHTML = '<p class="col-12">No products found.</p>';
    }
    renderPagination(pageInfo);
    return;
  }

  result.data.products.forEach(function (product) {
    const col = document.createElement('div');
    col.className = 'col-md-4 col-sm-6';
    col.innerHTML =
      '<div class="product-card border rounded">' +
      '<div class="product-img-wrap">' +
      getDiscountBadge(product) +
      imgTag(product.image, product.name) +
      '</div>' +
      '<div class="product-card-body">' +
      '<p class="product-brand mb-0">' + product.brand + '</p>' +
      '<h6 class="product-title">' + product.name + '</h6>' +
      '<p class="product-rating mb-0">★ ' + product.rating + ' (' + product.reviews + ')</p>' +
      '<p class="product-price mb-0">' + getPriceHtml(product) + '</p>' +
      '</div>' +
      '<div class="product-card-footer">' +
      '<a href="/product.html?id=' + product.id + '" class="btn btn-outline-danger btn-sm view-details-btn">View Details</a>' +
      '</div>' +
      '</div>';
    productListEl.appendChild(col);
  });

  renderPagination(pageInfo);

  // scroll to top of product list when page changes
  if (pageNumber > 1) {
    productListEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scheduleSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function () {
    loadProductList(1);
  }, 350);
}

searchInputEl.addEventListener('input', function () {
  toggleClearButton();
  scheduleSearch();
});

searchInputEl.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    clearSearch();
  }
});

clearSearchBtn.addEventListener('click', function () {
  clearSearch();
});

brandFilterEl.onchange = function () {
  loadProductList(1);
};

sortSelectEl.onchange = function () {
  loadProductList(1);
};

toggleClearButton();
loadBrandFilter();
loadProductList(1);
