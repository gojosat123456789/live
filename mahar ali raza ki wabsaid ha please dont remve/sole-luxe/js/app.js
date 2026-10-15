import { products, formatPrice } from "./products.js";
import { ShoppingCart } from "./cart.js";

const WHATSAPP_PHONE = ""; // Set the store number in international format, without + or spaces.
const cart = new ShoppingCart(products);
const grid = document.querySelector("#product-grid");
const filters = {
  search: document.querySelector("#product-search"),
  category: document.querySelector("#category-filter"),
  price: document.querySelector("#price-filter"),
  size: document.querySelector("#size-filter"),
  sort: document.querySelector("#sort-filter")
};
const overlay = document.querySelector("#overlay");
const drawer = document.querySelector("#cart-drawer");
const quickView = document.querySelector("#quick-view");
const checkoutModal = document.querySelector("#checkout-modal");
const currency = (amount) => `PKR ${formatPrice(amount)}`;
const wishlistKey = "sole-luxe-wishlist-v1";
let wishlist = readWishlist();
let activeCollection = "all";
let lastFocused = null;
let toastTimer;

function readWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    return Array.isArray(saved) ? saved.filter((id) => products.some((product) => product.id === id)) : [];
  } catch (error) {
    if (error instanceof SyntaxError) {
      localStorage.removeItem(wishlistKey);
      return [];
    }
    throw error;
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const region = document.querySelector("#toast-region");
  region.textContent = message;
  region.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => region.classList.remove("is-visible"), 2800);
}

function cardTemplate(product) {
  const sale = product.originalPrice ? `<span class="sale-badge">A little less</span>` : "";
  const original = product.originalPrice ? `<del>${currency(product.originalPrice)}</del>` : "";
  const sizes = product.sizes.map((size) => `<option value="${size}">${size}</option>`).join("");
  return `<article class="product-card reveal" data-product-id="${product.id}">
    <div class="product-image-wrap"><a class="product-image-link" href="#collections" data-quick-view="${product.id}" aria-label="Quick view ${escapeHtml(product.name)}">${sale}<img src="${product.image}" alt="${escapeHtml(product.alt)}" loading="lazy"></a>
      <button class="wishlist-button ${wishlist.includes(product.id) ? "is-saved" : ""}" type="button" data-wishlist="${product.id}" aria-label="${wishlist.includes(product.id) ? "Remove" : "Add"} ${escapeHtml(product.name)} ${wishlist.includes(product.id) ? "from" : "to"} wishlist" aria-pressed="${wishlist.includes(product.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 8.8c0 5.4-8.2 10.2-8.2 10.2S3.8 14.2 3.8 8.8A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.2 2.7Z"></path></svg></button>
      <button class="quick-view-button" type="button" data-quick-view="${product.id}">Quick view <span aria-hidden="true">↗</span></button>
    </div><div class="product-info"><div class="product-name-row"><h3>${escapeHtml(product.name)}</h3><span class="product-rating">★ ${product.rating.toFixed(1)}</span></div>
      <p class="product-reviews">${product.reviews} considered reviews</p><div class="product-price">${currency(product.price)} ${original}</div>
      <label class="size-label">Size <select data-card-size="${product.id}" aria-label="Select size for ${escapeHtml(product.name)}"><option value="">Choose size</option>${sizes}</select></label>
      <button class="button card-add-button" type="button" data-add-cart="${product.id}">Add to bag <span aria-hidden="true">+</span></button>
    </div></article>`;
}

function visibleProducts() {
  const searchText = filters.search.value.trim().toLowerCase();
  return products.filter((product) => {
    const textMatches = !searchText || `${product.name} ${product.category} ${product.audience} ${product.description}`.toLowerCase().includes(searchText);
    const collectionMatches = activeCollection === "all" || activeCollection === "wishlist" ||
      (activeCollection === "bestseller" && product.bestseller) ||
      (activeCollection === "new" && product.isNew) || product.category === activeCollection;
    const audienceMatches = filters.category.value === "all" || product.audience === filters.category.value || (filters.category.value === "men" && product.audience === "unisex") || (filters.category.value === "women" && product.audience === "unisex");
    const sizeMatches = filters.size.value === "all" || product.sizes.includes(Number(filters.size.value));
    const [minimum, maximum] = filters.price.value === "all" ? [0, Infinity] : filters.price.value.split("-").map(Number);
    return textMatches && collectionMatches && audienceMatches && sizeMatches && product.price >= minimum && product.price < maximum;
  }).sort((left, right) => {
    if (filters.sort.value === "price-asc") return left.price - right.price;
    if (filters.sort.value === "price-desc") return right.price - left.price;
    if (filters.sort.value === "newest") return Number(right.isNew) - Number(left.isNew);
    if (filters.sort.value === "bestselling") return Number(right.bestseller) - Number(left.bestseller);
    return Number(right.bestseller) - Number(left.bestseller) || Number(right.isNew) - Number(left.isNew);
  }).filter((product) => activeCollection !== "wishlist" || wishlist.includes(product.id));
}

