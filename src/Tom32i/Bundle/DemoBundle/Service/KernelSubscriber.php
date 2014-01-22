<?php

namespace Tom32i\Bundle\DemoBundle\Service;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\HttpKernel;
use Tom32i\Bundle\DemoBundle\Model\Ticket;
use Tom32i\Bundle\DemoBundle\Service\RedisIndexer;

/**
 * Kernel Subscriber
 */
class KernelSubscriber implements EventSubscriberInterface
{
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
    public function __construct(RedisIndexer $indexer)
    {
        $this->indexer = $indexer;
    }

    /**
     * Get Subscriber Events
     *
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return array(
            //'kernel.controller' => ['onKernelController', 0],
            'kernel.response' => ['onKernelResponse', 0],
        );
    }

    /**
     * On Kernel Response
     *
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        $response = $event->getResponse();

        if ($response->getStatusCode() === 200) {

            $ticket  = new Ticket(
                $this->getUser(),
                $request->getSession()->getId(),
                $request->server->get('REMOTE_ADDR')
            );

            $this->indexer->index($ticket, $ticket->getTTl());

            $this->headers->add('Ticket-Token', (string) $ticket);
        }
    }

    /**
     * On Kernel Response
     *
     * @param FilterControllerEvent $event
     *
     * @return Response
     */
    public function onKernelController(FilterControllerEvent $event)
    {
        //var_dump($event->getController());
        //$event->getRequest()->setFormat('jsonp', 'application/javascript');
    }
}