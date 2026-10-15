const standardSizes = [39, 40, 41, 42, 43, 44, 45];

export const products = [
  {
    id: "velocity-one", name: "Velocity One", category: "running", audience: "men",
    price: 28900, originalPrice: 34500, rating: 4.9, reviews: 128, sizes: standardSizes,
    isNew: true, bestseller: true, stock: 18,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    alt: "Red and white performance sneaker, Velocity One",
    description: "A responsive everyday runner with a feather-light feel, considered cushioning, and a confident silhouette."
  },
  {
    id: "monochrome-low", name: "Monochrome Low", category: "casual", audience: "unisex",
    price: 21900, rating: 4.8, reviews: 94, sizes: standardSizes,
    isNew: false, bestseller: true, stock: 24,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85",
    alt: "Minimal low-top white sneaker, Monochrome Low",
    description: "Clean lines, a beautifully easy fit, and an understated profile that belongs in every rotation."
  },
  {
    id: "atelier-01", name: "Atelier 01", category: "luxury", audience: "unisex",
    price: 42900, rating: 5.0, reviews: 61, sizes: standardSizes,
    isNew: true, bestseller: false, stock: 10,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85",
    alt: "Refined premium neutral sneaker, Atelier 01",
    description: "A little more considered. Layered textures and a refined shape make this the pair you reach for first."
  },
  {
    id: "motion-knit", name: "Motion Knit", category: "sports", audience: "women",
    price: 26400, originalPrice: 29900, rating: 4.7, reviews: 83, sizes: standardSizes,
    isNew: false, bestseller: true, stock: 14,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=85",
    alt: "Lightweight knit sport sneaker, Motion Knit",
    description: "Flexible knit construction and soft support come together for a lighter, more effortless kind of movement."
  },
  {
    id: "city-form", name: "City Form", category: "casual", audience: "men",
    price: 23800, rating: 4.8, reviews: 72, sizes: standardSizes,
    isNew: true, bestseller: false, stock: 20,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85",
    alt: "Modern city-ready sneaker, City Form",
    description: "A versatile low-profile shape for navigating the city, with soft cushioning that goes the distance."
  },
  {
    id: "aero-pulse", name: "Aero Pulse", category: "running", audience: "women",
    price: 31700, rating: 4.9, reviews: 105, sizes: standardSizes,
    isNew: true, bestseller: true, stock: 12,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85",
    alt: "Sleek technical running sneaker, Aero Pulse",
    description: "Built for a little more momentum, with springy cushioning and a streamlined, easy-moving fit."
  },
  {
    id: "silverline-high", name: "Silverline High", category: "luxury", audience: "unisex",
    price: 38900, rating: 4.8, reviews: 47, sizes: standardSizes,
    isNew: false, bestseller: false, stock: 8,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85",
    alt: "Sculptural high-top sneaker, Silverline High",
    description: "A contemporary high-top with a confident shape, soft padded support, and carefully finished details."
  },
  {
    id: "everyday-sole", name: "Everyday Sole", category: "sports", audience: "women",
    price: 19800, originalPrice: 22900, rating: 4.6, reviews: 116, sizes: standardSizes,
    isNew: false, bestseller: true, stock: 27,
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85&sat=-35",
    alt: "Comfortable neutral everyday sneaker, Everyday Sole",
    description: "A reliable, uncomplicated favourite with easy comfort and the kind of styling that works with anything."
  }
];

export const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(amount);
