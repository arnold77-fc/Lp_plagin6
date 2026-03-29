(function () {
    'use strict';

    const APPLECATION_VERSION = '1.2.5';
    const PLUGIN_ICON = '<svg viewBox="110 90 180 210" xmlns="http://www.w3.org/2000/svg"><g id="sphere"><circle cx="200" cy="200" fill="white" opacity="1" r="4"/></g></svg>';

    // --- Система рейтингов и кэширования ---
    const RATINGS_CONFIG = {
        cacheLifetime: 60 * 60 * 24 * 1000,
        cacheKey: 'applecation_ratings_cache',
        cacheLimit: 500,
        requestTimeout: 15000,
        corsProxyUrl: 'https://corsproxy.io/?url='
    };

    // --- Инициализация ---
    function initializePlugin() {
        console.log('Applecation Init: v' + APPLECATION_VERSION + ' [Multi-Device]');

        patchApiImg();
        addStyles();
        addSettings();
        
        // Слушаем открытие карточки
        Lampa.Listener.follow('full', (event) => {
            if (event.type === 'complite') {
                const render = event.object.render();
                render.find('.full-start').addClass('applecation');
                
                // Если телефон - адаптируем верстку
                if (!Lampa.Platform.screen('tv')) {
                    render.find('.full-start').addClass('applecation--mobile');
                }
                
                // Здесь вызываются ваши функции логотипов и рейтингов из оригинального кода
                if (typeof loadLogo === 'function') loadLogo(event);
            }
        });
    }

    // --- Настройки (чтобы пункт появился в меню) ---
    function addSettings() {
        // Регистрация компонента в Lampa
        Lampa.SettingsApi.addComponent({
            component: 'applecation_settings',
            name: 'Applecation',
            icon: PLUGIN_ICON
        });

        // Добавляем параметры в меню
        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: 'applecation_show_ratings', type: 'trigger', default: true },
            field: { name: 'Показывать рейтинги', description: 'Включить отображение КП/IMDb' }
        });

        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: 'applecation_kp_api_key', type: 'button', default: '' },
            field: { name: 'КиноПоиск API Key', description: 'Введите ключ от kinopoiskapiunofficial.tech' },
            onChange: function() {
                Lampa.Input.edit({ title: 'Ключ КиноПоиска', value: Lampa.Storage.get('applecation_kp_api_key', ''), free: true }, function(newV) {
                    if (newV) Lampa.Storage.set('applecation_kp_api_key', newV);
                });
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: 'applecation_mdblist_api_key', type: 'button', default: '' },
            field: { name: 'MDBList API Key', description: 'Для рейтингов Rotten Tomatoes и Metacritic' },
            onChange: function() {
                Lampa.Input.edit({ title: 'Ключ MDBList', value: Lampa.Storage.get('applecation_mdblist_api_key', ''), free: true }, function(newV) {
                    if (newV) Lampa.Storage.set('applecation_mdblist_api_key', newV);
                });
            }
        });
    }

    // --- Оптимизация изображений ---
    function patchApiImg() {
        if (window.Lampa && Lampa.TMDB) {
            const originalImg = Lampa.TMDB.image || (Lampa.Api.sources.tmdb && Lampa.Api.sources.tmdb.img);
            if (originalImg) {
                const newImgFunc = function(src, size) {
                    // Принудительно ставим Original для постеров, если выбрано высокое качество
                    if (size === 'w500' || size === 'w1280') return originalImg.call(this, src, 'original');
                    return originalImg.call(this, src, size);
                };
                if (Lampa.TMDB.image) Lampa.TMDB.image = newImgFunc;
            }
        }
    }

    // --- Стили для ТВ и Мобильных ---
    function addStyles() {
        const styles = `
        <style>
            /* Стиль Apple TV */
            .applecation .full-start__background { filter: brightness(0.5) !important; transition: filter 0.5s ease; }
            .applecation .full-start__title { font-weight: 700; text-transform: none; }
            
            /* Адаптация для Смартфонов */
            .applecation--mobile .full-start__left { 
                width: 100% !important; 
                padding: 20px !important; 
                display: flex; flex-direction: column; align-items: center; text-align: center;
            }
            .applecation--mobile .full-start__poster { display: none !important; }
            .applecation--mobile .full-start__details { justify-content: center !important; }
            .applecation--mobile .full-start__button { width: 100%; max-width: 300px; }

            /* Рейтинги */
            .applecation__ratings { display: flex; gap: 15px; margin: 15px 0; font-weight: bold; }
        </style>`;
        $('body').append(styles);
    }

    // --- Запуск ---
    if (window.appready) {
        initializePlugin();
    } else {
        Lampa.Listener.follow('app', (event) => {
            if (event.type === 'ready') initializePlugin();
        });
    }

    // Манифест
    const manifest = {
        type: 'other',
        version: APPLECATION_VERSION,
        name: 'Applecation (Multi)',
        description: 'Стиль Apple TV для Android TV и Смартфонов',
        author: '@darkestclouds',
        icon: PLUGIN_ICON
    };
    Lampa.Manifest.plugins = manifest;
})();
