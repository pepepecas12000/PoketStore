const CACHE = 'pocket-store-v2';
const API = 'https://jsonplaceholder.typicode.com/users';

const ARCHIVOS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll(ARCHIVOS).then(() => cache.add(API).catch(() => {}));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(nombres => {
            return Promise.all(
                nombres.filter(n => n !== CACHE).map(n => caches.delete(n))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    const url = new URL(e.request.url);

    if (url.hostname === 'jsonplaceholder.typicode.com') {
        e.respondWith(
            fetch(e.request)
            .then(res => {
                const copia = res.clone();
                caches.open(CACHE).then(cache => cache.put(e.request, copia));
                return res;
            })
            .catch(() => caches.match(e.request, { ignoreVary: true }))
        );
        return;
    }

    e.respondWith(
        caches.match(e.request, { ignoreSearch: true, ignoreVary: true }).then(res => {
            if (res) return res;
            return fetch(e.request).catch(() => {
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});