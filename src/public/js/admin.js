const alertBoxEl = document.getElementById('alertBox');

function showAlert(message, alertType) {
  alertBoxEl.textContent = message;
  alertBoxEl.className = 'alert alert-' + alertType;
  alertBoxEl.style.display = 'block';
}

function getFormData(form) {
  return {
    name: form.name.value,
    brand: form.brand.value,
    description: form.description.value,
    price: form.price.value,
    originalPrice: form.originalPrice.value || null,
    sku: form.sku.value,
    image: form.image.value,
    rating: form.rating.value || 0,
    reviews: form.reviews.value || 0,
    availability: form.availability.checked,
  };
}

const createProductForm = document.getElementById('createForm');
if (createProductForm) {
  createProductForm.onsubmit = async function (event) {
    event.preventDefault();
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData(createProductForm)),
    });
    const result = await response.json();
    if (result.success) {
      showAlert('Product saved', 'success');
      setTimeout(function () {
        window.location.href = '/admin.html';
      }, 800);
    } else {
      showAlert(result.message, 'danger');
    }
  };
}

const editProductForm = document.getElementById('editForm');
if (editProductForm) {
  const productId = new URLSearchParams(window.location.search).get('id');

  fetch('/api/products/' + productId)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (!result.success) return;
      const product = result.data;
      editProductForm.name.value = product.name;
      editProductForm.brand.value = product.brand;
      editProductForm.description.value = product.description;
      editProductForm.price.value = product.price;
      editProductForm.originalPrice.value = product.originalPrice || '';
      editProductForm.sku.value = product.sku;
      editProductForm.image.value = product.image || '';
      editProductForm.rating.value = product.rating;
      editProductForm.reviews.value = product.reviews;
      editProductForm.availability.checked = product.availability;
      document.getElementById('loading').style.display = 'none';
      editProductForm.style.display = 'block';
    });

  editProductForm.onsubmit = async function (event) {
    event.preventDefault();
    const response = await fetch('/api/products/' + productId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getFormData(editProductForm)),
    });
    const result = await response.json();
    showAlert(
      result.success ? 'Product updated' : result.message,
      result.success ? 'success' : 'danger'
    );
  };

  document.getElementById('deleteBtn').onclick = async function () {
    if (!confirm('Delete this product?')) return;
    const response = await fetch('/api/products/' + productId, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) window.location.href = '/admin.html';
  };
}
