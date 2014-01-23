<?php

namespace Tom32i\Bundle\DemoBundle\Service;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\HttpKernel\HttpKernel;
use Tom32i\Bundle\DemoBundle\Model\Ticket;
use Tom32i\Bundle\DemoBundle\Service\TicketManager;

/**
 * Kernel Subscriber
 */
class KernelSubscriber implements EventSubscriberInterface
{
    /**
     * Ticket manager
     *
     * @var TicketManager
     */
    protected $manager;

    /**
     * Constructor
     *
     * @param TicketManager $manager
     */
    public function __construct(TicketManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Get Subscriber Events
     *
     * @return array
     */
    public static function getSubscribedEvents()
    {
        return array(
            KernelEvents::RESPONSE => ['onKernelResponse', 0],
        );
    }

    /**
     * On Kernel Response
     *
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event)
    {
        if (!$event->isMasterRequest()) {
            return;
        }

        $request  = $event->getRequest();
        $response = $event->getResponse();

        $this->manager->watch($request, $response);
    }
}