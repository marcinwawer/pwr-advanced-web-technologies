<?php
/*
Plugin Name: Random Announcement CPT
Description: Wyświetla losowe ogłoszenie przed treścią posta
Version: 1.1
*/

// Rejestracja CPT
add_action('init', 'myplugin_rap_register_cpt');
function myplugin_rap_register_cpt() {
    register_post_type('ogloszenie', [
        'label' => 'Ogłoszenia',
        'public' => true,
        'menu_icon' => 'dashicons-megaphone',
        'supports' => ['title', 'editor', 'custom-fields'],
    ]);
}

// Dodaj instrukcję nad edytorem posta (tylko dla CPT "ogloszenie")
add_action('edit_form_after_title', 'myplugin_advertisement_instruction');
function myplugin_advertisement_instruction($post) {
    if ($post->post_type == 'ogloszenie') {
        echo '<div style="background: #fffbcc; padding: 10px; border: 1px solid #f2e086; margin-bottom: 10px;">
            <strong>📢 Wpisz treść reklamy w HTML-u poniżej:</strong><br>
            <em>Przełącz się na zakładkę "Tekst" edytora, aby poprawnie wkleić kod HTML reklamy.</em><br>
            <strong>🔗 Opcjonalnie: Dodaj pole meta "link" do reklamy, aby dodać odnośnik do strony.</strong>
        </div>';
    }
}

// Funkcja dodająca reklamę do treści posta
function myplugin_rap_display_random_ad($content) {
    if ((is_single() || is_home()) && !is_admin()) {
        $ads = get_posts([
            'post_type'   => 'ogloszenie',
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
                $link_html = "<p class='ad-link'><a href='{$link}' target='_blank' rel='nofollow'>Więcej informacji</a></p>";
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

// Dodaj style dla linku w ogłoszeniu
add_action('wp_head', function() {
    echo '<style>
        .ad-link {
            font-size: 12px;
            font-style: italic;
            text-decoration: underline;
            margin-top: 5px;
        }
    </style>';
});