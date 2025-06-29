<?php

namespace SilverstripeSearch\Admin;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Forager\Interfaces\IndexingInterface;
use SilverStripe\Forager\Service\IndexConfiguration;
use SilverStripe\Forager\Service\Query\SynonymRule as QuerySynonymRule;
use SilverStripe\Forager\Service\Results\SynonymRule;
use SilverStripe\Forager\Service\SynonymService;
use SilverStripe\ForagerElasticEnterprise\Service\EnterpriseSearchService;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use stdClass;

class SilverstripeSearchAdmin extends LeftAndMain implements PermissionProvider
{
    private static $url_segment = "silverstripesearch";

    private static $menu_title  = "Silverstripe Search";

    private static $menu_icon_class  = "font-icon-search";

    private static $extra_requirements_javascript = [
        'silverstripe/silverstripe-bifrost-admin:client/base/dist/release/main.js',
    ];

    private static $extra_requirements_css = [
        'silverstripe/silverstripe-bifrost-admin:client/base/dist/release/style.css',
        'silverstripe/silverstripe-bifrost-admin:client/base/dist/release/main.css',
        'silverstripe/silverstripe-bifrost-admin:client/base/dist/release/main.css',
    ];

    private static array $allowed_actions = [
        'pilets',
        'engines',
        'getSynonyms',
        'createSynonymRule',
        'deleteSynonymRule',
        'updateSynonymRule',
        'getSchema',
    ];

    private static $url_handlers = [
        'GET api/v1/pilets' => 'pilets',
        'GET api/v1/engines' => 'engines',
        'GET api/v1/synonyms' => 'getSynonyms',
        'POST api/v1/$Engine/synonyms' => 'createSynonymRule',
        'DELETE api/v1/$Engine/synonyms/$ID' => 'deleteSynonymRule',
        'PATCH api/v1/$Engine/synonyms/$ID' => 'updateSynonymRule',
        'GET api/v1/schema' => 'getSchema',
    ];

    private static array $pilets = [];

    private static string $required_permission_codes = SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_PERMISSION_ACCESS;

    public const SILVERSTRIPE_SEARCH_VIEW_SYNONYMS = 'SILVERSTRIPE_SEARCH_VIEW_SYNONYMS';
    public const SILVERSTRIPE_SEARCH_EDIT_SYNONYMS = 'SILVERSTRIPE_SEARCH_EDIT_SYNONYMS';
    public const SILVERSTRIPE_SEARCH_PERMISSION_ACCESS = 'CMS_ACCESS_SilverstripeSearchAdmin';


    public function providePermissions()
    {
        return [
            SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_VIEW_SYNONYMS => [
                'name' => 'View synonyms',
                'category' => 'Silverstripe Search',
            ],
            SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_EDIT_SYNONYMS => [
                'name' => 'Edit synonyms',
                'category' => 'Silverstripe Search',
            ],
            SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_PERMISSION_ACCESS => [
                'name' => _t(
                    CMSMain::class . '.ACCESS',
                    "Access to '{title}' section",
                    ['title' => $this->menu_title()]
                ),
                'category' => _t(Permission::class . '.CMS_ACCESS_CATEGORY', 'CMS Access'),
                'help' => _t(
                    SilverstripeSearchAdmin::class . '.ACCESS_HELP',
                    'Allow viewing of search configuration and status, and links to external resources.'
                ),
            ],
        ];
    }

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
        if ($this->viewCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

        $config = IndexConfiguration::singleton();
        $engines = $config->getIndexes();

        /** @var IndexingInterface $indexService */
        $indexService = Injector::inst()->get(IndexingInterface::class);

        $output = [];
        foreach ($engines as $name => $configuration) {
            $indexName = $indexService->environmentizeIndex($name);
            $totalDocs = $indexService->getDocumentTotal($name);
            $engine = new stdClass();
            $engine->name = $indexName;
            $engine->totalDocs = $totalDocs;

            $output [] = $engine;
        }

        return json_encode($output);
    }

    public function getSchema(HTTPRequest $request): string
    {
        if ($this->viewCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }
        $output = new stdClass();

        $fullIndexName = $request->getVar('index');

        if (!$fullIndexName) {
            return json_encode($output);
        }
        $variant = IndexConfiguration::singleton()->getIndexVariant();
        $prefix = sprintf('%s-', $variant);
        $indexName = str_replace($prefix, '', $fullIndexName);

        if (!array_key_exists($indexName, IndexConfiguration::singleton()->getIndexes())) {
            return $this->jsonError(400, "Can't find index");
        }

        /** @var EnterpriseSearchService $indexService */
        $indexService = Injector::inst()->get(IndexingInterface::class);

        $fields = $indexService->getConfiguration()->getFieldsForIndex($indexName);

        foreach ($fields as $field) {
            $explicitFieldType = $field->getOption('type') ?? $indexService->config()->get('default_field_type');
            $output->{$field->getSearchFieldName()} = $explicitFieldType;
        }
        // Fetch the Schema, as it is currently configured in our application
        return json_encode($output);
    }

    public function getSynonyms(HTTPRequest $request): string
    {
        if ($this->viewCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

        $engine = $request->getVar('engine');
        $service = SynonymService::singleton();

        $rules = $service->getSynonymRules($engine);

        return json_encode($rules->toArray());
    }

    public function createSynonymRule(HTTPRequest $request): string
    {
        if ($this->editCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

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
        if ($this->editCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

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
        if ($this->editCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

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

    private function viewCheck(): bool
    {
        return !Permission::check(SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_VIEW_SYNONYMS);
    }

    private function editCheck(): bool
    {
        return !Permission::check(SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_EDIT_SYNONYMS);
    }
}
