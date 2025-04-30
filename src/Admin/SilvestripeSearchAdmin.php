<?php

namespace SilverstripeSearch\Admin;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Control\HTTPRequest;
use stdClass;

class SilvestripeSearchAdmin extends LeftAndMain
{
    private static $url_segment = "silverstripesearch";
    private static $menu_title  = "Silverstripe Search Admin";

    private static $extra_requirements_javascript = [
        'silverstripe/silverstripe-bifrost-admin:client/base/dist/release/main.js',
    ];

    private static $extra_requirements_css = [
        'silverstripe/silverstripe-bifrost-admin:client/base/dist/release/style.css',
    ];

    private static array $allowed_actions = [
        'pilets',
    ];

    private static array $pilets = [];

    public function pilets(HTTPRequest $request)
    {
        $response = new stdClass();
        $response->items = $this->config()->get('pilets');

        return json_encode($response);
    }
}
