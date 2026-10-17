(() => {
  "use strict";

  const menuItems = window.CAFE_MENU_ITEMS;
  const categories = ["All", ...window.CAFE_MENU.map(({ category }) => category)];
  const storageKeys = { settings: "cafe-lumiere-demo-settings-v1", cart: "cafe-lumiere-demo-cart-v1" };
  const defaultSettings = {
    tax: 0,
    freeThreshold: 0,
    fees: { fee2: 100, fee4: 150, fee6: 200, fee8: 250, fee10: 350, fee12: 450 },
    overrides: {}
  };
  const sceneCopy = {
    exterior: ["A welcoming street-side entrance", "Glass, warm timber and a softly lit welcome after dusk."],
    interior: ["A calm, considered interior", "An imagined lounge with wood grain, leafy corners and amber light."],
    counter: ["Coffee, crafted at the counter", "A warm bar moment inspired by the daily ritual of a good cup."],
    dining: ["Room for one more at the table", "Comfortable seating and space for unhurried conversation."]
  };
  const fallbackImages = {
    "Hot Coffee": "assets/coffee.jpg",
    "Cold Coffee": "assets/coffee.jpg",
    Breakfast: "assets/brunch.jpg",
    "Burgers & Sandwiches": "assets/brunch.jpg",
    "Pasta & Main Course": "assets/brunch.jpg",
    Pizza: "assets/cafe-detail.jpg",
    Desserts: "assets/pastry.jpg",
    Beverages: "assets/coffee.jpg"
  };

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const formatPrice = (value) => `Rs. ${Math.round(value).toLocaleString("en-PK")}`;
  const parseStored = (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Unable to read local demo data "${key}". Using defaults instead.`, error);
      return null;
    }
  };

  let settings = { ...defaultSettings, fees: { ...defaultSettings.fees }, overrides: {} };
  let cart = new Map();
  let activeCategory = "All";
  let detailItemId = null;

  const storedSettings = parseStored(storageKeys.settings);
  if (storedSettings && typeof storedSettings === "object") {
    const tax = Number(storedSettings.tax);
    const threshold = Number(storedSettings.freeThreshold);
    settings.tax = Number.isFinite(tax) && tax >= 0 && tax <= 100 ? tax : defaultSettings.tax;
    settings.freeThreshold = Number.isFinite(threshold) && threshold >= 0 ? threshold : defaultSettings.freeThreshold;
    settings.fees = { ...defaultSettings.fees };
    Object.keys(settings.fees).forEach((key) => {
      const fee = Number(storedSettings.fees && storedSettings.fees[key]);
      if (Number.isFinite(fee) && fee >= 0) settings.fees[key] = fee;
    });
    if (storedSettings.overrides && typeof storedSettings.overrides === "object") {
      Object.entries(storedSettings.overrides).forEach(([id, override]) => {
        const price = Number(override && override.price);
        if (menuItems.some((item) => item.id === id) && Number.isFinite(price) && price >= 0) {
          settings.overrides[id] = { price, available: override.available !== false };
        }
      });
    }
  }
  const storedCart = parseStored(storageKeys.cart);
  if (Array.isArray(storedCart)) {
    storedCart.forEach(([id, quantity]) => {
      if (menuItems.some((item) => item.id === id) && Number.isInteger(quantity) && quantity > 0 && quantity < 100) cart.set(id, quantity);
    });
  }

  function itemPrice(item) {
    return settings.overrides[item.id]?.price ?? item.price;
  }

  function itemAvailable(item) {
    return settings.overrides[item.id]?.available !== false;
  }

  function setImageFallback(img) {
    img.addEventListener("error", () => {
      const fallback = fallbackImages[img.dataset.category] || "assets/cafe-detail.jpg";
      if (img.src.endsWith(fallback)) return;
      img.src = fallback;
    }, { once: true });
  }

  function renderFilters() {
    const holder = $("[data-category-filters]");
    holder.innerHTML = categories.map((category) =>
      `<button class="filter-button${activeCategory === category ? " is-active" : ""}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${activeCategory === category}">${escapeHtml(category)}</button>`
    ).join("");
  }

  function renderMenu() {
    const query = $("#menu-search").value.trim().toLocaleLowerCase();
    const sort = $("#menu-sort").value;
    let visibleItems = menuItems.filter((item) =>
      (activeCategory === "All" || item.category === activeCategory)
      && `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase().includes(query)
    );
    if (sort === "name") visibleItems = [...visibleItems].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-low") visibleItems = [...visibleItems].sort((a, b) => itemPrice(a) - itemPrice(b));
    if (sort === "price-high") visibleItems = [...visibleItems].sort((a, b) => itemPrice(b) - itemPrice(a));
    $("[data-menu-results]").textContent = `${visibleItems.length} sample ${visibleItems.length === 1 ? "item" : "items"} · 54 demo menu items`;
    const grid = $("[data-product-grid]");
    if (visibleItems.length === 0) {
      grid.innerHTML = '<p class="empty-results">No items match your search. Try a different dish or category.</p>';
      return;
    }
    grid.innerHTML = visibleItems.map((item) => {
      const available = itemAvailable(item);
      const quantity = cart.get(item.id) || 0;
      return `<article class="product-card">
        <div class="product-image-wrap">
          <img src="${escapeHtml(item.image)}" data-category="${escapeHtml(item.category)}" alt="${escapeHtml(item.name)} — sample café menu photograph" loading="lazy">
          <span class="product-category">${escapeHtml(item.category)}</span>
          ${available ? "" : '<span class="product-status">Unavailable</span>'}
        </div>
        <div class="product-card-content">
          <div class="product-card-title"><h3>${escapeHtml(item.name)}</h3><button class="detail-trigger" type="button" data-item-details="${escapeHtml(item.id)}" aria-label="View ${escapeHtml(item.name)} details">Details</button></div>
          <p>${escapeHtml(item.description)}</p>
          <div class="product-bottom"><span class="product-price">${formatPrice(itemPrice(item))}</span><button class="add-button" type="button" data-add-item="${escapeHtml(item.id)}" ${available ? "" : "disabled"}>${available ? `${quantity ? `${quantity} · ` : ""}Add to bag +` : "Unavailable"}</button></div>
        </div>
      </article>`;
    }).join("");
    $$("[data-category]", grid).forEach((img) => setImageFallback(img));
    $$("img[data-category]", grid).forEach(setImageFallback);
  }

  function saveCart() {
    try {
      localStorage.setItem(storageKeys.cart, JSON.stringify([...cart.entries()]));
    } catch (error) {
      console.warn("Could not save the demo cart in this browser.", error);
    }
  }

  function currentFulfilment() {
    return $('#checkout-form [name="fulfilment"]').value;
  }

  function selectedDeliveryFee(subtotal) {
    if (currentFulfilment() !== "delivery") return 0;
    const zone = $('#checkout-form [name="zone"]').value;
    if (zone === "outside") return null;
    const fee = settings.fees[`fee${zone}`] ?? 0;
    if (settings.freeThreshold > 0 && subtotal >= settings.freeThreshold) return 0;
    return fee;
  }

  function renderCart() {
    const holder = $("[data-cart-items]");
    const lineItems = [...cart.entries()].map(([id, quantity]) => ({
      item: menuItems.find((entry) => entry.id === id),
      quantity
    })).filter(({ item }) => item);
    const count = lineItems.reduce((total, line) => total + line.quantity, 0);
    $$("[data-cart-count]").forEach((element) => { element.textContent = String(count); });
    holder.innerHTML = lineItems.length ? lineItems.map(({ item, quantity }) =>
      `<article class="cart-item">
        <img src="${escapeHtml(item.image)}" data-category="${escapeHtml(item.category)}" alt="" loading="lazy">
        <div><h3>${escapeHtml(item.name)}</h3><span>${formatPrice(itemPrice(item))} each</span>
          <div class="quantity-control" aria-label="Quantity of ${escapeHtml(item.name)}">
            <button type="button" data-quantity="${escapeHtml(item.id)}" data-delta="-1" aria-label="Remove one ${escapeHtml(item.name)}">−</button>
            <span>${quantity}</span>
            <button type="button" data-quantity="${escapeHtml(item.id)}" data-delta="1" aria-label="Add one ${escapeHtml(item.name)}">+</button>
          </div>
        </div>
        <button class="remove-cart-item" type="button" data-remove-item="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)} from the bag">×</button>
      </article>`
    ).join("") : '<p class="empty-cart">Your bag is empty. Find something lovely on the sample menu.</p>';
    $$("img[data-category]", holder).forEach(setImageFallback);
    const subtotal = lineItems.reduce((total, { item, quantity }) => total + itemPrice(item) * quantity, 0);
    const deliveryFee = selectedDeliveryFee(subtotal);
    const isOutOfZone = deliveryFee === null;
    const tax = subtotal * (settings.tax / 100);
    const total = subtotal + (deliveryFee || 0) + tax;
    $("[data-subtotal]").textContent = formatPrice(subtotal);
    $("[data-delivery]").textContent = isOutOfZone ? "Unavailable" : formatPrice(deliveryFee || 0);
    $("[data-tax]").textContent = formatPrice(tax);
    $("[data-total]").textContent = formatPrice(total);
    $("[data-tax-label]").textContent = `${settings.tax}%`;
    $("[data-delivery-label]").textContent = currentFulfilment() === "delivery"
      ? (settings.freeThreshold > 0 && subtotal >= settings.freeThreshold ? "Free sample delivery" : "Sample fee")
      : "Pickup";
    const zoneMessage = $("[data-zone-message]");
    zoneMessage.classList.toggle("is-error", isOutOfZone);
    zoneMessage.textContent = isOutOfZone
      ? "Outside the sample 0–12 km zones. No delivery is available in this demo."
      : (settings.freeThreshold > 0 && subtotal >= settings.freeThreshold && currentFulfilment() === "delivery"
        ? `Sample free delivery from ${formatPrice(settings.freeThreshold)}.`
        : "Sample delivery zones only; real delivery is not configured.");
    $(".checkout-submit").disabled = lineItems.length === 0 || isOutOfZone;
    saveCart();
  }

  function addToCart(id) {
    const item = menuItems.find((entry) => entry.id === id);
    if (!item || !itemAvailable(item)) return;
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    renderMenu();
  }

  function openCart() {
    document.body.classList.add("drawer-open");
    $(".cart-drawer").setAttribute("aria-hidden", "false");
    $("[data-open-cart]").focus({ preventScroll: true });
  }

  function closeCart() {
    document.body.classList.remove("drawer-open");
    $(".cart-drawer").setAttribute("aria-hidden", "true");
  }

  function showItemDetails(id) {
    const item = menuItems.find((entry) => entry.id === id);
    if (!item) return;
    detailItemId = id;
    const image = $("[data-detail-image]");
    image.src = item.image;
    image.alt = `${item.name} sample menu photograph`;
    image.onerror = () => { image.src = fallbackImages[item.category] || "assets/cafe-detail.jpg"; };
    $("[data-detail-category]").textContent = item.category;
    $("[data-detail-name]").textContent = item.name;
    $("[data-detail-description]").textContent = item.description;
    $("[data-detail-price]").textContent = `${formatPrice(itemPrice(item))} · sample price`;
    $("[data-detail-add]").disabled = !itemAvailable(item);
    $("[data-detail-add]").textContent = itemAvailable(item) ? "Add to demo cart +" : "Currently unavailable";
    $(".item-dialog").showModal();
    document.body.classList.add("dialog-open");
  }

  function fillAdminForm() {
    const select = $("[data-admin-item]");
    const previous = select.value;
    select.innerHTML = menuItems.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.category)} — ${escapeHtml(item.name)}</option>`).join("");
    if (menuItems.some((item) => item.id === previous)) select.value = previous;
    const item = menuItems.find((entry) => entry.id === select.value) || menuItems[0];
    $("[name='price']", $("#admin-form")).value = itemPrice(item);
    $("[name='available']", $("#admin-form")).checked = itemAvailable(item);
    $("[name='tax']", $("#admin-form")).value = settings.tax;
    $("[name='freeThreshold']", $("#admin-form")).value = settings.freeThreshold;
    Object.keys(settings.fees).forEach((key) => { $(`[name="${key}"]`, $("#admin-form")).value = settings.fees[key]; });
  }

  function saveSettings() {
    try {
      localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save the local demo settings.", error);
      $("[data-admin-feedback]").textContent = "Settings could not be saved in this browser. Check its storage settings.";
    }
  }

  function toggleDeliveryFields() {
    const isDelivery = currentFulfilment() === "delivery";
    $$("[name='zone'], [name='address']").forEach((field) => {
      const label = field.closest("label");
      label.hidden = !isDelivery;
      field.required = isDelivery && field.name === "address";
    });
    renderCart();
  }

  renderFilters();
  renderMenu();
  fillAdminForm();
  renderCart();

  $("[data-category-filters]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    renderFilters();
    renderMenu();
  });
  $("#menu-search").addEventListener("input", renderMenu);
  $("#menu-sort").addEventListener("change", renderMenu);
  $("[data-product-grid]").addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-item]");
    if (addButton) addToCart(addButton.dataset.addItem);
    const detailButton = event.target.closest("[data-item-details]");
    if (detailButton) showItemDetails(detailButton.dataset.itemDetails);
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-cart]")) openCart();
    if (event.target.closest("[data-close-cart]")) closeCart();
  });
  $("[data-cart-items]").addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove-item]");
    if (removeButton) {
      cart.delete(removeButton.dataset.removeItem);
    } else if (quantityButton) {
      const id = quantityButton.dataset.quantity;
      const quantity = (cart.get(id) || 0) + Number(quantityButton.dataset.delta);
      if (quantity <= 0) cart.delete(id);
      else cart.set(id, Math.min(quantity, 99));
    }
    renderCart();
    renderMenu();
  });
  $('#checkout-form [name="fulfilment"]').addEventListener("change", toggleDeliveryFields);
  $('#checkout-form [name="zone"]').addEventListener("change", renderCart);
  $("[data-close-item]").addEventListener("click", () => $(".item-dialog").close());
  $(".item-dialog").addEventListener("close", () => document.body.classList.remove("dialog-open"));
  $("[data-detail-add]").addEventListener("click", () => {
    if (detailItemId) {
      addToCart(detailItemId);
      $(".item-dialog").close();
      openCart();
    }
  });
  $("[data-close-confirmation]").addEventListener("click", () => $(".confirmation-dialog").close());
  $(".confirmation-dialog").addEventListener("close", () => document.body.classList.remove("dialog-open"));
  $("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = $("[data-checkout-feedback]");
    const entries = [...cart.entries()];
    const totalText = $("[data-total]").textContent;
    if (!entries.length) {
      feedback.textContent = "Add a sample menu item before continuing.";
      return;
    }
    if (entries.some(([id]) => {
      const item = menuItems.find((entry) => entry.id === id);
      return !item || !itemAvailable(item);
    })) {
      feedback.textContent = "A cart item has become unavailable. Remove it before continuing.";
      return;
    }
    if (currentFulfilment() === "delivery" && $('#checkout-form [name="zone"]').value === "outside") {
      feedback.textContent = "This address is outside the sample delivery zones.";
      return;
    }
    const method = $('#checkout-form [name="fulfilment"]').value;
    $("[data-confirmation-copy]").textContent = `This frontend-only ${method} demonstration has ${entries.reduce((sum, [, quantity]) => sum + quantity, 0)} sample item(s), with an estimated total of ${totalText}. No order has actually been placed.`;
    closeCart();
    cart.clear();
    renderCart();
    renderMenu();
    $("#checkout-form").reset();
    toggleDeliveryFields();
    $(".confirmation-dialog").showModal();
    document.body.classList.add("dialog-open");
  });

  $$("[data-scene]").forEach((button) => button.addEventListener("click", () => {
    const scene = button.dataset.scene;
    const stage = $(".scene-stage");
    stage.dataset.activeScene = scene;
    $$(".scene-tab").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    $("[data-scene-title]").textContent = sceneCopy[scene][0];
    $("[data-scene-description]").textContent = sceneCopy[scene][1];
    stage.style.setProperty("--scene-rotate", scene === "interior" ? "8deg" : "-12deg");
  }));
  const sceneStage = $(".scene-stage");
  let lastPointerX = null;
  let sceneRotation = -12;
  sceneStage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    lastPointerX = event.clientX;
    sceneStage.setPointerCapture(event.pointerId);
  });
  sceneStage.addEventListener("pointermove", (event) => {
    if (lastPointerX === null) return;
    sceneRotation = Math.max(-40, Math.min(40, sceneRotation + (event.clientX - lastPointerX) * .35));
    lastPointerX = event.clientX;
    sceneStage.style.setProperty("--scene-rotate", `${sceneRotation}deg`);
  });
  const finishSceneDrag = () => { lastPointerX = null; };
  sceneStage.addEventListener("pointerup", finishSceneDrag);
  sceneStage.addEventListener("pointercancel", finishSceneDrag);

  $$(".gallery-card[data-gallery-image]").forEach((button) => button.addEventListener("click", () => {
    const image = $("[data-lightbox-image]");
    image.src = button.dataset.galleryImage;
    image.alt = button.querySelector("img").alt;
    $("[data-lightbox-caption]").textContent = button.dataset.galleryCaption;
    $(".lightbox-dialog").showModal();
    document.body.classList.add("dialog-open");
  }));
  $("[data-close-lightbox]").addEventListener("click", () => $(".lightbox-dialog").close());
  $(".lightbox-dialog").addEventListener("close", () => document.body.classList.remove("dialog-open"));
  $$("[data-footer-category]").forEach((link) => link.addEventListener("click", () => {
    activeCategory = link.dataset.footerCategory;
    renderFilters();
    renderMenu();
  }));

  function setMinimumDate() {
    const date = new Date();
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $('#reservation-form [name="date"]').min = localDate;
  }
  setMinimumDate();
  $("#reservation-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("[data-reservation-feedback]").textContent = "Thanks! Your sample reservation request is ready. This demo does not contact a café or book a real table.";
    event.currentTarget.reset();
    setMinimumDate();
  });
  $("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("[data-contact-feedback]").textContent = "Thanks! Your inquiry passed the demo form checks. It has not been sent or stored; call or WhatsApp Umair Akbar to get in touch.";
    event.currentTarget.reset();
  });

  $("[data-admin-item]").addEventListener("change", fillAdminForm);
  $("#admin-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const id = form.elements.item.value;
    const item = menuItems.find((entry) => entry.id === id);
    const price = Number(form.elements.price.value);
    const tax = Number(form.elements.tax.value);
    const threshold = Number(form.elements.freeThreshold.value);
    const fees = Object.fromEntries(Object.keys(settings.fees).map((key) => [key, Number(form.elements[key].value)]));
    const validFees = Object.values(fees).every((fee) => Number.isFinite(fee) && fee >= 0);
    if (!item || !Number.isFinite(price) || price < 0 || !Number.isFinite(tax) || tax < 0 || tax > 100 || !Number.isFinite(threshold) || threshold < 0 || !validFees) {
      $("[data-admin-feedback]").textContent = "Please enter valid non-negative sample prices and fees. Tax must be between 0 and 100%.";
      return;
    }
    settings = {
      ...settings,
      tax,
      freeThreshold: threshold,
      fees,
      overrides: { ...settings.overrides, [id]: { price, available: form.elements.available.checked } }
    };
    saveSettings();
    if ($("[data-admin-feedback]").textContent.startsWith("Settings could not")) return;
    $("[data-admin-feedback]").textContent = "Saved on this browser only. These settings are not connected to a real café.";
    renderMenu();
    renderCart();
  });
  $("[data-reset-admin]").addEventListener("click", () => {
    settings = { ...defaultSettings, fees: { ...defaultSettings.fees }, overrides: {} };
    try {
      localStorage.removeItem(storageKeys.settings);
    } catch (error) {
      console.error("Could not clear local demo settings.", error);
      $("[data-admin-feedback]").textContent = "Defaults were restored for this session, but the saved browser setting could not be cleared.";
    }
    fillAdminForm();
    renderMenu();
    renderCart();
    if (!$("[data-admin-feedback]").textContent.startsWith("Defaults were restored")) {
      $("[data-admin-feedback]").textContent = "Defaults restored for this browser preview.";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("drawer-open")) closeCart();
  });
  toggleDeliveryFields();
})();
