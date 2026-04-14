(function() {
    'use strict';

    function safeText(str) {
        return (str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    }

    function updateCSSVars() {
        try {
            var root = document.documentElement;
            if (!window.Lampa || !window.Lampa.Storage) return;
            root.style.setProperty('--uacom-width', window.Lampa.Storage.get('uacom_width', '40ch'));
            root.style.setProperty('--uacom-lines', window.Lampa.Storage.get('uacom_lines', '3'));
            root.style.setProperty('--uacom-fsize', window.Lampa.Storage.get('uacom_fontsize', '1.15em'));
        } catch(e) {}
    }

    // Добавление настроек
    function createSettings() {
        if (!window.Lampa || !window.Lampa.SettingsApi) return;
        var COMP_NAME = 'uacomentsy';

        window.Lampa.SettingsApi.addComponent({
            component: COMP_NAME,
            name: 'UaKomentsY',
            icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
        });

        window.Lampa.SettingsApi.addParam({
            component: COMP_NAME,
            param: { name: 'uacom_width', type: "select", values: {'30ch':'Узкая','40ch':'Средняя','60ch':'Широкая'}, default: '40ch' },
            field: { name: 'Ширина карточки', description: 'Размер блока комментариев' },
            onChange: function() { updateCSSVars(); }
        });
    }

    function InlineComments() {
        var _this = this;
        var fetchedComments = [{author: 'Система', source: 'Lampa', text: 'Если вы видите это сообщение, значит плагин подключен и работает в интерфейсе Applecation.'}];

        this.init = function() {
            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') { 
                    setTimeout(function() { _this.inject(); }, 500); 
                }
            });
        };

        this.inject = function() {
            try {
                // ПРАВКА: Ищем контейнер Applecation или стандартный Lampa
                var target = $('.applecation__container, .applecation__footer, .full-descr__details').last();
                
                if (!target.length) target = $('.full-start');
                if (!target.length) return;

                $('.ua-comments-root').remove();

                var root = $('<div class="ua-comments-root items-line"></div>');
                var slider = $('<div class="ua-comments-slider" style="display: flex; overflow-x: auto; padding: 10px 0;"></div>');

                fetchedComments.forEach(function(comment) {
                    var card = $('<div class="ua-comment-card selector" style="background: rgba(255,255,255,0.1); margin-right: 15px; padding: 15px; border-radius: 15px; min-width: 300px;">' +
                        '<div style="font-weight: bold; margin-bottom: 5px;">' + comment.author + '</div>' +
                        '<div style="font-size: 0.9em; opacity: 0.8;">' + safeText(comment.text) + '</div>' +
                    '</div>');
                    slider.append(card);
                });

                root.append(slider);
                target.after(root); // Вставляем ПОСЛЕ контейнера Applecation

                // Обновляем скролл
                var scroll = $('.scroll').data('iscroll');
                if (scroll) scroll.refresh();
            } catch (err) { console.error('UaComentsY Inject Error:', err); }
        };
    }

    // Запуск
    function startPlugin() {
        if (window.uacomentsy_plugin_started) return;
        window.uacomentsy_plugin_started = true;
        updateCSSVars();
        new InlineComments().init();
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
