"use strict";var precacheConfig=[["/evanzhao/uw/uwari/index.html","58b3f21068df6aef604c31a48d94df9a"],["/evanzhao/uw/uwari/static/css/main.a9827bf7.css","48cf17ff59007a2321247c20f574abf0"],["/evanzhao/uw/uwari/static/js/main.1246c3bf.js","a9cfbd5626f03554a841ea9713c26162"],["/evanzhao/uw/uwari/static/media/Roboto-Bold.39b2c303.woff2","39b2c3031be6b4ea96e2e3e95d307814"],["/evanzhao/uw/uwari/static/media/Roboto-Bold.dc81817d.woff","dc81817def276b4f21395f7ea5e88dcd"],["/evanzhao/uw/uwari/static/media/Roboto-Bold.e31fcf18.ttf","e31fcf1885e371e19f5786c2bdfeae1b"],["/evanzhao/uw/uwari/static/media/Roboto-Bold.ecdd509c.eot","ecdd509cadbf1ea78b8d2e31ec52328c"],["/evanzhao/uw/uwari/static/media/Roboto-Light.3b813c2a.woff","3b813c2ae0d04909a33a18d792912ee7"],["/evanzhao/uw/uwari/static/media/Roboto-Light.46e48ce0.ttf","46e48ce0628835f68a7369d0254e4283"],["/evanzhao/uw/uwari/static/media/Roboto-Light.69f8a061.woff2","69f8a0617ac472f78e45841323a3df9e"],["/evanzhao/uw/uwari/static/media/Roboto-Light.a990f611.eot","a990f611f2305dc12965f186c2ef2690"],["/evanzhao/uw/uwari/static/media/Roboto-Medium.4d9f3f9e.eot","4d9f3f9e5195e7b074bb63ba4ce42208"],["/evanzhao/uw/uwari/static/media/Roboto-Medium.574fd0b5.woff2","574fd0b50367f886d359e8264938fc37"],["/evanzhao/uw/uwari/static/media/Roboto-Medium.894a2ede.ttf","894a2ede85a483bf9bedefd4db45cdb9"],["/evanzhao/uw/uwari/static/media/Roboto-Medium.fc78759e.woff","fc78759e93a6cac50458610e3d9d63a0"],["/evanzhao/uw/uwari/static/media/Roboto-Regular.2751ee43.woff2","2751ee43015f9884c3642f103b7f70c9"],["/evanzhao/uw/uwari/static/media/Roboto-Regular.30799efa.eot","30799efa5bf74129468ad4e257551dc3"],["/evanzhao/uw/uwari/static/media/Roboto-Regular.ba3dcd89.woff","ba3dcd8903e3d0af5de7792777f8ae0d"],["/evanzhao/uw/uwari/static/media/Roboto-Regular.df7b648c.ttf","df7b648ce5356ea1ebce435b3459fd60"],["/evanzhao/uw/uwari/static/media/Roboto-Thin.7500519d.woff","7500519de3d82e33d1587f8042e2afcb"],["/evanzhao/uw/uwari/static/media/Roboto-Thin.94998475.ttf","94998475f6aea65f558494802416c1cf"],["/evanzhao/uw/uwari/static/media/Roboto-Thin.954bbdeb.woff2","954bbdeb86483e4ffea00c4591530ece"],["/evanzhao/uw/uwari/static/media/Roboto-Thin.dfe56a87.eot","dfe56a876d0282555d1e2458e278060f"],["/evanzhao/uw/uwari/static/media/arrow_left.11911410.svg","11911410dca2de148f30954eb2fd5eab"],["/evanzhao/uw/uwari/static/media/arrow_right.8ef6a08c.svg","8ef6a08cdc1154920165680a4edde771"],["/evanzhao/uw/uwari/static/media/background1.89a020a6.jpg","89a020a61b2d54f12b2753ab1c562062"],["/evanzhao/uw/uwari/static/media/fontawesome-webfont.674f50d2.eot","674f50d287a8c48dc19ba404d20fe713"],["/evanzhao/uw/uwari/static/media/fontawesome-webfont.912ec66d.svg","912ec66d7572ff821749319396470bde"],["/evanzhao/uw/uwari/static/media/fontawesome-webfont.af7ae505.woff2","af7ae505a9eed503f8b8e6982036873e"],["/evanzhao/uw/uwari/static/media/fontawesome-webfont.b06871f2.ttf","b06871f281fee6b241d60582ae9369b9"],["/evanzhao/uw/uwari/static/media/fontawesome-webfont.fee66e71.woff","fee66e712a8a08eef5805a46892932ad"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,n){var o=new URL(e);return n&&o.pathname.match(n)||(o.search+=(o.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),o.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],n=new URL(a,self.location),o=createCacheKey(n,hashParamName,t,/\.\w{8}\./);return[n.toString(),o]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,n),e=urlsToCacheKeys.has(t));var o="/evanzhao/uw/uwari/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(o,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});