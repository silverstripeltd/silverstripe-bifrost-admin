<?php

namespace SilverstripeSearch\Admin;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Forager\Interfaces\IndexingInterface;
use SilverStripe\Forager\Service\IndexConfiguration;
use SilverStripe\Forager\Service\Query\SynonymRule as QuerySynonymRule;
use SilverStripe\Forager\Service\Results\SynonymRule;
use SilverStripe\ForagerBifrost\Processors\SynonymRuleProcessor;
use SilverStripe\ForagerBifrost\Service\BifrostService;
use Silverstripe\Search\Client\Request\Engine\SynonymRuleRequest as ClientSynonymRuleRequest;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use Throwable;

class SilverstripeSearchAdmin extends LeftAndMain implements PermissionProvider
{

    private static string $url_segment = 'silverstripesearch';

    private static string $menu_title = 'Silverstripe Search';

    private static string $menu_icon_class = 'font-icon-search';

    private static array $extra_requirements_javascript = [
        'silverstripeltd/silverstripe-bifrost-admin:client/base/dist/release/main.js',
    ];

    private static array $extra_requirements_css = [
        'silverstripeltd/silverstripe-bifrost-admin:client/base/dist/release/style.css',
        'silverstripeltd/silverstripe-bifrost-admin:client/base/dist/release/main.css',
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

    private static array $url_handlers = [
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

    public const string SILVERSTRIPE_SEARCH_VIEW_SYNONYMS = 'SILVERSTRIPE_SEARCH_VIEW_SYNONYMS';
    public const string SILVERSTRIPE_SEARCH_EDIT_SYNONYMS = 'SILVERSTRIPE_SEARCH_EDIT_SYNONYMS';
    public const string SILVERSTRIPE_SEARCH_PERMISSION_ACCESS = 'CMS_ACCESS_SilverstripeSearchAdmin';

    public function providePermissions(): array
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

    public function pilets(HTTPRequest $request): string
    {
        $piletConfig = $this->config()->get('pilets');
        $apiBase = Director::absoluteURL($this->Link()) . 'api/v1';

        $piletConfig = array_map(static function ($pilet) use ($apiBase) {
            if (array_key_exists('link', $pilet)) {
                // resolve any silverstripe location references
                $pilet['link'] = Director::absoluteURL(ModuleResourceLoader::singleton()->resolveURL($pilet['link']));
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

        $response = new \stdClass();
        $response->items = $piletConfig;

        return json_encode($response);
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function engines(HTTPRequest $request): string
    {
        try {
            if ($this->viewCheck()) {
                $this->jsonError(403, 'You do not have permission for this endpoint');
            }

            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $response = $indexService->getClient()->enginesPost();
            $this->throwJsonErrorForResponse($response);

            $body = $this->decodeJsonResponse($response);
            $results = $body->results ?? null;

            if (!$results) {
                $this->jsonError(403, 'No engines are available to these credentials');
            }

            $output = [];

            foreach ($results as $engineObject) {
                $engine = new \stdClass();
                $engine->name = $engineObject->name;

                $enginePrefix = IndexConfiguration::singleton()->getIndexPrefix();
                $engineSplit = explode(sprintf('%s-', $enginePrefix), $engine->name);
                $engineSuffix = end($engineSplit);

                $engine->totalDocs = $indexService->getDocumentTotal($engineSuffix);

                $output[] = $engine;
            }

            return json_encode($output);
        } catch (HTTPResponse_Exception $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->jsonError(500, $e->getMessage());
        }

        return '';
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function getSchema(HTTPRequest $request): string
    {
        try {
            if ($this->viewCheck()) {
                $this->jsonError(403, 'You do not have permission for this endpoint');
            }

            $output = new \stdClass();

            $fullIndexName = $request->getVar('engine');

            if (!$fullIndexName) {
                return json_encode($output);
            }

            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $response = $indexService->getClient()->schemaGet($fullIndexName);
            $this->throwJsonErrorForResponse($response);

            $schema = $this->decodeJsonResponse($response);

            if ($schema) {
                foreach ($schema as $fieldName => $fieldType) {
                    $output->{$fieldName} = $fieldType;
                }
            }

            return json_encode($output);
        } catch (HTTPResponse_Exception $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->jsonError(500, $e->getMessage());
        }

        return '';
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function getSynonyms(HTTPRequest $request): string
    {
        try {
            if ($this->viewCheck()) {
                $this->jsonError(403, 'You do not have permission for this endpoint');
            }

            $engineName = (string) $request->getVar('engine');
            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $response = $indexService->getClient()->synonymRulesGet($engineName);
            $this->throwJsonErrorForResponse($response);

            $rules = [];
            foreach ($this->decodeJsonResponse($response) ?? [] as $ruleBody) {
                $rules[] = $this->buildSynonymRuleFromBody($ruleBody);
            }

            return json_encode($rules);
        } catch (HTTPResponse_Exception $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->jsonError(500, $e->getMessage());
        }

        return '';
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function createSynonymRule(HTTPRequest $request): string
    {
        try {
            if ($this->editCheck()) {
                $this->jsonError(403, 'You do not have permission for this endpoint');
            }

            $engineName = (string) $request->param('Engine');
            $data = json_decode($request->getBody());

            $synonyms = $data->synonyms ?? [];
            $type = $data->type ?? [];
            $root = $data->root ?? [];

            if (!$synonyms) {
                $this->jsonError(422, 'synonyms cannot be empty');
            }

            if (!in_array($type, [SynonymRule::TYPE_EQUIVALENT, SynonymRule::TYPE_DIRECTIONAL], true)) {
                $error = 'type must be one of "TYPE_EQUIVALENT" or "TYPE_DIRECTIONAL"';

                $this->jsonError(422, $error);
            }

            $rule = new QuerySynonymRule($type);
            $rule->setSynonyms($synonyms);

            if ($type === SynonymRule::TYPE_DIRECTIONAL) {
                if (!$root) {
                    $this->jsonError(422, 'Missing root for directional synonym');
                }

                $rule->setRoot($root);
            }

            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $requestBody = new ClientSynonymRuleRequest(SynonymRuleProcessor::getStringFromQuery($rule));
            $response = $indexService->getClient()->synonymRulePost($engineName, $requestBody);
            $this->throwJsonErrorForResponse($response);

            $outputRule = $this->buildSynonymRuleFromBody($this->decodeJsonResponse($response));

            return json_encode($outputRule);
        } catch (HTTPResponse_Exception $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->jsonError(500, $e->getMessage());
        }

        return '';
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function updateSynonymRule(HTTPRequest $request): string
    {
        try {
            if ($this->editCheck()) {
                $this->jsonError(403, 'You do not have permission for this endpoint');
            }

            $engineName = (string) $request->param('Engine');
            $id = $request->param('ID');
            $data = json_decode($request->getBody());

            $synonyms = $data->synonyms ?? [];
            $type = $data->type ?? [];
            $root = $data->root ?? [];

            if (!$id) {
                $this->jsonError(422, 'Must provide an ID');
            }

            if (!$synonyms) {
                $this->jsonError(422, 'synonyms cannot be empty');
            }

            if (!in_array($type, [SynonymRule::TYPE_EQUIVALENT, SynonymRule::TYPE_DIRECTIONAL], true)) {
                $error = 'type must be one of "TYPE_EQUIVALENT" or "TYPE_DIRECTIONAL"';

                $this->jsonError(422, $error);
            }

            $rule = new QuerySynonymRule($type);
            $rule->setSynonyms($synonyms);

            if ($type === SynonymRule::TYPE_DIRECTIONAL) {
                if (!$root) {
                    $this->jsonError(422, 'Missing root for directional synonym');
                }

                $rule->setRoot($root);
            }

            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $requestBody = new ClientSynonymRuleRequest(SynonymRuleProcessor::getStringFromQuery($rule));
            $response = $indexService->getClient()->synonymRulePut($engineName, (string) $id, $requestBody);
            $this->throwJsonErrorForResponse($response);

            $outputRule = $this->buildSynonymRuleFromBody($this->decodeJsonResponse($response));

            return json_encode($outputRule);
        } catch (HTTPResponse_Exception $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->jsonError(500, $e->getMessage());
        }

        return '';
    }

    /**
     * @param HTTPRequest $request
     * @return string
     * @throws HTTPResponse_Exception
     */
    public function deleteSynonymRule(HTTPRequest $request): string
    {
        try {
            if ($this->editCheck()) {
                $this->jsonError(403, 'You do not have permission for this endpoint');
            }

            $engineName = (string) $request->param('Engine');
            $id = $request->param('ID');

            if (!$id) {
                $this->jsonError(400, 'Missing ID');
            }

            /** @var BifrostService $indexService */
            $indexService = Injector::inst()->get(IndexingInterface::class);
            $response = $indexService->getClient()->synonymRuleDelete($engineName, (string) $id);
            $this->throwJsonErrorForResponse($response);

            return json_encode([
                'status' => 'success',
            ]);
        } catch (HTTPResponse_Exception $e) {
            throw $e;
        } catch (Throwable $e) {
            $this->jsonError(500, $e->getMessage());
        }

        return '';
    }

    protected function viewCheck(): bool
    {
        return !Permission::check(SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_VIEW_SYNONYMS);
    }

    protected function editCheck(): bool
    {
        return !Permission::check(SilverstripeSearchAdmin::SILVERSTRIPE_SEARCH_EDIT_SYNONYMS);
    }

    private function throwJsonErrorForResponse(object $response): void
    {
        if ($response->getStatusCode() >= 400) {
            $this->jsonError($response->getStatusCode(), (string) $response->getBody());
        }
    }

    private function decodeJsonResponse(object $response): mixed
    {
        return json_decode((string) $response->getBody());
    }

    private function buildSynonymRuleFromBody(object $ruleBody): SynonymRule
    {
        $rule = new SynonymRule($ruleBody->id);
        SynonymRuleProcessor::applyStringToResult($rule, $ruleBody->synonyms);

        return $rule;
    }

}
