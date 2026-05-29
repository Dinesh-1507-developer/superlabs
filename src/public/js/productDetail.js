const productId = new URLSearchParams(window.location.search).get('id');

fetch('/api/products/' + productId)
  .then(function (response) {
    return response.json();
  })
  .then(function (result) {
    if (!result.success) {
      document.getElementById('errorMsg').textContent = result.message;
      document.getElementById('errorMsg').style.display = 'block';
      document.getElementById('loading').style.display = 'none';
      return;
    }

    const product = result.data;
    let priceText = '$' + Number(product.price).toFixed(2);
    if (product.originalPrice && product.originalPrice > product.price) {
      priceText += '  (was $' + Number(product.originalPrice).toFixed(2) + ')';
    }

    const imgEl = document.getElementById('productImage');
    imgEl.src = product.image || 'https://placehold.co/400x400?text=Product';
    imgEl.onerror = function () {
      this.onerror = null;
      this.src = 'https://placehold.co/400x400?text=No+Image';
    };
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productSku').textContent =
      'SKU: ' + product.sku + '  |  ID: ' + product.id;
    document.getElementById('productPrice').textContent = priceText;
    document.getElementById('productRating').textContent =
      'Rating: ' + product.rating + ' ★  (' + product.reviews + ' reviews)';
    document.getElementById('productAvailability').textContent = product.availability
      ? 'In stock'
      : 'Out of stock';
    document.getElementById('productDescription').textContent = product.description;

    document.getElementById('loading').style.display = 'none';
    document.getElementById('productDetail').style.display = 'block';
  });
