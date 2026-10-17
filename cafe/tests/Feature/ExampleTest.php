<?php

test('the café homepage shows the brand, owner, contact number and menu', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('Café Lumière')
        ->assertSee('Umair Akbar')
        ->assertSee('03068778018')
        ->assertSee('Cappuccino')
        ->assertSee('data-product-grid', false);
});

test('the removed standalone café pages are not exposed', function () {
    foreach (['/menu', '/menu/coffee', '/delivery', '/cart', '/checkout', '/about', '/contact'] as $url) {
        $this->get($url)->assertNotFound();
    }
});
