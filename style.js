(function () {
    'use strict';

    // Версии и метаданные
    const APPLECATION_VERSION = '1.2.1';
    const STUDIO_LOGOS_VERSION = '1.0.0';
    const COMBINED_VERSION = '2.2.0';
    const STUDIO_STORAGE_KEY = 'studio_logos_plugin_';

    // Иконка плагина (Applecation)
    const PLUGIN_ICON = '<svg viewBox="110 90 180 210"xmlns=http://www.w3.org/2000/svg><g id=sphere><circle cx=200 cy=140 fill="hsl(200, 80%, 40%)"opacity=0.3 r=1.2 /><circle cx=230 cy=150 fill="hsl(200, 80%, 45%)"opacity=0.35 r=1.3 /><circle cx=170 cy=155 fill="hsl(200, 80%, 42%)"opacity=0.32 r=1.2 /><circle cx=245 cy=175 fill="hsl(200, 80%, 48%)"opacity=0.38 r=1.4 /><circle cx=155 cy=180 fill="hsl(200, 80%, 44%)"opacity=0.34 r=1.3 /><circle cx=215 cy=165 fill="hsl(200, 80%, 46%)"opacity=0.36 r=1.2 /><circle cx=185 cy=170 fill="hsl(200, 80%, 43%)"opacity=0.33 r=1.3 /><circle cx=260 cy=200 fill="hsl(200, 80%, 50%)"opacity=0.4 r=1.5 /><circle cx=140 cy=200 fill="hsl(200, 80%, 50%)"opacity=0.4 r=1.5 /><circle cx=250 cy=220 fill="hsl(200, 80%, 48%)"opacity=0.38 r=1.4 /><circle cx=150 cy=225 fill="hsl(200, 80%, 47%)"opacity=0.37 r=1.4 /><circle cx=235 cy=240 fill="hsl(200, 80%, 45%)"opacity=0.35 r=1.3 /><circle cx=165 cy=245 fill="hsl(200, 80%, 44%)"opacity=0.34 r=1.3 /><circle cx=220 cy=255 fill="hsl(200, 80%, 42%)"opacity=0.32 r=1.2 /><circle cx=180 cy=258 fill="hsl(200, 80%, 41%)"opacity=0.31 r=1.2 /><circle cx=200 cy=120 fill="hsl(200, 80%, 60%)"opacity=0.5 r=1.8 /><circle cx=240 cy=135 fill="hsl(200, 80%, 65%)"opacity=0.55 r=2 /><circle cx=160 cy=140 fill="hsl(200, 80%, 62%)"opacity=0.52 r=1.9 /><circle cx=270 cy=165 fill="hsl(200, 80%, 70%)"opacity=0.6 r=2.2 /><circle cx=130 cy=170 fill="hsl(200, 80%, 67%)"opacity=0.57 r=2.1 /><circle cx=255 cy=190 fill="hsl(200, 80%, 72%)"opacity=0.62 r=2.3 /><circle cx=145 cy=195 fill="hsl(200, 80%, 69%)"opacity=0.59 r=2.2 /><circle cx=280 cy=200 fill="hsl(200, 80%, 75%)"opacity=0.65 r=2.5 /><circle cx=120 cy=200 fill="hsl(200, 80%, 75%)"opacity=0.65 r=2.5 /><circle cx=275 cy=215 fill="hsl(200, 80%, 73%)"opacity=0.63 r=2.4 /><circle cx=125 cy=220 fill="hsl(200, 80%, 71%)"opacity=0.61 r=2.3 /><circle cx=260 cy=235 fill="hsl(200, 80%, 68%)"opacity=0.58 r=2.2 /><circle cx=140 cy=240 fill="hsl(200, 80%, 66%)"opacity=0.56 r=2.1 /><circle cx=245 cy=255 fill="hsl(200, 80%, 63%)"opacity=0.53 r=2 /><circle cx=155 cy=260 fill="hsl(200, 80%, 61%)"opacity=0.51 r=1.9 /><circle cx=225 cy=270 fill="hsl(200, 80%, 58%)"opacity=0.48 r=1.8 /><circle cx=175 cy=272 fill="hsl(200, 80%, 56%)"opacity=0.46 r=1.7 /><circle cx=200 cy=100 fill="hsl(200, 80%, 85%)"opacity=0.8 r=2.8 /><circle cx=230 cy=115 fill="hsl(200, 80%, 90%)"opacity=0.85 r=3 /><circle cx=170 cy=120 fill="hsl(200, 80%, 87%)"opacity=0.82 r=2.9 /><circle cx=250 cy=140 fill="hsl(200, 80%, 92%)"opacity=0.88 r=3.2 /><circle cx=150 cy=145 fill="hsl(200, 80%, 89%)"opacity=0.84 r=3.1 /><circle cx=265 cy=170 fill="hsl(200, 80%, 95%)"opacity=0.9 r=3.4 /><circle cx=135 cy=175 fill="hsl(200, 80%, 93%)"opacity=0.87 r=3.3 /><circle cx=275 cy=200 fill="hsl(200, 80%, 98%)"opacity=0.95 r=3.5 /><circle cx=125 cy=200 fill="hsl(200, 80%, 98%)"opacity=0.95 r=3.5 /><circle cx=200 cy=200 fill="hsl(200, 80%, 100%)"opacity=1 r=4 /><circle cx=220 cy=195 fill="hsl(200, 80%, 98%)"opacity=0.95 r=3.8 /><circle cx=180 cy=205 fill="hsl(200, 80%, 97%)"opacity=0.93 r=3.7 /><circle cx=240 cy=210 fill="hsl(200, 80%, 96%)"opacity=0.92 r=3.6 /><circle cx=160 cy=215 fill="hsl(200, 80%, 95%)"opacity=0.9 r=3.5 /><circle cx=270 cy=230 fill="hsl(200, 80%, 94%)"opacity=0.88 r=3.4 /><circle cx=130 cy=235 fill="hsl(200, 80%, 92%)"opacity=0.86 r=3.3 /><circle cx=255 cy=250 fill="hsl(200, 80%, 90%)"opacity=0.84 r=3.2 /><circle cx=145 cy=255 fill="hsl(200, 80%, 88%)"opacity=0.82 r=3.1 /><circle cx=235 cy=265 fill="hsl(200, 80%, 86%)"opacity=0.8 r=3 /><circle cx=165 cy=268 fill="hsl(200, 80%, 84%)"opacity=0.78 r=2.9 /><circle cx=215 cy=280 fill="hsl(200, 80%, 82%)"opacity=0.76 r=2.8 /><circle cx=185 cy=282 fill="hsl(200, 80%, 80%)"opacity=0.74 r=2.7 /><circle cx=200 cy=290 fill="hsl(200, 80%, 78%)"opacity=0.72 r=2.6 /><circle cx=210 cy=130 fill="hsl(200, 80%, 88%)"opacity=0.83 r=2.5 /><circle cx=190 cy=135 fill="hsl(200, 80%, 86%)"opacity=0.81 r=2.4 /><circle cx=225 cy=155 fill="hsl(200, 80%, 91%)"opacity=0.86 r=2.8 /><circle cx=175 cy=160 fill="hsl(200, 80%, 89%)"opacity=0.84 r=2.7 /><circle cx=245 cy=185 fill="hsl(200, 80%, 94%)"opacity=0.89 r=3.3 /><circle cx=155 cy=190 fill="hsl(200, 80%, 92%)"opacity=0.87 r=3.2 /><circle cx=260 cy=210 fill="hsl(200, 80%, 95%)"opacity=0.91 r=3.4 /><circle cx=140 cy=215 fill="hsl(200, 80%, 93%)"opacity=0.88 r=3.3 /><circle cx=250 cy=230 fill="hsl(200, 80%, 91%)"opacity=0.85 r=3.2 /><circle cx=150 cy=235 fill="hsl(200, 80%, 89%)"opacity=0.83 r=3.1 /><circle cx=230 cy=245 fill="hsl(200, 80%, 87%)"opacity=0.81 r=3 /><circle cx=170 cy=250 fill="hsl(200, 80%, 85%)"opacity=0.79 r=2.9 /><circle cx=210 cy=260 fill="hsl(200, 80%, 83%)"opacity=0.77 r=2.8 /><circle cx=190 cy=265 fill="hsl(200, 80%, 81%)"opacity=0.75 r=2.7 /></g></svg>';

    // ===================================================================
    // ОБЪЕДИНЕННЫЕ СТИЛИ (CSS)
    // ===================================================================
    var styles = `
        /* Стили Applecation */
        .applecation-layout .full-start { padding-top: 5vh !important; }
        .applecation__quality-badges { display: flex; gap: 8px; margin-top: 15px; }
        
        /* Стили логотипов студий */
        .plugin-studio-logos {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 12px;
            margin-bottom: 8px;
            position: relative;
            z-index: 10;
        }
        .studio-logo-item {
            display: inline-flex;
            align-items: center;
            border-radius: 6px;
            transition: all 0.2s ease;
            cursor: pointer;
            border: 1px solid transparent;
            padding: 2px 6px;
        }
        .studio-logo-item.focus {
            background: rgba(255,255,255,0.2) !important;
            border: 1px solid #fff;
            transform: scale(1.05);
            outline: none;
        }
        .studio-logo-item img {
            max-width: 160px;
            height: auto;
            object-fit: contain;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        /* Жидкое стекло */
        body:not(.applecation--no-liquid-glass) .card.focus {
            backdrop-filter: blur(12px);
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
        }
    `;

    // ===================================================================
    // ФУНКЦИИ ЛОГОТИПОВ СТУДИЙ (Из logo_studio.js)
    // ===================================================================
    function renderStudioLogos(activity, movie) {
        if (!Lampa.Storage.field(STUDIO_STORAGE_KEY + 'enabled')) return;
        
        let container = activity.component().render().find('.full-start__left');
        if (!container.length) container = activity.component().render().find('.full-start__info');

        if (movie.production_companies && movie.production_companies.length) {
            let logosContainer = $('<div class="plugin-studio-logos"></div>');
            let useBg = Lampa.Storage.field(STUDIO_STORAGE_KEY + 'use_bg');
            let iconHeight = Lampa.Storage.field(STUDIO_STORAGE_KEY + 'height') || '0.8em';

            movie.production_companies.forEach(studio => {
                if (studio.logo_path) {
                    let item = $(`<div class="studio-logo-item selectors-item" style="${useBg ? 'background: rgba(255,255,255,0.05);' : ''}">
                        <img src="https://image.tmdb.org/t/p/h60${studio.logo_path}" style="height: ${iconHeight}">
                    </div>`);
                    
                    item.on('hover:enter', () => {
                        Lampa.Activity.push({
                            url: '',
                            title: 'Студия: ' + studio.name,
                            component: 'category_full',
                            id: studio.id,
                            source: 'tmdb',
                            card_type: 'movie',
                            type: 'movie',
                            page: 1,
                            method: 'company'
                        });
                    });
                    logosContainer.append(item);
                }
            });

            if (logosContainer.children().length > 0) {
                container.append(logosContainer);
                // Добавляем в контроллер Lampa для навигации пультом
                if (activity.component().controller) {
                    activity.component().render().find('.selectors-item').unbind('hover:focus').bind('hover:focus', function() {
                        Lampa.Controller.collectionSet(activity.component().render());
                    });
                }
            }
        }
    }

    // ===================================================================
    // ЯДРО ПЛАГИНА (Applecation)
    // ===================================================================

    // ... Здесь идет полный блок встроенных рейтингов (MDBListProvider, KinopoiskProvider и т.д.) ...
    // ... Анализ качества контента (analyzeContentQualities) ...

    function initializePlugin() {
        console.log('Applecation + Studio Logos Combined', 'v' + COMBINED_VERSION);
        
        $('<style>').text(styles).appendTo('head');

        // Основной хук на открытие карточки
        Lampa.Listener.follow('full', function (event) {
            if (event.type === 'complite') {
                const activity = event.object;
                const movie = event.data.movie;
                const render = activity.component().render();

                render.addClass('applecation-layout');

                // 1. Отрисовываем студии (вызываем перед рейтингами)
                renderStudioLogos(activity, movie);

                // 2. Инициализируем визуальные эффекты Applecation
                const posterSize = Lampa.Storage.field('poster_size');
                render.toggleClass('applecation--poster-high', posterSize === 'w500');

                // 3. Загружаем рейтинги и логотипы (код из applecation.js)
                if (movie) {
                    // loadAndDisplayRatings(activity, movie); // Внутренняя функция из вашего файла
                    // analyzeContentQualities(movie, activity); // Внутренняя функция анализа торрентов
                }
            }
        });

        initCombinedSettings();
    }

    function initCombinedSettings() {
        // Главный раздел Applecation
        Lampa.SettingsApi.addComponent({ 
            component: 'applecation_settings', 
            name: 'Applecation + Студии', 
            icon: PLUGIN_ICON 
        });

        // Настройки студий (интегрированы)
        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: 'studio_logos_title', type: 'title' },
            field: { name: 'Логотипы киностудий' }
        });

        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: STUDIO_STORAGE_KEY + 'enabled', type: "trigger", default: true },
            field: { name: "Показывать логотипы", description: "Отображать студии производства в карточке" }
        });

        Lampa.SettingsApi.addParam({
            component: 'applecation_settings',
            param: { name: STUDIO_STORAGE_KEY + "height", type: "select", values: { '0.6em': 'Мини', '0.8em': 'Стандарт', '1.2em': 'Крупный' }, default: '0.8em' },
            field: { name: "Размер иконок студий" }
        });

        // ... Далее все остальные параметры из Applecation (рейтинги, ключи API и т.д.) ...
    }

    // Запуск
    if (window.appready) initializePlugin();
    else Lampa.Listener.follow('app', (e) => { if (e.type === 'ready') initializePlugin(); });

})();
