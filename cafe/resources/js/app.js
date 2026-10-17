import './bootstrap';

const menuToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');

if (menuToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
        siteNav.classList.toggle('is-open', !expanded);
    });

    siteNav.addEventListener('click', (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
            siteNav.classList.remove('is-open');
        }
    });
}

const catalogElement = document.querySelector('#product-catalog');
const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartBackdrop = document.querySelector('[data-cart-backdrop]');
const cartItems = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartFooter = document.querySelector('[data-cart-footer]');
const checkoutLink = document.querySelector('[data-checkout-link]');
const orderMethod = document.querySelector('[data-order-method]');
const orderAddress = document.querySelector('[data-order-address]');
const addressField = document.querySelector('[data-delivery-address]');
const checkoutError = document.querySelector('[data-checkout-error]');
const whatsappNumber = document.body.dataset.whatsapp;

if (
    catalogElement instanceof HTMLScriptElement
    && cartDrawer instanceof HTMLElement
    && cartBackdrop instanceof HTMLElement
    && cartItems instanceof HTMLElement
    && cartEmpty instanceof HTMLElement
    && cartFooter instanceof HTMLElement
    && checkoutLink instanceof HTMLAnchorElement
    && orderMethod instanceof HTMLSelectElement
    && orderAddress instanceof HTMLTextAreaElement
    && addressField instanceof HTMLLabelElement
    && checkoutError instanceof HTMLElement
    && typeof whatsappNumber === 'string'
    && /^\d+$/.test(whatsappNumber)
) {
    const products = JSON.parse(catalogElement.textContent || '[]');
    const productsById = new Map(products.map((product) => [product.id, product]));
    const quantities = new Map();
    const formatPrice = (amount) => `Rs. ${new Intl.NumberFormat('en-PK').format(amount)}`;
    const closeButton = document.querySelector('[data-close-cart]');
    let lastFocusedElement = null;

    function updateCart() {
        const entries = [...quantities.entries()]
            .filter(([, quantity]) => quantity > 0)
            .map(([id, quantity]) => ({ product: productsById.get(id), quantity }));
        const totalQuantity = entries.reduce((total, entry) => total + entry.quantity, 0);
        const subtotal = entries.reduce((total, entry) => total + entry.product.price * entry.quantity, 0);

        document.querySelectorAll('[data-cart-count]').forEach((element) => {
            element.textContent = String(totalQuantity);
            element.setAttribute('aria-label', `${totalQuantity} items in basket`);
        });

        cartItems.replaceChildren(...entries.map(({ product, quantity }) => {
            const row = document.createElement('article');
            row.className = 'cart-line';

            const image = document.createElement('img');
            image.src = product.image;
            image.alt = '';
            image.loading = 'lazy';

            const details = document.createElement('div');
            details.className = 'cart-line-details';
            const name = document.createElement('strong');
            name.textContent = product.name;
            const price = document.createElement('span');
            price.textContent = formatPrice(product.price);
            details.append(name, price);

            const controls = document.createElement('div');
            controls.className = 'cart-quantity';
            const decrease = document.createElement('button');
            decrease.type = 'button';
            decrease.dataset.cartChange = product.id;
            decrease.dataset.amount = '-1';
            decrease.setAttribute('aria-label', `Remove one ${product.name}`);
            decrease.textContent = '−';
            const count = document.createElement('span');
            count.textContent = String(quantity);
            const increase = document.createElement('button');
            increase.type = 'button';
            increase.dataset.cartChange = product.id;
            increase.dataset.amount = '1';
            increase.setAttribute('aria-label', `Add one ${product.name}`);
            increase.textContent = '+';
            controls.append(decrease, count, increase);

            const total = document.createElement('strong');
            total.className = 'cart-line-total';
            total.textContent = formatPrice(product.price * quantity);
            row.append(image, details, total, controls);

            return row;
        }));

        cartEmpty.hidden = totalQuantity > 0;
        cartFooter.hidden = totalQuantity === 0;
        document.querySelector('[data-cart-total]').textContent = formatPrice(subtotal);

        const orderLines = entries.map(({ product, quantity }) => (
            `${quantity} × ${product.name} — ${formatPrice(product.price * quantity)}`
        ));
        const delivery = orderMethod.value === 'delivery';
        const message = [
            'Hello Café Lumière! I would like to place an order:',
            ...orderLines,
            `Subtotal: ${formatPrice(subtotal)}`,
            `Order method: ${delivery ? 'Home delivery' : 'Café pickup'}`,
            ...(delivery ? [`Delivery address: ${orderAddress.value.trim() || '(to be provided)'}`] : []),
            'Please confirm availability, any delivery fee, and available payment options.',
        ].join('\n');
        checkoutLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    function openCart() {
        lastFocusedElement = document.activeElement;
        cartDrawer.inert = false;
        cartDrawer.setAttribute('aria-hidden', 'false');
        cartBackdrop.hidden = false;
        document.body.classList.add('cart-open');
        requestAnimationFrame(() => cartDrawer.classList.add('is-open'));
        closeButton?.focus();
    }

    function closeCart() {
        cartDrawer.classList.remove('is-open');
        cartDrawer.setAttribute('aria-hidden', 'true');
        cartDrawer.inert = true;
        cartBackdrop.hidden = true;
        document.body.classList.remove('cart-open');
        if (lastFocusedElement instanceof HTMLElement) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll('[data-category]').forEach((button) => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            document.querySelectorAll('[data-category]').forEach((chip) => {
                const isActive = chip === button;
                chip.classList.toggle('is-active', isActive);
                chip.setAttribute('aria-pressed', String(isActive));
            });
            document.querySelectorAll('[data-product-card]').forEach((card) => {
                card.hidden = category !== 'all' && card.dataset.category !== category;
            });
        });
    });

    function updateOrderMethod() {
        const delivery = orderMethod.value === 'delivery';
        addressField.hidden = !delivery;
        orderAddress.required = delivery;
        checkoutError.hidden = true;
        updateCart();
    }

    orderMethod.addEventListener('change', updateOrderMethod);
    orderAddress.addEventListener('input', () => {
        checkoutError.hidden = true;
        updateCart();
    });
    checkoutLink.addEventListener('click', (event) => {
        if (orderMethod.value === 'delivery' && !orderAddress.value.trim()) {
            event.preventDefault();
            checkoutError.hidden = false;
            orderAddress.focus();
        }
    });

    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const addButton = event.target.closest('[data-add-to-cart]');
        if (addButton instanceof HTMLButtonElement) {
            const id = addButton.dataset.addToCart;
            if (productsById.has(id)) {
                quantities.set(id, (quantities.get(id) || 0) + 1);
                updateCart();
                addButton.classList.add('is-added');
                addButton.textContent = '✓';
                window.setTimeout(() => {
                    addButton.classList.remove('is-added');
                    addButton.textContent = '+';
                }, 900);
            }
            return;
        }

        const quantityButton = event.target.closest('[data-cart-change]');
        if (quantityButton instanceof HTMLButtonElement) {
            const id = quantityButton.dataset.cartChange;
            const nextQuantity = (quantities.get(id) || 0) + Number(quantityButton.dataset.amount);
            if (nextQuantity > 0) {
                quantities.set(id, nextQuantity);
            } else {
                quantities.delete(id);
            }
            updateCart();
            return;
        }

        if (event.target.closest('[data-open-cart]')) {
            openCart();
            return;
        }

        if (event.target.closest('[data-close-cart]') || event.target === cartBackdrop) {
            closeCart();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && cartDrawer.getAttribute('aria-hidden') === 'false') {
            closeCart();
        }
    });

    updateCart();
}
