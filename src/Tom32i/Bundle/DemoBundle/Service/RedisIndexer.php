<?php

namespace Tom32i\Bundle\DemoBundle\Service;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Tom32i\Bundle\DemoBundle\Interfaces\RedisIndexable;

/**
 * Redis indexer
 */
class RedisIndexer
{
    /**
     * Redis client
     *
     * @var Redis
     */
    protected $redis;

    /**
     * Redis configuration
     *
     * @var array
     */
    protected $config;

    /**
     * Is connected
     *
     * @var boolean
     */
    protected $connected = false;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->redis = new \Redis;
    }

    /**
     * Get options resolver
     *
     * @return OptionsResolver
     */
    protected function getResolver()
    {
        $resolver = new OptionsResolver;

        $resolver->setDefaults(
            [
                'host' => '127.0.0.1',
                'port' => 6379,
            ]
        );

        return $resolver;
    }

    /**
     * Set redis configuration
     *
     * @param array $config
     */
    public function setConfig(array $config)
    {
        $this->config = $this->getResolver()->resolve($config);
    }

    /**
     * Connect to redis server
     */
    protected function connect()
    {
        if (!$this->connected) {
            $this->connected = $this->redis->connect($this->config['host'], $this->config['port']);
        }

        return $this->connected;
    }

    /**
     * Disconnect from redis server
     */
    protected function disconnect()
    {
        if ($this->connected) {
            $this->connected = !$this->redis->close();
        }

        return !$this->connected;
    }

    /**
     * Get key value
     *
     * @param string $key
     *
     * @return mixed
     */
    public function get($key)
    {
        $this->connect();

        $result = json_decode($this->redis->get($key), true);

        $this->disconnect();

        return $result;
    }

    /**
     * Set key value
     *
     * @param string $key
     * @param mixed $value
     */
    public function set($key, $value, $ttl = null)
    {
        $this->connect();

        $key   = (string) $key;
        $value = json_encode($value);

        if ($ttl) {
            $this->redis->setex($key, $ttl, $value);
        } else {
            $this->redis->set($key, $value);
        }

        $this->disconnect();
    }

    /**
     * Delete a key from Redis database
     *
     * @param string $key
     */
    public function delete($key)
    {
        $this->connect();

        $this->redis->del($key);

        $this->disconnect();
    }

    /**
     * Get key values
     *
     * @param mixed $keys
     *
     * @return array
     */
    public function getAll($keys)
    {
        $this->connect();

        if (!is_array($keys)) {
            $keys = $this->redis->keys($keys);
        }

        $results = [];
        $datas   = $this->redis->mGet($keys) ?: array();

        foreach ($datas as $data) {
            if ($data) {
                $results[] = json_decode($data, true);
            }
        }

        $this->disconnect();

        return $results;
    }

    /**
     * Flush database
     */
    public function flush()
    {
        $this->connect();

        $this->redis->flushAll();

        $this->disconnect();
    }

    /**
     * Index an object into redis database
     *
     * @param RedisIndexable $object
     */
    public function index(RedisIndexable $object, $ttl = null)
    {
        $this->set($object->getRedisIndex(), $object, $ttl);
    }

    /**
     * Remove an object from redis database
     *
     * @param RedisIndexable $object
     */
    public function remove(RedisIndexable $object)
    {
        $this->delete($object->getRedisIndex());
    }
}