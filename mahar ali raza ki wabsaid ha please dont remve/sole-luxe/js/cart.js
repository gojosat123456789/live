const CART_KEY = "sole-luxe-cart-v1";

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(saved)) throw new TypeError("Saved cart is not a list.");
    return saved.filter((item) =>
      item && typeof item.productId === "string" &&
      Number.isInteger(item.size) && Number.isInteger(item.quantity) && item.quantity > 0
    );
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      localStorage.removeItem(CART_KEY);
      return [];
    }
    throw error;
  }
}

export class ShoppingCart extends EventTarget {
  constructor(catalog) {
    super();
    this.catalog = catalog;
    this.items = readCart().filter((item) => this.catalog.some((product) => product.id === item.productId));
  }

  save() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    this.dispatchEvent(new Event("change"));
  }

  add(productId, size, quantity = 1) {
    const product = this.catalog.find((item) => item.id === productId);
    if (!product || !product.sizes.includes(Number(size))) return false;
    const count = Math.max(1, Math.floor(Number(quantity) || 1));
    const line = this.items.find((item) => item.productId === productId && item.size === Number(size));
    const nextQuantity = (line?.quantity || 0) + count;
    if (nextQuantity > product.stock) return false;
    if (line) line.quantity = nextQuantity;
    else this.items.push({ productId, size: Number(size), quantity: count });
    this.save();
    return true;
  }

  update(productId, size, quantity) {
    const product = this.catalog.find((item) => item.id === productId);
    const nextQuantity = Math.floor(Number(quantity));
    if (!product || nextQuantity > product.stock) return false;
    if (nextQuantity < 1) return this.remove(productId, size);
    const line = this.items.find((item) => item.productId === productId && item.size === Number(size));
    if (!line) return false;
    line.quantity = nextQuantity;
    this.save();
    return true;
  }

  remove(productId, size) {
    const next = this.items.filter((item) => item.productId !== productId || item.size !== Number(size));
    if (next.length === this.items.length) return false;
    this.items = next;
    this.save();
    return true;
  }

  clear() {
    this.items = [];
    this.save();
  }

  get lines() {
    return this.items.map((item) => ({
      ...item,
      product: this.catalog.find((product) => product.id === item.productId)
    })).filter((item) => item.product);
  }

  get itemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get subtotal() {
    return this.lines.reduce((total, line) => total + line.product.price * line.quantity, 0);
  }
}
