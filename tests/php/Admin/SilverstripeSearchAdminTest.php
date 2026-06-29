<?php

namespace SilverstripeSearch\Tests\Admin;

use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\TestCase;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forager\Interfaces\DocumentInterface;
use SilverStripe\Forager\Interfaces\IndexingInterface;
use SilverStripe\Forager\Service\IndexConfiguration;
use SilverStripe\Forager\Service\Results\SynonymRule;
use SilverstripeSearch\Admin\SilverstripeSearchAdmin;

if (!class_exists('Page')) {
    eval('class Page extends \\SilverStripe\\CMS\\Model\\SiteTree {}');
}

if (!class_exists('PageController')) {
    eval('class PageController extends \\SilverStripe\\CMS\\Controllers\\ContentController {}');
}

class SilverstripeSearchAdminTest extends TestCase
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        SapphireTest::start();
    }

    protected function setUp(): void
    {
        Injector::nest();
    }

    protected function tearDown(): void
    {
        Injector::unnest();
    }

    public function testGetSynonymsParsesRawClientResponse(): void
    {
        $service = new TestIndexingService();
        $service->synonymRulesResponse = new Response(200, [], json_encode([
            [
                'id' => 'rule-1',
                'synonyms' => 'green, emerald',
            ],
            [
                'id' => 'rule-2',
                'synonyms' => 'tree => branch, leaf',
            ],
        ], JSON_THROW_ON_ERROR));

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();
        $request = new HTTPRequest('GET', '/', ['engine' => 'search-content']);

        $result = json_decode($controller->getSynonyms($request), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame('rule-1', $result[0]['id']);
        $this->assertSame('TYPE_EQUIVALENT', $result[0]['type']);
        $this->assertSame([], $result[0]['root']);
        $this->assertSame(['green', 'emerald'], $result[0]['synonyms']);
        $this->assertSame('rule-2', $result[1]['id']);
        $this->assertSame('TYPE_DIRECTIONAL', $result[1]['type']);
        $this->assertSame(['tree'], $result[1]['root']);
        $this->assertSame(['branch', 'leaf'], $result[1]['synonyms']);
    }

    public function testGetSynonymsReturnsUpstreamErrorResponse(): void
    {
        $service = new TestIndexingService();
        $service->synonymRulesResponse = new Response(422, [], '{"message":"bad request"}');

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();
        $request = new HTTPRequest('GET', '/', ['engine' => 'search-content']);

        try {
            $controller->getSynonyms($request);
            $this->fail('Expected HTTPResponse_Exception was not thrown');
        } catch (HTTPResponse_Exception $exception) {
            $this->assertSame(422, $exception->getResponse()->getStatusCode());

            $body = json_decode($exception->getResponse()->getBody(), true, 512, JSON_THROW_ON_ERROR);
            $this->assertSame('error', $body['status']);
            $this->assertSame(422, $body['errors'][0]['code']);
            $this->assertSame('{"message":"bad request"}', $body['errors'][0]['value']);
        }
    }

    public function testEnginesParsesRawClientResponse(): void
    {
        IndexConfiguration::config()->set('index_prefix', 'search');

        $service = new TestIndexingService();
        $service->enginesResponse = new Response(200, [], json_encode([
            'results' => [
                ['name' => 'search-content'],
                ['name' => 'search-files'],
            ],
        ], JSON_THROW_ON_ERROR));
        $service->documentTotals = [
            'content' => 12,
            'files' => 5,
        ];

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();

        $result = json_decode($controller->engines(new HTTPRequest('GET', '/')), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame('search-content', $result[0]['name']);
        $this->assertSame(12, $result[0]['totalDocs']);
        $this->assertSame('search-files', $result[1]['name']);
        $this->assertSame(5, $result[1]['totalDocs']);
    }

    public function testGetSchemaParsesRawClientResponse(): void
    {
        $service = new TestIndexingService();
        $service->schemaResponse = new Response(200, [], json_encode([
            'title' => 'text',
            'created' => 'date',
        ], JSON_THROW_ON_ERROR));

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();

        $result = json_decode($controller->getSchema(new HTTPRequest('GET', '/', ['engine' => 'search-content'])), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame(['title' => 'text', 'created' => 'date'], $result);
    }

    public function testCreateSynonymRuleUsesNewClientRequestAndParsesResponse(): void
    {
        $service = new TestIndexingService();
        $service->synonymRulePostResponse = new Response(200, [], json_encode([
            'id' => 'rule-3',
            'synonyms' => 'tree => branch, leaf',
        ], JSON_THROW_ON_ERROR));

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();
        $request = new HTTPRequest('POST', '/');
        $request->setRouteParams(['Engine' => 'search-content']);
        $request->setBody(json_encode([
            'type' => SynonymRule::TYPE_DIRECTIONAL,
            'root' => ['tree'],
            'synonyms' => ['branch', 'leaf'],
        ], JSON_THROW_ON_ERROR));

        $result = json_decode($controller->createSynonymRule($request), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame('search-content', $service->lastEngineName);
        $this->assertSame('tree => branch, leaf', $service->lastSynonymRequestString);
        $this->assertSame('rule-3', $result['id']);
        $this->assertSame(SynonymRule::TYPE_DIRECTIONAL, $result['type']);
        $this->assertSame(['tree'], $result['root']);
        $this->assertSame(['branch', 'leaf'], $result['synonyms']);
    }

    public function testUpdateSynonymRuleUsesNewClientRequestAndParsesResponse(): void
    {
        $service = new TestIndexingService();
        $service->synonymRulePutResponse = new Response(200, [], json_encode([
            'id' => 'rule-9',
            'synonyms' => 'green, emerald',
        ], JSON_THROW_ON_ERROR));

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();
        $request = new HTTPRequest('PATCH', '/');
        $request->setRouteParams(['Engine' => 'search-content', 'ID' => 'rule-9']);
        $request->setBody(json_encode([
            'type' => SynonymRule::TYPE_EQUIVALENT,
            'synonyms' => ['green', 'emerald'],
        ], JSON_THROW_ON_ERROR));

        $result = json_decode($controller->updateSynonymRule($request), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame('search-content', $service->lastEngineName);
        $this->assertSame('rule-9', $service->lastRuleId);
        $this->assertSame('green, emerald', $service->lastSynonymRequestString);
        $this->assertSame('rule-9', $result['id']);
        $this->assertSame(SynonymRule::TYPE_EQUIVALENT, $result['type']);
        $this->assertSame(['green', 'emerald'], $result['synonyms']);
    }

    public function testDeleteSynonymRuleUsesNewClientRequest(): void
    {
        $service = new TestIndexingService();
        $service->synonymRuleDeleteResponse = new Response(200, [], '{"success":true}');

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();
        $request = new HTTPRequest('DELETE', '/');
        $request->setRouteParams(['Engine' => 'search-content', 'ID' => 'rule-7']);

        $result = json_decode($controller->deleteSynonymRule($request), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame('search-content', $service->lastEngineName);
        $this->assertSame('rule-7', $service->lastRuleId);
        $this->assertSame(['status' => 'success'], $result);
    }

    public function testDeleteSynonymRuleReturnsUpstreamErrorResponse(): void
    {
        $service = new TestIndexingService();
        $service->synonymRuleDeleteResponse = new Response(404, [], '{"message":"missing rule"}');

        Injector::inst()->registerService($service, IndexingInterface::class);

        $controller = new TestableSilverstripeSearchAdmin();
        $request = new HTTPRequest('DELETE', '/');
        $request->setRouteParams(['Engine' => 'search-content', 'ID' => 'rule-7']);

        try {
            $controller->deleteSynonymRule($request);
            $this->fail('Expected HTTPResponse_Exception was not thrown');
        } catch (HTTPResponse_Exception $exception) {
            $this->assertSame(404, $exception->getResponse()->getStatusCode());

            $body = json_decode($exception->getResponse()->getBody(), true, 512, JSON_THROW_ON_ERROR);
            $this->assertSame('error', $body['status']);
            $this->assertSame(404, $body['errors'][0]['code']);
            $this->assertSame('{"message":"missing rule"}', $body['errors'][0]['value']);
        }
    }
}

class TestableSilverstripeSearchAdmin extends SilverstripeSearchAdmin
{
    protected function viewCheck(): bool
    {
        return false;
    }

    protected function editCheck(): bool
    {
        return false;
    }
}

class TestIndexingService implements IndexingInterface
{
    public ?Response $enginesResponse = null;

    public ?Response $schemaResponse = null;

    public ?Response $synonymRulesResponse = null;

    public ?Response $synonymRulePostResponse = null;

    public ?Response $synonymRulePutResponse = null;

    public ?Response $synonymRuleDeleteResponse = null;

    public array $documentTotals = [];

    public ?string $lastEngineName = null;

    public ?string $lastRuleId = null;

    public ?string $lastSynonymRequestString = null;

    public function getClient(): object
    {
        return new class ($this) {
            public function __construct(private readonly TestIndexingService $service)
            {
            }

            public function enginesPost(): Response
            {
                return $this->service->enginesResponse ?? new Response(500, [], '{}');
            }

            public function schemaGet(string $engineName): Response
            {
                $this->service->lastEngineName = $engineName;

                return $this->service->schemaResponse ?? new Response(500, [], '{}');
            }

            public function synonymRulesGet(string $engineName): Response
            {
                $this->service->lastEngineName = $engineName;

                return $this->service->synonymRulesResponse ?? new Response(500, [], '{}');
            }

            public function synonymRulePost(string $engineName, object $request): Response
            {
                $this->service->lastEngineName = $engineName;
                $this->service->lastSynonymRequestString = $request->getSynonyms();

                return $this->service->synonymRulePostResponse ?? new Response(500, [], '{}');
            }

            public function synonymRulePut(string $engineName, string $ruleId, object $request): Response
            {
                $this->service->lastEngineName = $engineName;
                $this->service->lastRuleId = $ruleId;
                $this->service->lastSynonymRequestString = $request->getSynonyms();

                return $this->service->synonymRulePutResponse ?? new Response(500, [], '{}');
            }

            public function synonymRuleDelete(string $engineName, string $ruleId): Response
            {
                $this->service->lastEngineName = $engineName;
                $this->service->lastRuleId = $ruleId;

                return $this->service->synonymRuleDeleteResponse ?? new Response(500, [], '{}');
            }
        };
    }

    public function addDocument(string $indexSuffix, DocumentInterface $document): ?string
    {
        return null;
    }

    public function addDocuments(string $indexSuffix, array $documents): array
    {
        return [];
    }

    public function removeDocument(string $indexSuffix, DocumentInterface $document): ?string
    {
        return null;
    }

    public function removeDocuments(string $indexSuffix, array $documents): array
    {
        return [];
    }

    public function getMaxDocumentSize(): int
    {
        return 0;
    }

    public function getDocument(string $indexSuffix, string $id): ?DocumentInterface
    {
        return null;
    }

    public function getDocuments(string $indexSuffix, array $ids): array
    {
        return [];
    }

    public function listDocuments(string $indexSuffix, ?int $pageSize = null, int $currentPage = 0): array
    {
        return [];
    }

    public function getDocumentTotal(string $indexSuffix): int
    {
        if (array_key_exists($indexSuffix, $this->documentTotals)) {
            return $this->documentTotals[$indexSuffix];
        }

        $suffix = str_contains($indexSuffix, '-')
            ? substr($indexSuffix, strrpos($indexSuffix, '-') + 1)
            : $indexSuffix;

        return $this->documentTotals[$suffix] ?? 0;
    }

    public function clearIndexDocuments(string $indexSuffix, int $batchSize): int
    {
        return 0;
    }

    public function configure(): array
    {
        return [];
    }

    public function validateField(string $field): void
    {
    }

    public function getExternalURL(): ?string
    {
        return null;
    }

    public function getExternalURLDescription(): ?string
    {
        return null;
    }

    public function getDocumentationURL(): ?string
    {
        return null;
    }
}
