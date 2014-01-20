<?php

namespace Tom32i\Bundle\DemoBundle\Model;

use Symfony\Component\Security\Core\User\UserInterface;
use Tom32i\Bundle\DemoBundle\Interfaces\RedisIndexable;

/**
 * Ticket
 */
class Ticket implements RedisIndexable
{
    const KEY = 'ticket:%s';

    /**
     * UserInterface
     *
     * @var User
     */
    protected $user;

    /**
     * Session ID
     *
     * @var string
     */
    protected $sessionId;

    /**
     * IP Address
     *
     * @var string
     */
    protected $address;

    /**
     * Created
     *
     * @var DateTime
     */
    protected $created;

    /**
     * Time to Live
     *
     * @var integer
     */
    protected $ttl;

    /**
     * Constructor
     *
     * @param User $user
     * @param string $sessionId
     * @param string $address
     */
    public function __construct(UserInterface $user, $sessionId, $address, $ttl = 10)
    {
        $this->user      = $user;
        $this->sessionId = $sessionId;
        $this->address   = $address;
        $this->ttl       = intval($ttl);
        $this->created   = new \DateTime;
    }

    /**
     * To string
     *
     * @return string
     */
    public function __toString()
    {
        return md5(http_build_query($this->jsonSerialize()));
    }

    /**
     * Get Time to Live
     *
     * @return [type]
     */
    public function getTTl()
    {
        return $this->ttl;
    }

    /**
     * Get redis index
     *
     * @return string
     */
    public function getRedisIndex()
    {
        return sprintf(static::KEY, (string) $this);
    }

    /**
     * Json serializable version of the ticket
     *
     * @return array
     */
    public function jsonSerialize()
    {
        return [
            'user'    => [
                'username' => $this->user->getUsername(),
                'roles'    => $this->user->getRoles()
            ],
            'sessionId' => $this->sessionId,
            'address'   => $this->address,
            'created'   => $this->created->format('U'),
            'ttl'       => $this->ttl,
        ];
    }
}