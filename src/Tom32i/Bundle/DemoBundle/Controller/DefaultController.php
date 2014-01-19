<?php

namespace Tom32i\Bundle\DemoBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Tom32i\Bundle\DemoBundle\Model\Ticket;

class DefaultController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction(Request $request)
    {
        $ticket  = new Ticket(
            $this->getUser(),
            $request->getSession()->getId(),
            $request->server->get('REMOTE_ADDR')
        );

        $this->get('tom32i_demo.redis_indexer')->index($ticket, 10);

        return ['ticket' => $ticket];
    }
}
