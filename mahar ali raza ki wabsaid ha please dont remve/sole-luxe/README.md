# SOLE LUXE

A responsive, frontend-only luxury sneaker storefront built with semantic HTML, CSS, vanilla JavaScript modules, and a real Three.js GLB/GLTF viewer.

## Run locally

1. Open the `sole-luxe` folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and select **Open with Live Server**.
4. Keep an internet connection available for the Three.js CDN modules, web fonts, and the sample Unsplash product photography.

Opening `index.html` directly as a `file://` URL does not reliably support JavaScript modules; use Live Server or another local HTTP server.

## Add the interactive shoe model

Place your own `.glb` shoe model at:

```text
assets/models/sole-luxe-shoe.glb
```

The scene loads that path from `js/three-scene.js` (`MODEL_URL`). Replace the constant there if you prefer another model path. Export the model in a GLB/glTF-compatible format with textures included. The viewer scales and centers the model automatically. If the model is missing, invalid, or WebGL is unavailable, the hero keeps its sneaker-photo fallback and shows an explanation; the rest of the store remains usable.

## Edit products and images

Edit the product objects in `js/products.js`. Each object includes its name, category, audience, PKR price, optional sale price, rating, sizes, stock, description, image URL, and product flags. Change `sizes` to set the available EU sizes. Product and gallery images can be replaced with your own files under `assets/images/`; update the corresponding `image` URL in `js/products.js` or the image URL in `index.html`. Keep image alt text descriptive. The sample images are remotely hosted and require internet access.

## Configure WhatsApp ordering

Set `WHATSAPP_PHONE` near the top of `js/app.js` to the shop's real phone number in international format with digits only, including the country code and excluding `+`, spaces, and punctuation. The value is intentionally blank in this demo; checkout reports that WhatsApp ordering is not configured until a store owner supplies a number. Checkout validates customer and address fields and then creates a pre-filled WhatsApp order message.

## Storefront features

- Responsive glass-effect navigation, collection browsing, search, category/price/size filters, sorting, wishlist, and accessible quick-view dialogs.
- Size-required shopping bag with quantity controls, totals, and browser `localStorage` persistence. Only cart and wishlist preferences are stored locally; no payment data is collected.
- Reduced-motion-aware scroll reveals and an interactive WebGL scene that loads the configured shoe model, responds to pointer movement, and rotates with scroll.
- Newsletter form with browser email validation and a demo-only success response.

For a real newsletter, customer support channel, delivery policy, or social profile, replace the clearly marked sample contact details and placeholder destination links before publishing.

## Production and payment note

This project is a frontend demo. It does **not** process real online payments, securely store submitted orders, confirm payment, or manage live inventory. Those capabilities require a trusted backend, secure order storage, server-side validation, inventory integration, and an appropriate payment gateway. Do not collect or store payment credentials in browser storage. Configure and test all WhatsApp, contact, policy, and social destinations before launch.

## External dependencies

- Three.js `0.165.0` and its `GLTFLoader`, loaded as ES modules from jsDelivr.
- DM Sans and Manrope fonts from Google Fonts, with local system-font fallbacks.
- Sample product/gallery photographs hosted by Unsplash.

If a CDN is unavailable, the HTML catalog, filters, saved bag, and frontend UI continue to work; the 3D scene displays its fallback image and reports the model/dependency issue.
