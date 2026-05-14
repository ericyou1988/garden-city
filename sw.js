/**
 * Garden City - Service Worker
 * 提供离线缓存支持（PWA 核心功能）
 *
 * 策略说明：
 * - 静态资源（HTML/CSS/JS/图片）：Cache-First（优先缓存，缓存未命中再请求网络）
 * - 页面请求：Network-First（优先网络，网络不可用时回退到缓存）
 * - 缓存更新：每次激活时清理旧版本缓存
 */

'use strict';

// 缓存版本号 — 更新此值可触发缓存刷新
const CACHE_VERSION = 'v1';
const CACHE_NAME = 'garden-city-' + CACHE_VERSION;

// 需要预缓存的核心资源列表
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/stats.js',
  '/favicon.svg',
  '/manifest.json'
];

// 安装事件 — 预缓存核心资源
self.addEventListener('install', function (event) {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('[SW] Pre-caching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(function () {
        // 立即激活，不等待旧 SW 退出
        return self.skipWaiting();
      })
  );
});

// 激活事件 — 清理旧缓存
self.addEventListener('activate', function (event) {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (name) {
              // 删除非当前版本的缓存
              return name.startsWith('garden-city-') && name !== CACHE_NAME;
            })
            .map(function (name) {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(function () {
        // 立即接管所有页面
        return self.clients.claim();
      })
  );
});

// 请求拦截 — 缓存策略
self.addEventListener('fetch', function (event) {
  var request = event.request;

  // 只处理 GET 请求
  if (request.method !== 'GET') return;

  // 判断是否为导航请求（页面请求）
  if (request.mode === 'navigate') {
    // 导航请求：Network-First（优先网络，保证内容最新）
    event.respondWith(
      fetch(request)
        .then(function (networkResponse) {
          // 网络请求成功，更新缓存
          var responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(function () {
          // 网络不可用，回退到缓存
          return caches.match(request).then(function (cachedResponse) {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
  } else {
    // 静态资源：Cache-First（优先缓存，减少网络请求）
    event.respondWith(
      caches.match(request).then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }
        // 缓存未命中，请求网络并缓存结果
        return fetch(request).then(function (networkResponse) {
          // 只缓存同源资源
          if (networkResponse && networkResponse.status === 200 && request.url.startsWith(self.location.origin)) {
            var responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
