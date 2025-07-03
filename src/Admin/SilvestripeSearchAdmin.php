<?php

namespace SilverstripeSearch\Admin;

use Elastic\EnterpriseSearch\Exception\ClientErrorResponseException;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Forager\Interfaces\IndexingInterface;
use SilverStripe\Forager\Service\Query\SynonymRule as QuerySynonymRule;
use SilverStripe\Forager\Service\Results\SynonymRule;
use SilverStripe\Forager\Service\SynonymService;
use SilverStripe\ForagerBifrost\Service\BifrostService;
use SilverStripe\ForagerBifrost\Service\Requests\GetSchema;
use SilverStripe\ForagerBifrost\Service\Requests\PostEngines;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use stdClass;
use Throwable;

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

        try {
            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $request = new PostEngines();
            $response = $indexService->getClient()->appSearch()->listEngines($request)->asArray();

            $results = $response['results'] ?? null;

            if (!$results) {
                return $this->jsonError(403, "No engines are available to these credentials");
            }

            foreach ($results as $engineObject) {
                $engine = new stdClass();
                $engine->name = $engineObject['name'];

                $engineSuffix = explode('-', $engine->name);
                $engineSuffix = end($engineSuffix);

                $engine->totalDocs = $indexService->getDocumentTotal($engineSuffix);

                $output [] = $engine;
            }
        } catch (ClientErrorResponseException $e) {
            return $this->jsonError($e->getCode(), (string) $e->getResponse()->getBody());
        } catch (Throwable $e) {
            return $this->jsonError($e->getCode(), $e->getMessage());
        }

        return json_encode($output);
    }

    public function getSchema(HTTPRequest $request): string
    {
        if ($this->viewCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

        $output = new stdClass();

        $fullIndexName = $request->getVar('engine');

        if (!$fullIndexName) {
            return json_encode($output);
        }

        try {
            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $request = new GetSchema($fullIndexName);
            $response = $indexService->getClient()->appSearch()->getSchema($request)->asArray();
            ksort($response);

            foreach ($response as $fieldName => $fieldType) {
                $output->{$fieldName} = $fieldType;
            }
        } catch (ClientErrorResponseException $e) {
            return $this->jsonError($e->getCode(), (string) $e->getResponse()->getBody());
        } catch (Throwable $e) {
            return $this->jsonError($e->getCode(), $e->getMessage());
        }

        return json_encode($output);
    }

    public function getSynonyms(HTTPRequest $request): string
    {
        if ($this->viewCheck()) {
            return $this->jsonError(403, "You do not have permission for this endpoint");
        }

        $engine = $request->getVar('engine');
        $service = SynonymService::singleton();

        try {
            $rules = $service->getSynonymRules($engine);
        } catch (ClientErrorResponseException $e) {
            return $this->jsonError($e->getCode(), (string) $e->getResponse()->getBody());
        } catch (Throwable $e) {
            return $this->jsonError($e->getCode(), $e->getMessage());
        }

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

        if (!$synonyms) {
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

        try {
            $id = $service->createSynonymRule($engine, $rule);
        } catch (ClientErrorResponseException $e) {
            return $this->jsonError($e->getCode(), (string) $e->getResponse()->getBody());
        } catch (Throwable $e) {
            return $this->jsonError($e->getCode(), $e->getMessage());
        }

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

        try {
            $service->updateSynonymRule($engine, $id, $rule);
        } catch (ClientErrorResponseException $e) {
            return $this->jsonError($e->getCode(), (string) $e->getResponse()->getBody());
        } catch (Throwable $e) {
            return $this->jsonError($e->getCode(), $e->getMessage());
        }

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

        try {
            $service->deleteSynonymRule($engine, $id);
        } catch (ClientErrorResponseException $e) {
            return $this->jsonError($e->getCode(), (string) $e->getResponse()->getBody());
        } catch (Throwable $e) {
            return $this->jsonError($e->getCode(), $e->getMessage());
        }

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