function renderProducts() {
  const visible = visibleProducts();
  grid.innerHTML = visible.map(cardTemplate).join("");
  document.querySelector("#no-results").hidden = visible.length !== 0;
  document.querySelector("#result-count").textContent = `${visible.length} ${visible.length === 1 ? "style" : "styles"} to discover`;
  observeReveals(grid);
}

function setCollection(collection) {
  activeCollection = collection;
  document.querySelectorAll("[data-collection].collection-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.collection === collection);
  });
  filters.category.value = ["men", "women"].includes(collection) ? collection : "all";
  if (collection === "men" || collection === "women") activeCollection = "all";
  document.querySelector("#collections").scrollIntoView({ behavior: "smooth", block: "start" });
  renderProducts();
}

function updateWishlist() {
  localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  document.querySelector(".wishlist-count").textContent = String(wishlist.length);
  renderProducts();
}

function renderCart() {
  const count = cart.itemCount;
  document.querySelectorAll(".cart-count").forEach((element) => { element.textContent = String(count); });
  document.querySelector(".drawer-count").textContent = count ? `(${count})` : "";
  document.querySelector("#cart-subtotal").textContent = currency(cart.subtotal);
  const empty = count === 0;
  document.querySelector("#cart-empty").hidden = !empty;
  document.querySelector("#cart-summary").hidden = empty;
  document.querySelector("#cart-lines").innerHTML = cart.lines.map(({ product, size, quantity }) => `
    <article class="cart-line"><img src="${product.image}" alt="" loading="lazy"><div class="cart-line-details"><h3>${escapeHtml(product.name)}</h3><p>Size ${size} · ${currency(product.price)}</p><div class="quantity-control" aria-label="Quantity for ${escapeHtml(product.name)} size ${size}"><button type="button" data-quantity="-1" data-product="${product.id}" data-size="${size}" aria-label="Decrease quantity">−</button><span>${quantity}</span><button type="button" data-quantity="1" data-product="${product.id}" data-size="${size}" aria-label="Increase quantity">+</button></div></div><div class="cart-line-end"><strong>${currency(product.price * quantity)}</strong><button class="text-button remove-line" type="button" data-remove="${product.id}" data-size="${size}">Remove</button></div></article>`).join("");
  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  document.querySelector("#checkout-lines").innerHTML = cart.lines.map(({ product, size, quantity }) =>
    `<div class="checkout-line"><span>${escapeHtml(product.name)} · EU ${size} × ${quantity}</span><strong>${currency(product.price * quantity)}</strong></div>`
  ).join("");
  document.querySelector("#checkout-total").textContent = currency(cart.subtotal);
}

function showPanel(panel) {
  lastFocused = document.activeElement;
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-visible"));
  document.body.classList.add("has-open-panel");
  panel.inert = false;
  panel.setAttribute("aria-hidden", "false");
  panel.classList.add("is-open");
  panel.querySelector("button, input, select, a")?.focus();
}

function closePanels() {
  overlay.classList.remove("is-visible");
  [drawer].forEach((panel) => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    panel.inert = true;
  });
  if (quickView.open) quickView.close();
  if (checkoutModal.open) checkoutModal.close();
  document.body.classList.remove("has-open-panel");
  window.setTimeout(() => { overlay.hidden = true; }, 260);
  lastFocused?.focus();
}

