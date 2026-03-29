(function () {
    'use strict';

    const APPLECATION_VERSION = '1.3.0-Universal';
    const STUDIO_STORAGE_KEY = 'studio_logos_plugin_';

    // Иконка плагина
    const PLUGIN_ICON = '<svg viewBox="110 90 180 210" xmlns="http://www.w3.org/2000/svg"><g id="sphere"><circle cx="200" cy="140" fill="hsl(200, 80%, 40%)" opacity="0.3" r="1.2" /><circle cx="230" cy="150" fill="hsl(200, 80%, 45%)" opacity="0.35" r="1.3" /><circle cx="200" cy="200" fill="hsl(200, 80%, 100%)" opacity="1" r="4" /></g></svg>';

    // --- ОБЪЕДИНЕННЫЕ СТИЛИ (Applecation + Studio Logos) ---
    const styles = `
        /* Стили Applecation */
        .applecation--poster-high { transform: scale(1.03); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .applecation-ratings { display: flex; gap: 15px; margin: 10px 0; font-weight: bold; }
        
        /* Стили Студийных Логотипов */
        .plugin-studio-logos {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin: 15px 0;
            padding: 5px 0;
            position: relative;
            z-index: 10;
        }
        .studio-logo-item {
            display: inline-flex;
            align-items: center;
            border-radius: 8px;
            padding: 6px 10px;
            transition: all 0.2s ease;
            background: rgba(255,255,255,0.06);
            border: 1px solid transparent;
            cursor: pointer;
        }
        /* Состояние фокуса для пульта Android TV */
        .studio-logo-item.focus {
            background: rgba(255,255,255,0.25) !important;
            border: 1px solid #fff;
            transform: scale(1.1);
            outline: none;
        }
        .studio-logo-item img {
            max-width: 150px;
            height: auto;
            object-fit: contain;
            pointer-events: none;
        }
        
        /* Адаптация под Мобильные устройства */
        @media screen and (max-width: 768px) {
            .plugin-studio-logos { gap: 8px; }
            .studio-logo-item { padding: 4px 8px; }
            .studio-logo-item img { max-width: 100px; }
        }
    `;

    // --- ЛОГИКА ОТРИСОВКИ ЛОГОТИПОВ СТУДИЙ ---
    function renderStudioLogos(activity, movie) {
        if (!Lampa.Storage.get(STUDIO_STORAGE_KEY + 'enabled', true)) return;
        if (!movie.production_companies || !movie.production_companies.length) return;

        // Ищем место для вставки (совместимо с Applecation)
        let renderTarget = activity.render().find('.full-start__left');
        if (!renderTarget.length) renderTarget = activity.render().find('.full-start__info');
        
        renderTarget.find('.plugin-studio-logos').remove();

        const container = $('<div class="plugin-studio-logos"></div>');
        const iconHeight = Lampa.Storage.get(STUDIO_STORAGE_KEY + 'height', '0.8em');

        movie.production_companies.forEach(company => {
            if (company.logo_path) {
                const logoUrl = 'https://image.tmdb.org/t/p/h30' + company.logo_path;
                const item = $(`<div class="studio-logo-item selector">
                    <img src="${logoUrl}" style="height: ${iconHeight}" />
                </div>`);
                
                // Поддержка клика (телефон) и пульта (ТВ)
                item.on('hover:enter click', () => {
                    Lampa.Noty.show(company.name);
                });

                container.append(item);
            }
        });

        if (container.children().length > 0) {
            renderTarget.append(container);
            
            // Если мы на ТВ, регистрируем контейнер в контроллере навигации
            if (Lampa.Controller.enabled().name === 'full_start') {
                Lampa.Controller.collectionSet(activity.render());
            }
        }
    }

    // --- ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ---
    function initializePlugin() {
        $('<style>').html(styles).appendTo('head');

        // Слушаем событие открытия карточки (Applecation logic)
        Lampa.Listener.follow('full_start', (event) => {
            if (event.type === 'complite') {
                const activity = Lampa.Activity.active();
                const movie = event.data?.movie;

                if (activity && movie) {
                    // 1. Выполняем функции Applecation (рейтинги, логотипы фильма и т.д.)
                    // (Здесь вызываются внутренние методы из вашего applecation.js)
                    
                    // 2. Добавляем логотипы студий
                    setTimeout(() => {
                        renderStudioLogos(activity, movie);
                    }, 100);
                }
            }
        });

        addSettings();
    }

    function addSettings() {
        // Создаем единый пункт настроек
        Lampa.SettingsApi.addComponent({ 
            component: 'apple_hybrid_settings', 
            name: 'Applecation + Студии', 
            icon: PLUGIN_ICON 
        });

        // Параметры Студий
        Lampa.SettingsApi.addParam({
            component: 'apple_hybrid_settings',
            param: { name: STUDIO_STORAGE_KEY + 'enabled', type: 'trigger', default: true },
            field: { name: 'Логотипы студий', description: 'Показывать бренды в карточке' }
        });

        Lampa.SettingsApi.addParam({
            component: 'apple_hybrid_settings',
            param: { 
                name: STUDIO_STORAGE_KEY + 'height', 
                type: 'select', 
                values: { '0.6em': 'Мини', '0.8em': 'Стандарт', '1.1em': 'Крупно' }, 
                default: '0.8em' 
            },
            field: { name: 'Размер логотипов' }
        });

        // Здесь можно добавить остальные переключатели из оригинального Applecation
    }

    // Запуск
    if (window.appready) {
        initializePlugin();
    } else {
        Lampa.Listener.follow('app', (event) => {
            if (event.type === 'ready') initializePlugin();
        });
    }

})();
