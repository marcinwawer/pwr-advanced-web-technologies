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
add_action('init', 'plugin_raasmw_register_cpt');
function plugin_raasmw_register_cpt() {
    register_post_type('ads', [
        'label' => 'Advertisements',
        'public' => true,
        'menu_icon' => 'dashicons-star-empty',
        'supports' => ['title', 'editor', 'custom-fields'],
    ]);
}

// Dodaj instrukcję nad edytorem posta (tylko dla CPT "ads")
add_action('edit_form_after_title', 'plugin_raasmw_instruction');
function plugin_raasmw_instruction($post) {
    if ($post->post_type == 'ads') {
        echo '<div style="background: #fffbcc; padding: 10px; border: 1px solid #f2e086; margin-bottom: 10px;">
            <strong>📢 Enter your advertisement content below 📢</strong><br>
            <em>Switch to the "Text" tab in the editor if you want to create your ad using HTML.</em><br><br>
            <strong>❗️ Required: Choose Ad Schedule for your ad on the right of the website, otherwise your ad will not be displayed.</strong><br><br>
            <strong>🔗 Optional: Add the "link" custom field to include a URL to your advertisement.</strong><br><br>
            <strong>🔗 Optional: Add the "style" custom field to select a display style.</strong><br>
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

// Dodanie Meta Boxa do CPT "ads"
function plugin_add_ad_schedule_metabox() {
    add_meta_box(
        'ad_schedule',
        'Ad Schedule',
        'myplugin_ad_schedule_metabox_callback',
        'ads',
        'side'
    );
}
add_action('add_meta_boxes', 'plugin_add_ad_schedule_metabox');

// Callback do wyświetlenia Meta Boxa
function myplugin_ad_schedule_metabox_callback($post) {
    $start_date = get_post_meta($post->ID, '_ad_start_date', true);
    $end_date = get_post_meta($post->ID, '_ad_end_date', true);
    
    wp_nonce_field('plugin_save_ad_schedule', 'plugin_ad_schedule_nonce');
    ?>
    <label for="ad_start_date">Start Date:</label>
    <input type="date" id="ad_start_date" name="ad_start_date" value="<?php echo esc_attr($start_date); ?>"><br><br>
    <label for="ad_end_date">End Date:</label>
    <input type="date" id="ad_end_date" name="ad_end_date" value="<?php echo esc_attr($end_date); ?>">
    <?php
}

// Zapisujemy wartości Meta Boxa
function plugin_save_ad_schedule($post_id) {
    if (!isset($_POST['plugin_ad_schedule_nonce']) || !wp_verify_nonce($_POST['plugin_ad_schedule_nonce'], 'plugin_save_ad_schedule')) {
        return;
    }

    if (isset($_POST['ad_start_date'])) {
        update_post_meta($post_id, '_ad_start_date', sanitize_text_field($_POST['ad_start_date']));
    }
    if (isset($_POST['ad_end_date'])) {
        update_post_meta($post_id, '_ad_end_date', sanitize_text_field($_POST['ad_end_date']));
    }
}
add_action('save_post', 'plugin_save_ad_schedule');

// Funkcja dodająca reklamę do treści posta
function plugin_raasmw_display_random_ad($content) {
    if ((is_single() || is_home()) && !is_admin()) {
        $today = date('Y-m-d');

        $ads = get_posts([
            'post_type'   => 'ads',
            'orderby'     => 'rand',
            'numberposts' => 1,
            'meta_query'  => [
                'relation' => 'AND',
                [
                    'key'     => '_ad_start_date',
                    'value'   => $today,
                    'compare' => '<=',
                    'type'    => 'DATE',
                ],
                [
                    'key'     => '_ad_end_date',
                    'value'   => $today,
                    'compare' => '>=',
                    'type'    => 'DATE',
                ],
            ],
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
add_filter('the_content', 'plugin_raasmw_display_random_ad');