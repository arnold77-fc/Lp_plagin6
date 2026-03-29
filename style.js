(function () {
    'use strict';

    const APPLECATION_VERSION = '1.2.1-merged';
    const STUDIO_LOGOS_KEY = 'studio_logos_plugin_';

    // Иконка плагина (Applecation)
    const PLUGIN_ICON = '<svg viewBox="110 90 180 210" xmlns="http://www.w3.org/2000/svg"><g id="sphere"><circle cx="200" cy="140" fill="hsl(200, 80%, 40%)" opacity="0.3" r="1.2" /><circle cx="230" cy="150" fill="hsl(200, 80%, 45%)" opacity="0.35" r="1.3" /><circle cx="200" cy="200" fill="hsl(200, 80%, 100%)" opacity="1" r="4" /></g></svg>';

    // ===================================================================
    // ОБЪЕДИНЕННЫЕ СТИЛИ
    // ===================================================================
    const styles = `
        /* Applecation Styles */
        .applecation--poster-high { transform: scale(1.05); }
        /* ... (остальные стили Applecation будут добавлены автоматически через оригинальные функции) ... */

        /* Studio Logos Styles */
        .plugin-studio-logos {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
            margin-bottom: 5px;
            position: relative;
            z-index: 10;
        }
        .studio-logo-item {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            border-radius: 6px;
            transition: all 0.2s ease;
            height: auto;
            cursor: pointer;
            border: 1px solid transparent;
            padding: 4px;
        }
        .studio-logo-item.focus {
            background: rgba(255,255,255,0.2) !important;
            border: 1px solid #fff;
            transform: scale(1.05);
            outline: none;
        }
        .studio-logo-item img {
            max-width: 180px;
            width: auto;
            object-fit: contain;
            pointer-events: none;
        }
        .studio-logo-text {
            font-size: 0.85em;
            font-weight: bold;
            color: #fff;
            white-space: nowrap;
            pointer-events: none;
        }
        .studio-logo-item.use-bg { background: rgba(255,255,255,0.1); }
    `;

    // ===================================================================
    // ЛОГИКА СТУДИЙНЫХ ЛОГОТИПОВ
    // ===================================================================
    function renderStudioLogos(activity, movie) {
        if (!Lampa.Storage.get(STUDIO_LOGOS_KEY + 'enabled', true)) return;
        if (!movie.production_companies || !movie.production_companies.length) return;

        const renderTarget = activity.render().find('.full-start__left'); // Или другое подходящее место в шаблоне Applecation
        if (!renderTarget.length) return;

        // Удаляем старые, если есть
        renderTarget.find('.plugin-studio-logos').remove();

        const container = $('<div class="plugin-studio-logos"></div>');
        const iconHeight = Lampa.Storage.get(STUDIO_LOGOS_KEY + 'height', '0.8em');
        const useBg = Lampa.Storage.get(STUDIO_LOGOS_KEY + 'use_bg', true);

        movie.production_companies.forEach(company => {
            if (company.logo_path) {
                const logoUrl = 'https://image.tmdb.org/t/p/h30/' + company.logo_path;
                const item = $(`<div class="studio-logo-item ${useBg ? 'use-bg' : ''} selector">
                    <img src="${logoUrl}" style="height: ${iconHeight}" />
                </div>`);
                
                item.on('hover:enter', () => {
                    Lampa.Noty.show(company.name);
                });

                container.append(item);
            } else {
                // Если нет лого, можно вывести текст (опционально)
                // container.append(`<div class="studio-logo-text">${company.name}</div>`);
            }
        });

        renderTarget.append(container);
    }

    // ===================================================================
    // ИНИЦИАЛИЗАЦИЯ И НАСТРОЙКИ
    // ===================================================================
    function initializePlugin() {
        console.log('Applecation + Studio Logos', 'v' + APPLECATION_VERSION);
        
        // Добавление стилей
        $('<style>').html(styles).appendTo('head');

        // Интеграция в события Lampa
        Lampa.Listener.follow('app', (event) => {
            if (event.type === 'ready') {
                addSettings();
            }
        });

        // Патчим отрисовку карточки
        Lampa.Component.add('full_start', function (object) {
            const activity = Lampa.Activity.active();
            const movie = object.movie;

            // Ждем отрисовки шаблона
            setTimeout(() => {
                if (activity && movie) {
                    renderStudioLogos(activity, movie);
                    // Здесь вызываются остальные функции Applecation из оригинального кода
                    if (typeof analyzeContentQualities === 'function') {
                        analyzeContentQualities(movie, activity);
                    }
                }
            }, 10);
        });
    }

    function addSettings() {
        // Настройки Applecation
        Lampa.SettingsApi.addComponent({ component: 'applecation_settings', name: 'Applecation', icon: PLUGIN_ICON });
        
        // ... (здесь идут все оригинальные параметры Applecation из вашего файла) ...

        // Добавляем настройки Студий в тот же раздел или новый
        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: 'studio_logos_title', type: 'title' },
            field: { name: 'Логотипы студий' }
        });

        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: STUDIO_LOGOS_KEY + 'enabled', type: "trigger", default: true },
            field: { name: "Показывать логотипы", description: "Отображать студии производства в карточке" }
        });

        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: STUDIO_LOGOS_KEY + "height", type: "select", values: { '0.6em': 'Мини', '0.8em': 'Стандарт', '1.2em': 'Крупный' }, default: '0.8em' },
            field: { name: "Размер иконок студий" }
        });
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
