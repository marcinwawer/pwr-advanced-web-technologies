<?php
/**
* Plugin Name: Random Ads
* Plugin URI: https://www.google.com/
* Description: Easily add random ads to your posts.
* Version: 1.0
* Requires at least: 5.0
* Requires PHP: 7.2
* Author: Aleksander Szczepanowsi & Marcin Wawer
* Author URI: https://www.google.com/
**/

// Rejestracja CPT
add_action('init', 'myplugin_rap_register_cpt');
function myplugin_rap_register_cpt() {
    register_post_type('ads', [
        'label' => 'Advertisements',
        'public' => true,
        'menu_icon' => 'dashicons-star-empty',
        'supports' => ['title', 'editor', 'custom-fields'],
    ]);
}

// Dodaj instrukcję nad edytorem posta (tylko dla CPT "ads")
add_action('edit_form_after_title', 'myplugin_advertisement_instruction');
function myplugin_advertisement_instruction($post) {
    if ($post->post_type == 'ads') {
        echo '<div style="background: #fffbcc; padding: 10px; border: 1px solid #f2e086; margin-bottom: 10px;">
            <strong>📢 Enter your advertisement content below 📢</strong><br>
            <em>Switch to the "Text" tab in the editor if you want to create your ad using HTML.</em><br><br>
            <strong>🔗 Optional: Add the "link" meta field to include a URL to your advertisement.</strong><br><br>
            <strong>🔗 Optional: Add the "style" meta field to select a display style.</strong><br>
            <span>🎨 Available styles: </span>
            <ul style="margin-top: 5px; padding-left: 20px;">
                <li style="color: green;"><strong>📉 low</strong> - subtle highlight → price: $1000</li>
                <li style="color: orange;"><strong>📊 medium</strong> - moderate highlight → price: $5000</li>
                <li style="color: red;"><strong>📈 high</strong> - strong highlight → price: $10000</li>
                <li style="color: darkred;"><strong>🚨 critical</strong> - very important advertisement → price: $50000</li>
            </ul>
            <small>If you do not see custom fields, you need to click Screen Options in upper-right corner and check Custom Fields checkbox :)</small>
        </div>';
    }
}

// Funkcja dodająca reklamę do treści posta
function myplugin_rap_display_random_ad($content) {
    if ((is_single() || is_home()) && !is_admin()) {
        $ads = get_posts([
            'post_type'   => 'ads',
            'orderby'     => 'rand',
            'numberposts' => 1,
        ]);

        if (!empty($ads)) {
            $ad = $ads[0];

            // Pobierz styl z pola meta ('low', 'medium', 'high')
            $style = get_post_meta($ad->ID, 'style', true);
            $allowed_styles = ['low', 'medium', 'high'];
            if (!in_array($style, $allowed_styles)) {
                $style = 'low'; // domyślny styl
            }

            // Pobierz link z pola meta
            $link = get_post_meta($ad->ID, 'link', true);
            $link_html = '';

            // Sprawdź, czy link istnieje i czy jest poprawnym URL-em
            if (!empty($link) && filter_var($link, FILTER_VALIDATE_URL)) {
                $link_html = "<p class='ad-link'><a href='{$link}' target='_blank' rel='nofollow'>Learn more...</a></p>";
            }

            // Rejestruj plik CSS
            wp_enqueue_style(
                'random-ad-styles',
                plugins_url('css/style.css', __FILE__)
            );

            // Pobierz treść reklamy i przypisz klasę CSS
            $ad_content = html_entity_decode($ad->post_content);

            return "<div class='random-ad {$style}-ad'>{$ad_content}{$link_html}</div>" . $content;
        }
    }
    return $content;
}

// Dodaj filtr do treści posta
add_filter('the_content', 'myplugin_rap_display_random_ad');