<?php

namespace Tom32i\Bundle\DemoBundle\Interfaces;

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