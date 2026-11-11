console.log("PRODUCT MANAGEMENT SYSTEM STARTED");

// ========================================
// 1. LOCAL STORAGE
// ========================================

function loadData() {
  try {
    const data = JSON.parse(localStorage.getItem("cartList"));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

let products = loadData();

let editingId = null;

// ========================================
// 2. HTML ELEMENTS
// ========================================

const productForm = document.getElementById("productForm");

const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productQuantity = document.getElementById("productQuantity");

const message = document.getElementById("message");

const productTable = document.getElementById("productTable");
const productTableContainer = document.getElementById("productTableContainer");
const emptyProducts = document.getElementById("emptyProducts");

const searchId = document.getElementById("searchId");
const searchBtn = document.getElementById("searchBtn");
const searchTable = document.getElementById("searchTable");
const searchTableContainer = document.getElementById("searchTableContainer");
const searchMessage = document.getElementById("searchMessage");

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

// ========================================
// 3. SAVE DATA
// ========================================

function saveProducts() {
  localStorage.setItem("cartList", JSON.stringify(products));
}

// ========================================
// 4. MESSAGES
// ========================================

function showMessage(text, color = "green") {
  message.textContent = text;
  message.style.color = color;
}

function showSearchMessage(text, color = "green") {
  searchMessage.textContent = text;
  searchMessage.style.color = color;
}

// ========================================
// 5. VALIDATION
// ========================================

function validateProduct() {
  const id = productId.value.trim();
  const name = productName.value.trim();
  const quantity = productQuantity.value.trim();

  if (!id || !name || !quantity) {
    showMessage("Please fill in all fields!", "red");
    return false;
  }

  if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    showMessage("Product code must be a positive integer!", "red");
    return false;
  }

  if (!Number.isSafeInteger(Number(quantity)) || Number(quantity) <= 0) {
    showMessage("Quantity must be a positive integer!", "red");
    return false;
  }

  return true;
}

// ========================================
// 6. CLEAR FORM
// ========================================

function clearForm() {
  productForm.reset();

  productId.disabled = false;

  editingId = null;
}

// ========================================
// 7. CREATE TABLE CELL
// ========================================

function createCell(row, value) {
  const cell = document.createElement("td");

  cell.textContent = value;

  row.appendChild(cell);

  return cell;
}

// ========================================
// 8. INSERT NEW PRODUCT
// ========================================

productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (!validateProduct()) return;

  const id = productId.value.trim();

  const existingProduct = products.find((product) => String(product.id) === id);

  if (existingProduct) {
    showMessage("This product already exists!", "red");
    return;
  }

  const newProduct = {
    id: id,

    name: productName.value.trim(),

    quantity: Number(productQuantity.value),
  };

  products.push(newProduct);

  saveProducts();

  // SHOW TABLE AFTER INSERT

  renderProducts();

  showMessage("Product successfully inserted!", "green");

  clearForm();
});

// ========================================
// 9. DISPLAY ALL PRODUCTS
// ========================================

function renderProducts() {
  productTable.innerHTML = "";

  if (products.length === 0) {
    productTableContainer.hidden = true;

    emptyProducts.hidden = false;

    return;
  }

  // MAKE TABLE VISIBLE

  productTableContainer.hidden = false;

  emptyProducts.hidden = true;

  products.forEach(function (product) {
    const row = document.createElement("tr");

    createCell(row, product.id);

    createCell(row, product.name);

    createCell(row, product.quantity);

    const actions = document.createElement("td");

    // EDIT BUTTON

    const selectButton = document.createElement("button");

    selectButton.textContent = "Edit";

    selectButton.className = "edit-btn";

    selectButton.addEventListener("click", function () {
      selectProduct(product.id);
    });

    actions.appendChild(selectButton);

    row.appendChild(actions);

    productTable.appendChild(row);
  });
}

// ========================================
// 10. SELECT PRODUCT FOR EDITING
// ========================================

function selectProduct(id) {
  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    showMessage("Product not found!", "red");
    return;
  }

  productId.value = product.id;

  productName.value = product.name;

  productQuantity.value = product.quantity;

  editingId = String(product.id);

  productId.disabled = true;

  showMessage("Product selected for editing!", "blue");
}

// ========================================
// 11. UPDATE PRODUCT
// ========================================

editBtn.addEventListener("click", function () {
  if (editingId === null) {
    showMessage("Select a product from the table first!", "red");

    return;
  }

  if (!validateProduct()) return;

  const index = products.findIndex(
    (product) => String(product.id) === editingId,
  );

  if (index === -1) return;

  products[index].name = productName.value.trim();

  products[index].quantity = Number(productQuantity.value);

  saveProducts();

  renderProducts();

  showMessage("Product successfully updated!", "green");

  clearForm();
});

// ========================================
// 12. DELETE PRODUCT
// ========================================

deleteBtn.addEventListener("click", function () {

  // DELETE ALL PRODUCTS
  products = [];

  // CLEAR LOCALSTORAGE
  localStorage.removeItem("cartList");

  // CLEAR TABLE
  productTable.innerHTML = "";

  // HIDE TABLE
  productTableContainer.hidden = true;

  // SHOW EMPTY MESSAGE
  emptyProducts.hidden = false;

  // CLEAR FORM
  clearForm();

  // CLEAR SEARCH RESULTS
  searchTable.innerHTML = "";
  searchTableContainer.hidden = true;

  // SHOW MESSAGE
  showMessage("All products successfully deleted from LocalStorage!", "green");

  showSearchMessage("", "green");

});

// ========================================
// 13. FIND PRODUCT BY CODE
// ========================================

function findProduct() {
  const id = searchId.value.trim();

  searchTable.innerHTML = "";

  searchTableContainer.hidden = true;

  if (!id) {
    showSearchMessage("Enter product code!", "red");

    return;
  }

  const product = products.find((item) => String(item.id) === id);

  if (!product) {
    showSearchMessage("Product not found!", "red");

    return;
  }

  const row = document.createElement("tr");

  createCell(row, product.id);

  createCell(row, product.name);

  createCell(row, product.quantity);

  searchTable.appendChild(row);

  // SHOW SEARCH RESULT TABLE

  searchTableContainer.hidden = false;

  showSearchMessage("Product found successfully!", "green");
}

// ========================================
// 14. SEARCH BUTTON
// ========================================

searchBtn.addEventListener("click", function () {
  findProduct();
});

// SEARCH WITH ENTER

searchId.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    findProduct();
  }
});

// ========================================
// 15. INITIALIZE APPLICATION
// ========================================

function initializeApp() {
  renderProducts();

  console.log("Products loaded from LocalStorage:");

  console.table(products);
}

initializeApp();
