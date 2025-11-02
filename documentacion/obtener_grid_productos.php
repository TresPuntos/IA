function obtener_grid_productos($id_productos) {

    $current_lang = pll_current_language();

    if($current_lang == 'es'){
        $current_lang_code = 1;
    }else if($current_lang == 'it'){
        $current_lang_code = 3;
    }else if($current_lang == 'fr'){
        $current_lang_code = 4;
    }else if($current_lang == 'de'){
        $current_lang_code = 5;
    }else{
        $current_lang_code = 2;
    }

    $ids_array = explode(',', $id_productos);

    // Configuración de la API de PrestaShop
    define('API_KEY', 'E5CUG6DLAD9EA46AIN7Z2LIX1W3IIJKZ');
    define('PRESTASHOP_URL', 'https://100x100chef.com/shop/api/');
    define('BASE_URL', 'https://100x100chef.com/shop/'); // URL base de la tienda

    $productos = [];

    foreach ($ids_array as $id_producto) {
        $id_producto = trim($id_producto);

        // Endpoint de la API para obtener el producto
        $url = PRESTASHOP_URL . "products/$id_producto?language=$current_lang_code&output_format=JSON&ws_key=" . API_KEY;

        // Solicitud con wp_remote_get
        $args = [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode(API_KEY . ':'),
            ],
        ];

        $response = wp_remote_get($url, $args);

        if (is_wp_error($response)) {
            continue;
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (isset($data['product'])) {
            $product = $data['product'];

            // Nombre
            $name = is_array($product['name']) ? $product['name'][0]['value'] : $product['name'];

            // link_rewrite
            $link_rewrite = is_array($product['link_rewrite']) ? $product['link_rewrite'][0]['value'] : $product['link_rewrite'];

            // Imagen
            $image_id = $product['id_default_image'];
            $image_type = 'medium_default';
            $image_url = BASE_URL . "{$image_id}-{$image_type}/{$link_rewrite}.jpg";

            // ean13
            $ean13 = isset($product['ean13']) ? $product['ean13'] : '';

            // Categoría fija
            $category_path = 'inicio';

            // URL del producto
            $link = BASE_URL . "{$category_path}/{$product['id']}-{$link_rewrite}";
            if (!empty($ean13)) {
                $link .= "-{$ean13}";
            }
            $link .= ".html";

            // Descripción corta
            $description_short = '';
            if (isset($product['description_short'])) {
                if (is_array($product['description_short']) && isset($product['description_short'][0]['value'])) {
                    $description_short = $product['description_short'][0]['value'];
                } elseif (is_string($product['description_short'])) {
                    $description_short = $product['description_short'];
                }
            }

            // Almacenar datos
            $productos[] = [
                'id' => $product['id'],
                'name' => $name,
                'image' => $image_url,
                'link' => $link,
                'description' => $description_short
            ];
        }
    }

    return $productos;
}