function openQuickView(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  lastFocused = document.activeElement;
  quickView.innerHTML = `<button class="icon-button modal-close" type="button" data-close-dialog aria-label="Close quick view">×</button>
    <div class="quick-view-content"><div class="quick-view-image"><img src="${product.image}" alt="${escapeHtml(product.alt)}"></div><div class="quick-view-details"><p class="eyebrow">Sole Luxe / ${escapeHtml(product.category)}</p><h2 id="quick-title">${escapeHtml(product.name)}</h2><p class="quick-price">${currency(product.price)} ${product.originalPrice ? `<del>${currency(product.originalPrice)}</del>` : ""}</p><div class="quick-rating">★ ${product.rating.toFixed(1)} <span>(${product.reviews} reviews)</span></div><p class="quick-description">${escapeHtml(product.description)}</p><label class="modal-size-label">Select your size<select id="quick-size"><option value="">Choose size</option>${product.sizes.map((size) => `<option value="${size}">EU ${size}</option>`).join("")}</select></label><label class="quantity-label">Quantity<input id="quick-quantity" type="number" min="1" max="${product.stock}" value="1"></label><p class="quick-error" id="quick-error" role="alert" hidden></p><button class="button button-primary quick-add-button" type="button" data-add-quick="${product.id}">Add to bag <span aria-hidden="true">↗</span></button><button class="text-button quick-wish" type="button" data-wishlist="${product.id}">${wishlist.includes(product.id) ? "♥ Saved to wishlist" : "♡ Add to wishlist"}</button></div></div>`;
  quickView.showModal();
  quickView.querySelector(".modal-close").focus();
}

function announceWishlist(productId) {
  const product = products.find((item) => item.id === productId);
  const isSaved = wishlist.includes(productId);
  wishlist = isSaved ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
  updateWishlist();
  showToast(`${product.name} ${isSaved ? "removed from" : "added to"} your wishlist.`);
  if (quickView.open) {
    const button = quickView.querySelector(".quick-wish");
    if (button) button.textContent = wishlist.includes(productId) ? "♥ Saved to wishlist" : "♡ Add to wishlist";
  }
}

function resetFilters() {
  document.querySelector("#filter-form").reset();
  activeCollection = "all";
  document.querySelectorAll(".collection-chip").forEach((chip) => chip.classList.toggle("is-active", chip.dataset.collection === "all"));
  renderProducts();
}

document.querySelector("#filter-form").addEventListener("submit", (event) => event.preventDefault());
Object.values(filters).forEach((control) => control.addEventListener(control === filters.search ? "input" : "change", renderProducts));
document.querySelector("#filter-form").addEventListener("reset", () => window.setTimeout(renderProducts));
document.querySelectorAll(".collection-chip").forEach((button) => button.addEventListener("click", () => setCollection(button.dataset.collection)));
document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;
  if (target.matches("[data-add-cart]")) {
    const size = document.querySelector(`[data-card-size="${target.dataset.addCart}"]`).value;
    if (!size) {
      showToast("Please choose your size first.");
      document.querySelector(`[data-card-size="${target.dataset.addCart}"]`).focus();
      return;
    }
    const added = cart.add(target.dataset.addCart, Number(size));
    showToast(added ? "Added to your bag." : "Sorry, this quantity is currently unavailable.");
  } else if (target.matches("[data-add-quick]")) {
    const size = quickView.querySelector("#quick-size").value;
    const quantity = quickView.querySelector("#quick-quantity").value;
    const error = quickView.querySelector("#quick-error");
    if (!size) {
      error.textContent = "Please choose a size before adding this pair.";
      error.hidden = false;
      quickView.querySelector("#quick-size").focus();
      return;
    }
    const added = cart.add(target.dataset.addQuick, Number(size), Number(quantity));
    if (!added) {
      error.textContent = "That quantity is not currently available.";
      error.hidden = false;
      return;
    }
    quickView.close();
    showToast("Added to your bag.");
  } else if (target.matches("[data-wishlist]")) {
    announceWishlist(target.dataset.wishlist);
  } else if (target.matches("[data-quick-view]")) {
    event.preventDefault();
    openQuickView(target.dataset.quickView);
  } else if (target.matches("[data-open-cart]")) {
    showPanel(drawer);
  } else if (target.matches("[data-close-panels]")) {
    closePanels();
  } else if (target.matches("[data-open-checkout]")) {
    if (!cart.itemCount) return;
    lastFocused = document.activeElement;
    checkoutModal.showModal();
    renderCheckoutSummary();
    checkoutModal.querySelector("input")?.focus();
  } else if (target.matches("[data-close-dialog]")) {
    if (quickView.open) quickView.close();
    if (checkoutModal.open) checkoutModal.close();
    lastFocused?.focus();
  } else if (target.matches("[data-quantity]")) {
    const line = cart.items.find((item) => item.productId === target.dataset.product && item.size === Number(target.dataset.size));
    if (line) {
      const updated = cart.update(line.productId, line.size, line.quantity + Number(target.dataset.quantity));
      if (!updated) showToast("The requested quantity is not available.");
    }
  } else if (target.matches("[data-remove]")) {
    cart.remove(target.dataset.remove, Number(target.dataset.size));
    showToast("Removed from your bag.");
  } else if (target.matches("[data-clear-filters]")) {
    event.preventDefault();
    resetFilters();
  } else if (target.matches("[data-open-search]")) {
    document.querySelector("#collections").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => filters.search.focus(), 350);
  } else if (target.matches("[data-show-wishlist]")) {
    activeCollection = "wishlist";
    document.querySelectorAll(".collection-chip").forEach((chip) => chip.classList.remove("is-active"));
    renderProducts();
    document.querySelector("#collections").scrollIntoView({ behavior: "smooth" });
  } else if (target.matches("[data-collection-link]")) {
    event.preventDefault();
    setCollection(target.dataset.collection);
    document.querySelector(".menu-toggle").click();
  } else if (target.matches("[data-category-link]")) {
    event.preventDefault();
    setCollection(target.dataset.categoryLink);
    document.querySelector(".menu-toggle").click();
  } else if (target.matches("[data-collection]:not(.collection-chip)")) {
    event.preventDefault();
    setCollection(target.dataset.collection);
  } else if (target.matches("[data-explore-3d]")) {
    window.soleLuxeScene?.focus();
  }
});

