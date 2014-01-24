<?php

namespace Tom32i\Bundle\DemoBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\Form\FormError;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Tom32i\Bundle\DemoBundle\Form\Type\LoginType;

/**
 * Security Controller
 */
class SecurityController extends Controller
{
    /**
     * Login action
     *
     * @Template()
     *
     * @param Request $request
     */
    public function loginAction(Request $request)
    {
        $session = $request->getSession();

        $form = $this->createForm(
            new LoginType,
            [
                '_username'   => $session->get(SecurityContext::LAST_USERNAME),
                '_password'   => null,
                '_remember_me' => true,
            ],
            [
                'action' => $this->generateUrl('login_check'),
                'method' => 'POST',
            ]
        );

        $form->add('submit', 'submit', ['label' => 'Login']);

        if ($request->attributes->has(SecurityContext::AUTHENTICATION_ERROR)) {
            $error = $request->attributes->get(
                SecurityContext::AUTHENTICATION_ERROR
            );
        } else {
            $error = $session->get(SecurityContext::AUTHENTICATION_ERROR);
            $session->remove(SecurityContext::AUTHENTICATION_ERROR);
        }

        if ($error) {
            if ($error instanceof LockedException) {
                $code = 'login.error.locked';
            } elseif ($error instanceof DisabledException) {
                $code = 'login.error.disabled';
            } else {
                $code = 'login.error.failed';
            }

            $form->addError(
                new FormError($error->getMessage(), $code, ['message' => $error->getMessage()])
            );
        }

        return ['form' => $form->createView()];
    }
}
