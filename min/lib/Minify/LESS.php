<?php
require_once 'Minify/CSS.php';
class Minify_LESS extends Minify_CSS {
    public static function minify($css, $options = array()) {
        require_once 'lessphp/lessc.inc.php';
        $lessc = new lessc();
        return parent::minify($lessc->parse($css), $options);
    }
}

?>