cart.addEventListener("change", renderCart);
overlay.addEventListener("click", closePanels);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanels();
  const activeDialog = quickView.open ? quickView : checkoutModal.open ? checkoutModal : null;
  if (event.key === "Tab" && activeDialog) {
    const focusable = [...activeDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if (event.key === "Tab" && drawer.classList.contains("is-open")) {
    const focusable = [...drawer.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  button.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  document.querySelector(".nav-menu").classList.toggle("is-open", !expanded);
});
document.querySelector(".nav-menu").addEventListener("click", (event) => {
  if (event.target.closest("a") && window.matchMedia("(max-width: 900px)").matches) {
    document.querySelector(".nav-menu").classList.remove("is-open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  }
});

document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const errorElement = document.querySelector("#checkout-error");
  if (!form.reportValidity()) return;
  if (!cart.itemCount) {
    errorElement.textContent = "Your shopping bag is empty.";
    errorElement.hidden = false;
    return;
  }
  if (!WHATSAPP_PHONE || !/^\d{8,15}$/.test(WHATSAPP_PHONE)) {
    errorElement.textContent = "WhatsApp ordering is not configured yet. Set WHATSAPP_PHONE in js/app.js to your store number in international format.";
    errorElement.hidden = false;
    return;
  }
  const data = new FormData(form);
  const lines = cart.lines.map(({ product, size, quantity }) => `• ${product.name} — EU ${size} × ${quantity}: ${currency(product.price * quantity)}`).join("\n");
  const message = [
    "Hello Sole Luxe! I’d like to place this order:",
    "", lines, "", `Total: ${currency(cart.subtotal)}`, "",
    `Name: ${data.get("name")}`, `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email")}`, `Address: ${data.get("address")}`, `City: ${data.get("city")}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  const popup = window.open(whatsappUrl, "_blank");
  if (!popup) {
    errorElement.textContent = "Your browser blocked the WhatsApp window. Allow pop-ups and submit again.";
    errorElement.hidden = false;
    return;
  }
  popup.opener = null;
  cart.clear();
  form.reset();
  errorElement.hidden = true;
  checkoutModal.close();
  closePanels();
  showToast("Your order details are ready in WhatsApp.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const input = form.querySelector("input");
  const message = document.querySelector("#newsletter-message");
  if (!input.reportValidity()) return;
  message.textContent = "You’re on the list. Thanks for being here.";
  message.classList.add("is-success");
  form.reset();
});

function observeReveals(root = document) {
  const revealElements = root.querySelectorAll(".reveal:not(.is-revealed)");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealElements.forEach((element) => element.classList.add("is-revealed"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
}

renderProducts();
renderCart();
updateWishlist();
observeReveals();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

if ("IntersectionObserver" in window) observeReveals();
else document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-revealed"));

try {
  const { createShoeScene } = await import("./three-scene.js");
  window.soleLuxeScene = createShoeScene();
} catch (error) {
  console.error("Sole Luxe 3D dependencies could not be loaded:", error);
  document.querySelector(".scene-loading").hidden = true;
  const notice = document.querySelector(".model-notice");
  notice.hidden = false;
  notice.textContent = "3D preview could not load. Check your connection and add a GLB at assets/models/sole-luxe-shoe.glb.";
}
