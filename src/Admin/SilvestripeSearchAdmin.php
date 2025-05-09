<?php

namespace SilverstripeSearch\Admin;

use Http\Client\Exception\HttpException;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Forager\Interfaces\IndexingInterface;
use SilverStripe\Forager\Service\IndexConfiguration;
use SilverStripe\Discoverer\Service\SearchService;
use SilverStripe\Forager\Service\Query\SynonymRule as QuerySynonymRule;
use SilverStripe\Forager\Service\Results\SynonymRule;
use SilverStripe\Forager\Service\SynonymService;
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
        'engines',
        'getSynonyms',
        'createSynonymRule',
        'deleteSynonymRule',
        'updateSynonymRule',
    ];

    private static $url_handlers = [
        'GET api/v1/pilets' => 'pilets',
        'GET api/v1/engines' => 'engines',
        'GET api/v1/synonyms' => 'getSynonyms',
        'POST api/v1/$Engine/synonyms' => 'createSynonymRule',
        'DELETE api/v1/$Engine/synonyms/$ID' => 'deleteSynonymRule',
        'PATCH api/v1/$Engine/synonyms/$ID' => 'updateSynonymRule',
    ];

    private static array $pilets = [];

    public function pilets(HTTPRequest $request)
    {

        $piletConfig = $this->config()->get('pilets');
        $apiBase = Director::absoluteURL($this->Link()) . '/api/v1';

        $piletConfig = array_map(function ($pilet) use ($apiBase) {
            if (array_key_exists('link', $pilet)) {
                // resolve any silverstripe location references
                $pilet['link'] = ModuleResourceLoader::singleton()->resolveURL($pilet['link']);
            }

            // add url of controller for api requests
            if (array_key_exists('config', $pilet)) {
                $pilet['config']['apiBase'] = $apiBase;
            } else {
                $pilet['config'] = [
                    'apiBase' => $apiBase,
                ];
            }

            return $pilet;
        }, $piletConfig);

        $response = new stdClass();
        $response->items = $piletConfig;

        return json_encode($response);
    }

    public function engines(HTTPRequest $request): string
    {
        $config = IndexConfiguration::singleton();
        $engines = $config->getIndexes();

        /** @var IndexingInterface $indexService */
        $indexService = Injector::inst()->get(IndexingInterface::class);

        $output = [];
        foreach ($engines as $name => $configuration) {

            $indexName = $indexService->environmentizeIndex($name);
            $output []= $indexName;
        }

        return json_encode($output);
    }

    public function getSynonyms(HTTPRequest $request): string
    {
        $engine = $request->getVar('engine');
        $service = SynonymService::singleton();

        $rules = $service->getSynonymRules($engine);

        return json_encode($rules->toArray());
    }

    public function createSynonymRule(HTTPRequest $request): string
    {
        $engine = $request->param('Engine');
        $data = json_decode($request->getBody());

        $synonyms = $data->synonyms ?? [];
        $type = $data->type ?? [];
        $root = $data->root ?? [];

        if (empty($synonyms)) {
            return $this->jsonError(422, 'synonyms cannot be empty');
        }

        if (!in_array($type, [SynonymRule::TYPE_EQUIVALENT, SynonymRule::TYPE_DIRECTIONAL])) {
            $error = 'type must be one of "TYPE_EQUIVALENT" or "TYPE_DIRECTIONAL"';
            return $this->jsonError(422, $error);
        }

        $service = SynonymService::singleton();
        $rule = new QuerySynonymRule($type);
        $rule->setSynonyms($synonyms);
        if ($type === SynonymRule::TYPE_DIRECTIONAL) {
            if (empty($root)) {
                return $this->jsonError(422, "Missing root for directional synonym");
            }

            $rule->setRoot($root);
        }

        $id = $service->createSynonymRule($engine, $rule);

        $outputRule = new SynonymRule($id);
        $outputRule->setType($type);
        $outputRule->setSynonyms($synonyms);
        $outputRule->setRoot($root);


        return json_encode($outputRule);
    }

    public function updateSynonymRule(HTTPRequest $request): string
    {
        $engine = $request->param('Engine');
        $id = $request->param('ID');
        $data = json_decode($request->getBody());

        $synonyms = $data->synonyms ?? [];
        $type = $data->type ?? [];
        $root = $data->root ?? [];

        if (!$id) {
            return $this->jsonError(422, 'Must provide an ID');
        }

        if (empty($synonyms)) {
            return $this->jsonError(422, 'synonyms cannot be empty');
        }

        if (!in_array($type, [SynonymRule::TYPE_EQUIVALENT, SynonymRule::TYPE_DIRECTIONAL])) {
            $error = 'type must be one of "TYPE_EQUIVALENT" or "TYPE_DIRECTIONAL"';
            return $this->jsonError(422, $error);
        }

        $service = SynonymService::singleton();
        $rule = new QuerySynonymRule($type);
        $rule->setSynonyms($synonyms);
        if ($type === SynonymRule::TYPE_DIRECTIONAL) {
            if (empty($root)) {
                return $this->jsonError(422, "Missing root for directional synonym");
            }

            $rule->setRoot($root);
        }

        $service->updateSynonymRule($engine, $id, $rule);

        $outputRule = new SynonymRule($id);
        $outputRule->setType($type);
        $outputRule->setSynonyms($synonyms);
        $outputRule->setRoot($root);


        return json_encode($outputRule);
    }

    public function deleteSynonymRule(HTTPRequest $request): string
    {
        $engine = $request->param('Engine');
        $id = $request->param('ID');

        if (!$id) {
            return $this->jsonError(400, 'Missing ID');
        }

        $service = SynonymService::singleton();
        $service->deleteSynonymRule($engine, $id);

        return json_encode([
            'status' => 'success'
        ]);
    }
}
