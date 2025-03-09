<?php
/*
Plugin Name: Random Announcement CPT
Description: Wyświetla losowe ogłoszenie przed treścią posta
Version: 1.0
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
            <em>Przełącz się na zakładkę "Tekst" edytora, aby poprawnie wkleić kod HTML reklamy.</em>
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

            // Dostępne style CSS
            $allowed_styles = ['low', 'medium', 'high'];
            if (!in_array($style, $allowed_styles)) {
                $style = 'low'; // domyślny styl
            }

            // Rejestruj plik CSS - upewnij się, że ścieżka jest poprawna
            wp_enqueue_style(
                'random-ad-styles',
                plugins_url('css/style.css', __FILE__)
            );

            // Pobierz treść reklamy i przypisz klasę CSS
            $ad_content = html_entity_decode($ad->post_content);

            return "<div class='random-ad {$style}-ad'>{$ad_content}</div>" . $content;
        }
    }
    return $content;
}

// Dodaj filtr do treści posta
add_filter('the_content', 'myplugin_rap_display_random_ad');