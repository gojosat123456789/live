<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#181510">
    <meta name="description" content="A little world of beautiful coffee, unhurried brunch and good company. Welcome to Café Lumière.">
    <title>Café Lumière — International Coffee & Dining</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body data-whatsapp="{{ config('cafe.whatsapp') }}">
    <div class="topline"><span class="topline-dot"></span> A GOOD DAY STARTS WITH A GOOD CUP <a href="https://wa.me/{{ config('cafe.whatsapp') }}" target="_blank" rel="noreferrer">Say bonjour <span aria-hidden="true">↗</span></a></div>
    <header class="site-header">
        <a class="brand" href="#home" aria-label="Café Lumière home">
            <span class="brand-symbol" aria-hidden="true">L<span>.</span></span>
            <span class="brand-wordmark">CAFÉ <b>LUMIÈRE</b><small>INTERNATIONAL COFFEE & DINING</small></span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation"><span></span><span></span></button>
        <nav class="site-nav" id="site-nav" aria-label="Main navigation">
            <a href="#home">Home</a><a href="#menu">Our menu</a><a href="#story">Our story</a><a href="#visit">Visit us</a>
        </nav>
        <a class="header-order" href="#menu">Order a little joy <span aria-hidden="true">↗</span></a>
    </header>

    <main>
        <section class="hero" id="home">
            <div class="hero-copy">
                <div class="eyebrow"><span></span> YOUR TABLE IS WAITING</div>
                <h1>Stay for the<br>coffee. <em>Leave</em><br>with a story.</h1>
                <p>A little espresso, a slow brunch, another hour with your favourite people. Find your moment at Café Lumière.</p>
                <div class="hero-actions"><a class="button button-gold" href="#menu">Explore the menu <span aria-hidden="true">↗</span></a><a class="quiet-link" href="#story"><span class="play-button" aria-hidden="true">▶</span> A place to linger</a></div>
                <div class="hero-signoff"><span class="signoff-line"></span><span>GOOD COFFEE. NO RUSH.</span><span class="signoff-spark">✳</span></div>
            </div>
            <div class="hero-scene" role="img" aria-label="An atmospheric three-dimensional illustration of a warmly lit café terrace">
                <div class="scene-glow"></div>
                <div class="scene-floor"></div>
                <div class="scene-wall scene-wall-back"></div>
                <div class="scene-window"><span class="window-pane pane-one"></span><span class="window-pane pane-two"></span><span class="window-pane pane-three"></span><span class="window-pane pane-four"></span><span class="window-glow"></span></div>
                <div class="scene-awning"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                <div class="scene-sign">CAFÉ <b>LUMIÈRE</b><small>COFFEE · BRUNCH · COMPANY</small></div>
                <div class="scene-counter"><span class="counter-top"></span><span class="counter-front"></span><span class="counter-detail"></span></div>
                <div class="scene-machine"><span class="machine-top"></span><span class="machine-body"></span><span class="machine-group"></span><span class="machine-cup"></span></div>
                <div class="scene-pastries"><span></span><span></span><span></span></div>
                <div class="scene-plant plant-left"><span></span><span></span><span></span><i></i></div>
                <div class="scene-plant plant-right"><span></span><span></span><span></span><i></i></div>
                <div class="scene-table"><span class="table-top"></span><span class="table-leg"></span><span class="table-cup"></span></div>
                <div class="scene-chair"><span></span><i></i><b></b></div>
                <div class="scene-caption"><span>01 / 03</span><span>THE ART OF TAKING YOUR TIME</span><span class="caption-star">✳</span></div>
                <div class="scene-stamp"><span>MADE FOR</span><b>YOUR<br>MOMENT</b><span>EST. WITH LOVE</span></div>
            </div>
            <a class="scroll-cue" href="#experience"><span></span> SCROLL A LITTLE</a>
            <div class="hero-edge-note" aria-hidden="true">A GOOD DAY STARTS HERE · A GOOD DAY STARTS HERE ·</div>
        </section>

        <section class="experience-strip" id="experience" aria-label="The Café Lumière experience">
            <div><span class="strip-icon">✳</span><span>Thoughtfully brewed</span></div><span class="strip-divider"></span>
            <div><span class="strip-icon">♧</span><span>Made for slow mornings</span></div><span class="strip-divider"></span>
            <div><span class="strip-icon">♡</span><span>Better together</span></div>
        </section>

        <section class="menu-section section-wrap" id="menu">
            <div class="section-heading">
                <div><div class="eyebrow"><span></span> SOMETHING GOOD IS WAITING</div><h2>A menu for<br><em>every mood.</em></h2></div>
                <div class="heading-aside"><p>From the first sip to the last little bite, everything is an invitation to slow down and stay a while.</p><span>MADE FRESH, MADE WITH CARE</span></div>
            </div>
            <div class="menu-toolbar">
                <div class="category-list" role="group" aria-label="Filter menu by category">
                    @foreach (config('cafe.categories') as $slug => $name)
                        <button class="category-chip{{ $slug === 'all' ? ' is-active' : '' }}" type="button" data-category="{{ $slug }}" aria-pressed="{{ $slug === 'all' ? 'true' : 'false' }}">{{ $name }}</button>
                    @endforeach
                </div>
                <button class="basket-button" type="button" data-open-cart aria-label="Open basket">
                    <span class="basket-icon" aria-hidden="true">＋</span><span>Your basket</span><span class="basket-count" data-cart-count>0</span>
                </button>
            </div>
            <div class="product-grid" data-product-grid>
                @foreach (config('cafe.products') as $product)
                    <article class="product-card" data-product-card data-category="{{ $product['category'] }}">
                        <div class="product-photo">
                            <img src="{{ $product['image'] }}" alt="{{ $product['name'] }}" loading="lazy">
                            <span class="product-tag">{{ $product['tag'] }}</span>
                            <button class="add-button" type="button" data-add-to-cart="{{ $product['id'] }}" aria-label="Add {{ $product['name'] }} to basket">+</button>
                        </div>
                        <div class="product-details">
                            <div class="product-title-row"><h3>{{ $product['name'] }}</h3><strong>Rs. {{ number_format($product['price']) }}</strong></div>
                            <p>{{ $product['description'] }}</p>
                            <span class="product-category">{{ config('cafe.categories')[$product['category']] }}</span>
                        </div>
                    </article>
                @endforeach
            </div>
            <p class="menu-disclaimer">Sample menu and prices are indicative and may be updated by the café.</p>
        </section>

        <section class="story-section" id="story">
            <div class="story-image">
                <img class="owner-photo" src="{{ asset('images/umair-akbar.png') }}" alt="Umair Akbar, owner of Café Lumière" loading="lazy">
                <div class="story-image-overlay"></div>
                <div class="story-photo-caption"><span>THE FOUNDER</span><span>ALWAYS MADE WITH HEART</span></div>
            </div>
            <div class="story-copy">
                <div class="eyebrow"><span></span> MEET THE FOUNDER</div>
                <h2 class="owner-name">{{ config('cafe.owner') }}</h2>
                <p class="owner-title">FOUNDER & OWNER, CAFÉ LUMIÈRE</p>
                <p>Somewhere between that first sip and the conversation that runs long, an ordinary day turns into a lovely one. That's the little bit of magic we're here for.</p>
                <p>Come as you are. Stay for one more.</p>
                <a class="text-link" href="#visit">Come say hello <span aria-hidden="true">↗</span></a>
            </div>
        </section>

        <section class="visit-section" id="visit">
            <div class="visit-decoration" aria-hidden="true">L.</div>
            <div class="eyebrow"><span></span> LET'S MAKE IT A LOVELY DAY</div>
            <h2>Your favourite<br>table is <em>calling.</em></h2>
            <p>For menu questions, delivery or pickup availability, or a little help planning your visit, get in touch. We’d love to hear from you.</p>
            <div class="visit-actions"><a class="button button-cream" href="tel:+{{ config('cafe.whatsapp') }}">Call {{ config('cafe.phone') }} <span aria-hidden="true">↗</span></a><a class="button button-ghost" href="https://wa.me/{{ config('cafe.whatsapp') }}?text={{ rawurlencode('Hello Café Lumière! I would like to ask about the menu.') }}" target="_blank" rel="noreferrer">Chat on WhatsApp <span aria-hidden="true">↗</span></a><a class="reservation-link" href="https://wa.me/{{ config('cafe.whatsapp') }}?text={{ rawurlencode('Hello Café Lumière! I would like to ask about making a table reservation. Please let me know what details you need.') }}" target="_blank" rel="noreferrer">Ask about a table reservation <span aria-hidden="true">↗</span></a></div>
            <div class="visit-note"><span>✳</span> DELIVERY AVAILABILITY, CHARGES & PAYMENT OPTIONS CONFIRMED WHEN YOU ORDER</div>
        </section>
    </main>

    <footer class="site-footer">
        <a class="brand footer-brand" href="#home" aria-label="Café Lumière home"><span class="brand-symbol" aria-hidden="true">L<span>.</span></span><span class="brand-wordmark">CAFÉ <b>LUMIÈRE</b><small>INTERNATIONAL COFFEE & DINING</small></span></a>
        <p>Good coffee. No rush.</p>
        <a href="tel:+{{ config('cafe.whatsapp') }}">{{ config('cafe.phone') }}</a>
        <span class="footer-note">MADE WITH CARE <span aria-hidden="true">♡</span></span>
    </footer>

    <div class="cart-backdrop" data-cart-backdrop hidden></div>
    <aside class="cart-drawer" data-cart-drawer aria-labelledby="cart-title" aria-hidden="true" inert>
        <div class="cart-header"><div><span class="eyebrow"><span></span> THE GOOD STUFF</span><h2 id="cart-title">Your basket</h2></div><button class="cart-close" type="button" data-close-cart aria-label="Close basket">×</button></div>
        <p class="cart-empty" data-cart-empty>Your basket is waiting for something lovely.</p>
        <div class="cart-items" data-cart-items></div>
        <div class="cart-footer" data-cart-footer hidden>
            <div class="cart-subtotal"><span>Subtotal</span><strong data-cart-total>Rs. 0</strong></div>
            <div class="order-options">
                <label for="order-method">How would you like your order?</label>
                <select id="order-method" data-order-method><option value="pickup">Café pickup</option><option value="delivery">Ask about home delivery</option></select>
                <label data-delivery-address hidden for="delivery-address">Delivery address
                    <textarea id="delivery-address" data-order-address rows="2" placeholder="Enter your delivery address"></textarea>
                </label>
            </div>
            <p class="checkout-error" data-checkout-error role="alert" hidden>Please enter a delivery address to continue.</p>
            <p>Delivery availability, any fee, and payment options are confirmed directly with the café.</p>
            <a class="button button-gold checkout-link" data-checkout-link href="https://wa.me/{{ config('cafe.whatsapp') }}" target="_blank" rel="noreferrer">Continue on WhatsApp <span aria-hidden="true">↗</span></a>
        </div>
    </aside>
    <script id="product-catalog" type="application/json">@json(config('cafe.products'))</script>
</body>
</html>
