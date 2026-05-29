async function loadAdminProductList() {
  const response = await fetch('/api/products?page=1&limit=50');
  const result = await response.json();
  const tableBody = document.getElementById('adminTable');
  tableBody.innerHTML = '';

  if (!result.success) return;

  result.data.products.forEach(function (product) {
    const row = document.createElement('tr');
    row.innerHTML =
      '<td>' + product.id + '</td>' +
      '<td>' + product.name + '</td>' +
      '<td>' + product.brand + '</td>' +
      '<td>$' + Number(product.price).toFixed(2) + '</td>' +
      '<td>' + product.sku + '</td>' +
      '<td>' + (product.availability ? 'Yes' : 'No') + '</td>' +
      '<td><a href="/admin-edit.html?id=' + product.id + '">Edit</a></td>';
    tableBody.appendChild(row);
  });
}

loadAdminProductList();
