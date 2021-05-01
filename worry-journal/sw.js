const STATIC_FILES = [
    'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600&display=swap',
    'https://unpkg.com/@webcomponents/webcomponentsjs@2.4.1/webcomponents-bundle.js',
    'https://cdn.rawgit.com/ricmoo/aes-js/e27b99df/index.js',
    'https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js',
    'https://fonts.gstatic.com/s/rubik/v12/iJWKBXyIfDnIV7nBrXyw023e.woff2',
    'https://unpkg.com/lit-element?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/shady-render.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lit-html.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/dom.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/modify-template.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/render.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/template-factory.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/template-instance.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/template.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/default-template-processor.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/template-result.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/directive.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/part.js?module',
    'https://unpkg.com/lit-html@%5E1.1.1/lib/parts.js?module',
    {
        key: 'https://unpkg.com/lib/updating-element.js?module',
        url: 'https://unpkg.com/lit-element/lib/updating-element.js?module'
    },
    {
        key: 'https://unpkg.com/lib/decorators.js?module',
        url: 'https://unpkg.com/lit-element/lib/decorators.js?module'
    },
    {
        key: 'https://unpkg.com/lib/css-tag.js?module',
        url: 'https://unpkg.com/lit-element/lib/css-tag.js?module'
    }
];

async function cacheFile(file, cache) {
    let key = file;
    let url = file;
    if (typeof file !== 'string') {
        key = file.key;
        url = file.url;
    }

    const r = await fetch(url);
    cache.put(key, r.clone());
    return r;
}

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open('offline-resource-cache').then(async function(cache) {
				let r;
				try {
					r = await fetch(event.request);
					if (r.status !== 200) {
						throw new Error('non 200 status');
					}
				} catch {
					r  = cache.match(event.request);
				}
				return r;
      })
    );
});

self.addEventListener('install', function(event) {  
    // On install cache all the files we can.
    caches.open('offline-resource-cache').then(function(cache) {
        STATIC_FILES.map(file => cacheFile(file, cache));
      })
  });