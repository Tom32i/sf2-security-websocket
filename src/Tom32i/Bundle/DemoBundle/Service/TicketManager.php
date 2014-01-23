<?php

namespace Tom32i\Bundle\DemoBundle\Service;

use Symfony\Component\Security\Core\SecurityContextInterface;
use Symfony\Component\Security\Core\Authentication\Token\AnonymousToken;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\HttpKernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Tom32i\Bundle\DemoBundle\Model\Ticket;
use Tom32i\Bundle\DemoBundle\Service\RedisIndexer;

/**
 * Ticket Manager
 */
class TicketManager
{
    /**
     * HTML token placeholder
     */
    const TOKEN_PLACEHOLDER = '<!-- WebsocketToken -->';

    /**
     * Security Context
     *
     * @var SecurityContextInterface
     */
    protected $context;

    /**
     * Twig engine
     *
     * @var Twig_Environment
     */
    protected $twig;

    /**
     * Redis indexer
     *
     * @var RedisIndexer
     */
    protected $indexer;

    /**
     * Rediser indexer
     *
     * @param RedisIndexer $indexer
     */
    public function __construct(RedisIndexer $indexer, \Twig_Environment $twig, SecurityContextInterface $context = null)
    {
        $this->indexer = $indexer;
        $this->twig    = $twig;
        $this->context = $context;
    }

    /**
     * Watch Requeset and Reponse
     *
     * @param Request $request
     * @param Response $response
     */
    public function watch(Request $request, Response $response)
    {
        if (!$response->isSuccessful()) {
            return;
        }

        $token   = $this->context !== null ? $this->context->getToken() : null;
        $granted = $token && $token->isAuthenticated() && !($token instanceof AnonymousToken);

        if ($granted) {
            $ticket  = new Ticket(
                $token->getUser(),
                $request->getSession()->getId(),
                $request->server->get('REMOTE_ADDR')
            );

            $this->indexer->index($ticket, $ticket->getTTl());

            $this->injectToken($response, (string) $ticket);
        }
    }

    /**
     * Inject Token in the response content
     *
     * @param Response $response
     * @param string $token
     */
    public function injectToken(Response $response, $token)
    {
        $tokenElement = $this->twig->render('Tom32iDemoBundle::token.html.twig', ['token' => $token]);
        $content      = str_replace(self::TOKEN_PLACEHOLDER, $tokenElement, $response->getContent());

        $response->setContent($content);
    }
}