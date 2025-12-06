const productsSection = document.getElementById('productsSection');
const cartCountEl = document.getElementById('cartCount');
const cartSection = document.getElementById('cartSection');
const cartList = document.getElementById('cartList');
const cartTotalEl = document.getElementById('cartTotal');

const btnHome = document.getElementById('btnHome');
const btnCart = document.getElementById('btnCart');

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalQty = document.getElementById('modalQty');
const modalAdd = document.getElementById('modalAdd');
const closeModal = document.getElementById('closeModal');

let cart = JSON.parse(localStorage.getItem('mini_cart')) || [];
let currentProduct = null;

function saveCart(){ localStorage.setItem('mini_cart', JSON.stringify(cart)); }

function renderProducts(){
  productsSection.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="price">₹${p.price}</p>
      <p class="muted small">${p.desc}</p>
      <div class="row">
        <button class="btn small" data-id="${p.id}">View</button>
        <button class="btn small" data-add="${p.id}">Add</button>
      </div>
    `;
    productsSection.appendChild(card);
  });
}

function updateCartCount(){
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent = totalQty;
}

function openModal(productId){
  const p = products.find(x=>x.id===productId);
  if(!p) return;
  currentProduct = p;
  modalImg.src = p.img;
  modalTitle.textContent = p.name;
  modalDesc.textContent = p.desc;
  modalPrice.textContent = p.price;
  modalQty.value = 1;
  modal.classList.remove('hidden');
}

function addToCart(productId, qty = 1){
  const p = products.find(x=>x.id===productId);
  if(!p) return;
  const found = cart.find(i=>i.id===p.id);
  if(found) found.qty += qty;
  else cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty });
  saveCart();
  updateCartCount();
}

function renderCart(){
  cartList.innerHTML = '';
  if(cart.length === 0){
    cartList.innerHTML = '<p class="muted">Your cart is empty.</p>';
    cartTotalEl.textContent = 0;
    return;
  }
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="left">
        <img src="${item.img}" alt="">
        <div>
          <div>${item.name}</div>
          <div class="muted">₹${item.price}</div>
        </div>
      </div>
      <div class="right">
        <div class="qty">
          <button class="btn small" data-decrease="${item.id}">-</button>
          <input type="number" min="1" value="${item.qty}" data-qty="${item.id}">
          <button class="btn small" data-increase="${item.id}">+</button>
        </div>
        <div style="margin-top:8px;">
          <button class="btn small danger" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    `;
    cartList.appendChild(div);
  });
  cartTotalEl.textContent = total;
}

/* Event wiring */
document.addEventListener('click', (e) => {
  if(e.target.matches('[data-id]')) {
    const id = Number(e.target.getAttribute('data-id'));
    openModal(id);
  }
  if(e.target.matches('[data-add]')) {
    const id = Number(e.target.getAttribute('data-add'));
    addToCart(id, 1);
  }
  if(e.target === btnHome) {
    cartSection.classList.add('hidden');
    productsSection.classList.remove('hidden');
  }
  if(e.target === btnCart) {
    productsSection.classList.add('hidden');
    cartSection.classList.remove('hidden');
    renderCart();
  }
  if(e.target === closeModal) {
    modal.classList.add('hidden');
  }
  if(e.target === modalAdd) {
    const qty = Math.max(1, Number(modalQty.value||1));
    addToCart(currentProduct.id, qty);
    modal.classList.add('hidden');
  }
  if(e.target.matches('[data-remove]')) {
    const id = Number(e.target.getAttribute('data-remove'));
    cart = cart.filter(i=>i.id!==id);
    saveCart();
    renderCart();
    updateCartCount();
  }
  if(e.target.matches('[data-increase]')) {
    const id = Number(e.target.getAttribute('data-increase'));
    const it = cart.find(i=>i.id===id);
    if(it){ it.qty++; saveCart(); renderCart(); updateCartCount(); }
  }
  if(e.target.matches('[data-decrease]')) {
    const id = Number(e.target.getAttribute('data-decrease'));
    const it = cart.find(i=>i.id===id);
    if(it && it.qty>1){ it.qty--; saveCart(); renderCart(); updateCartCount(); }
  }
});

/* input qty change in cart */
cartList.addEventListener('change', (e) => {
  if(e.target.matches('input[data-qty]')) {
    const id = Number(e.target.getAttribute('data-qty'));
    const val = Math.max(1, Number(e.target.value||1));
    const it = cart.find(i=>i.id===id);
    if(it){ it.qty = val; saveCart(); renderCart(); updateCartCount(); }
  }
});

/* clear & checkout */
document.getElementById('clearCart').addEventListener('click', () => {
  if(!confirm('Clear cart?')) return;
  cart = []; saveCart(); renderCart(); updateCartCount();
});
document.getElementById('checkout').addEventListener('click', () => {
  if(cart.length===0){ alert('Cart is empty'); return; }
  alert('Thanks! (This is a demo checkout)');
  cart = []; saveCart(); renderCart(); updateCartCount();
});

/* init */
renderProducts();
updateCartCount();
