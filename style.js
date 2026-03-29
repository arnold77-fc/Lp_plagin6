(function () {
    'use strict';

    const APPLECATION_VERSION = '1.2.2'; // Обновленная версия с поддержкой Mobile

    // Иконка плагина
    const PLUGIN_ICON = '<svg viewBox="110 90 180 210" xmlns="http://www.w3.org/2000/svg"><g id="sphere"><circle cx="200" cy="200" fill="hsl(200, 80%, 100%)" opacity="1" r="4"/></g></svg>';

    // --- Встроенная система рейтингов ---
    const RATINGS_CONFIG = {
        cacheLifetime: 60 * 60 * 24 * 1000,
        cacheKey: 'applecation_ratings_cache',
        cacheLimit: 500,
        requestTimeout: 15000,
        corsProxyUrl: 'https://corsproxy.io/?url='
    };

    class RatingsRequestClient {
        static _request(url, onSuccess, onError, options) {
            const network = new Lampa.Reguest();
            network.timeout(RATINGS_CONFIG.requestTimeout);
            network.silent(url, onSuccess, onError, false, options);
        }
        static getJson(url, onSuccess, onError, options = {}) {
            return this._request(url, onSuccess, onError, { dataType: 'json', ...options });
        }
    }

    // --- Инициализация плагина ---
    function initializePlugin() {
        console.log('Applecation', 'v' + APPLECATION_VERSION + ' [Multi-Device Mode]');
        
        // УДАЛЕНО: Ограничение только для ТВ
        // Теперь плагин работает везде.

        patchApiImg();
        addCustomTemplate();
        addOverlayTemplate();
        addStyles();
        addSettings();
        applyLiquidGlassClass();
        attachLogoLoader();
        attachEpisodesCorePatch();
    }

    // --- Функции для работы с API и UI ---
    function patchApiImg() {
        // Подмена ссылок на изображения для 4K
        const originalTmdbImage = Lampa.TMDB.image.bind(Lampa.TMDB);
        Lampa.TMDB.image = function(url, size) {
            if (size === 'w500' || size === 'original') return originalTmdbImage(url, 'original');
            return originalTmdbImage(url, size);
        };
    }

    function addStyles() {
        const styles = `
        <style>
            /* Адаптация под мобильные устройства */
            @media screen and (max-width: 768px) {
                .applecation .full-start__left { width: 100% !important; padding: 20px !important; }
                .applecation .full-start__poster { display: none !important; }
                .applecation .applecation__logo { max-width: 200px !important; margin: 0 auto !important; }
                .applecation .applecation__info { justify-content: center !important; }
                .applecation .full-start__details { text-align: center !important; }
            }

            /* Основные стили Apple-style */
            .applecation .full-start__background { filter: brightness(0.6) !important; }
            .applecation .applecation__logo { 
                height: 120px; 
                background-size: contain; 
                background-repeat: no-repeat; 
                background-position: left bottom;
                margin-bottom: 20px;
            }
            .applecation .applecation__info { 
                display: flex; 
                gap: 15px; 
                font-weight: 600; 
                margin-bottom: 15px; 
                opacity: 0.9;
            }
            /* Стили для "Жидкого стекла" */
            .applecation--liquid-glass .full-episode.focus .full-episode__img,
            .applecation--liquid-glass .full-person.focus .full-person__photo {
                transform: scale(1.1);
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                transition: all 0.3s ease;
            }
        </style>`;
        $('body').append(styles);
    }

    // --- Регистрация и запуск ---
    function addSettings() {
        Lampa.Settings.add({
            title: 'Applecation',
            component: 'applecation_settings',
            icon: PLUGIN_ICON
        });
    }

    // Служебные функции (заглушки для интеграции)
    function addCustomTemplate() {}
    function addOverlayTemplate() {}
    function applyLiquidGlassClass() { $('body').addClass('applecation--liquid-glass'); }
    function attachLogoLoader() {}
    function attachEpisodesCorePatch() {}

    // Старт плагина при готовности Lampa
    if (window.appready) {
        initializePlugin();
    } else {
        Lampa.Listener.follow('app', (event) => {
            if (event.type === 'ready') initializePlugin();
        });
    }

    // Манифест для Lampa
    var pluginManifest = {
        type: 'other',
        version: APPLECATION_VERSION,
        name: 'Applecation (Mobile/TV)',
        description: 'Интерфейс Apple TV для всех устройств (TV и Смартфоны)',
        author: '@darkestclouds',
        icon: PLUGIN_ICON
    };

    if (Lampa.Manifest && Lampa.Manifest.plugins) {
        Lampa.Manifest.plugins = pluginManifest;
    }
})();
