(function() {
    'use strict';

    function safeText(str) {
        return (str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    }

    function parseHTML(html) {
        try {
            if (typeof html !== 'string' || !html) return $();
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            return $(doc.body);
        } catch (e) {
            console.error('UaComentsY: Критична помилка в parseHTML:', e);
            return $();
        }
    }

    function getTriggerSafe(key, defaultVal) {
        if (!window.Lampa || !window.Lampa.Storage) return defaultVal;
        var val = window.Lampa.Storage.get(key);
        if (val === undefined || val === null) return defaultVal;
        if (val === 'false' || val === false) return false;
        return true;
    }

    function updateCSSVars() {
        try {
            var root = document.documentElement;
            if (!window.Lampa || !window.Lampa.Storage) return;
            root.style.setProperty('--uacom-width', window.Lampa.Storage.get('uacom_width', '40ch') || '40ch');
            root.style.setProperty('--uacom-lines', window.Lampa.Storage.get('uacom_lines', '3') || '3');
            root.style.setProperty('--uacom-fsize', window.Lampa.Storage.get('uacom_fontsize', '1.15em') || '1.15em');
            root.style.setProperty('--uacom-noty-width', window.Lampa.Storage.get('uacom_noty_width', '800px') || '800px');
            root.style.setProperty('--uacom-noty-fsize', window.Lampa.Storage.get('uacom_noty_fsize', '1.3em') || '1.3em');
        } catch(e) {}
    }

    function InlineComments() {
        this.init = function() {
            Lampa.Listener.follow('full', (e) => {
                if (e.type === 'complite') {
                    // Добавлена небольшая задержка, чтобы Applecation успел отрисовать свои блоки
                    setTimeout(() => {
                        this.render(e.container, e.object);
                    }, 200);
                }
            });
        };

        this.render = function(container, data) {
            try {
                // ПРОВЕРКА НА APPLE_CATION
                // Если на странице есть элементы Applecation, меняем целевой контейнер
                var isApple = $('.applecation').length > 0;
                var target = container;

                if (isApple) {
                    // В Applecation ищем основной скролл-контейнер
                    var appleScroll = $('.applecation').find('.full-start, .applecation__content');
                    if (appleScroll.length) target = appleScroll;
                }

                // Защита от дублирования
                if (target.find('.ua-comments-holder').length) return;

                var movie = data.movie || data;
                if (!movie || !movie.id) return;

                // Создаем холдер для комментариев
                var holder = $('<div class="ua-comments-holder" style="width: 100%; margin-top: 20px; position: relative; z-index: 10;"></div>');
                
                // Интегрируем холдер в конец контента
                target.append(holder);

                // Дальше идет ваша стандартная логика загрузки из оригинального coments.js
                this.inject(holder, movie);

            } catch (err) { 
                console.error('UaComentsY Inject Error:', err); 
            }
        };

        this.inject = function(holder, movie) {
            // Сюда вставляется основной код запроса к API и отрисовки карточек
            // (тот, что делает fetch/ajax на ваши сервера с комментариями)
            holder.append('<div style="padding: 20px; opacity: 0.5;">Завантаження коментарів...</div>');
        };
    }

    // Настройки и запуск остаются прежними
    function createSettings() {
        if (!window.Lampa || !window.Lampa.SettingsApi) return;
        // ... (Ваш код настроек из coments.js без изменений)
    }

    function startPlugin() {
        if (window.uacomentsy_plugin_started) return;
        window.uacomentsy_plugin_started = true;
        updateCSSVars();
        if (window.Lampa) {
            var ic = new InlineComments();
            ic.init();
        }
    }

    if (window.appready) {
        createSettings();
        startPlugin();
    } else {
        Lampa.Listener.follow("app", function (e) {
            if (e.type === "ready") {
                createSettings();
                startPlugin();
            }
        });
    }
})();
