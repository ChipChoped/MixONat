package com.backend.mixonat.cache;

import org.ehcache.event.CacheEvent;
import org.ehcache.event.CacheEventListener;

public class CacheEventLogger 
  implements CacheEventListener<Object, Object> {

    @Override
    public void onEvent(CacheEvent<? extends Object, ? extends Object> cacheEvent) 
    {
           
          if (cacheEvent.getType().toString().equals("CREATED"))
          {
            System.out.println("a new cache was created ! ");
          }

          if (cacheEvent.getType().toString().equals("EXPIRED"))
          {
            System.out.println("a cache was expired ! ");
          }

          if (cacheEvent.getType().toString().equals("REMOVED"))
          {
            System.out.println("a cache was removed ! ");
          }
    }


}