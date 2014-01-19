<?php

namespace Tom32i\Bundle\WebsocketBundle\Intefaces;

/**
 * Indexable by redis
 */
interface RedisIndexable extends \JsonSerializable
{
    /**
     * getEntryKey
     *
     * @return string
     */
    public function getRedisIndex();
}