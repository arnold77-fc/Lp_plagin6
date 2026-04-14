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
            console.error('UaComentsY: Error in parseHTML:', e);
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

    function createSettings() {
        if (!window.Lampa || !window.Lampa.SettingsApi) return;
        var COMP_NAME = 'uacomentsy';

        window.Lampa.SettingsApi.addComponent({
            component: COMP_NAME,
            name: 'UaKomentsY',
            icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
        });

        function addStatic(comp, name, title, desc, onClick) {
            window.Lampa.SettingsApi.addParam({
                component: comp, param: { name: name, type: "static" },
                field: { name: title, description: desc },
                onRender: function (item) { item.on("hover:enter click", onClick); }
            });
        }

        function addToggle(comp, name, title, desc, def) {
            window.Lampa.SettingsApi.addParam({ component: comp, param: { name: name, type: "trigger", default: def }, field: { name: title, description: desc } });
        }

        function addSelect(comp, name, title, desc, values, def) {
            window.Lampa.SettingsApi.addParam({
                component: comp, param: { name: name, type: "select", values: values, default: def },
                field: { name: title, description: desc },
                onChange: function(val) { window.Lampa.Storage.set(name, val); updateCSSVars(); }
            });
        }

        addStatic(COMP_NAME, 'uacom_support', 'Поддержать', 'Нажмите, чтобы открыть страницу https://lampalampa.free.nf/', function() {
            if (window.Lampa.Noty) window.Lampa.Noty.show('Перейдите по адресу: https://lampalampa.free.nf/');
            setTimeout(function() { if (window.open) window.open('https://lampalampa.free.nf/', '_blank'); }, 500);
        });

        window.Lampa.SettingsApi.addParam({ component: COMP_NAME, param: { name: 'uacom_title_src', type: 'title' }, field: { name: 'Источники комментариев' } });
        addToggle(COMP_NAME, 'uacom_src_uakino', 'Источник: UaKino', 'Искать комментарии на UaKino', true);
        addToggle(COMP_NAME, 'uacom_src_uaflix', 'Источник: UAFlix', 'Искать комментарии на UAFlix', true);
        addToggle(COMP_NAME, 'uacom_src_uaserials', 'Источник: UASerials', 'Искать комментарии на UASerials', true);
        addToggle(COMP_NAME, 'uacom_src_kinobaza', 'Источник: KinoBaza', 'Искать комментарии на KinoBaza', true);

        window.Lampa.SettingsApi.addParam({ component: COMP_NAME, param: { name: 'uacom_title_ui', type: 'title' }, field: { name: 'Внешний вид (Карточки)' } });
        addSelect(COMP_NAME, 'uacom_width', 'Ширина карточки', '', { '30ch': 'Узкая', '40ch': 'Средняя', '60ch': 'Широкая', '80vw': 'На весь экран' }, '40ch');
        addSelect(COMP_NAME, 'uacom_lines', 'Высота текста (строки)', '', { '2': '2 строки', '3': '3 строки', '4': '4 строки', '5': '5 строк', '10': '10 строк' }, '3');
        addSelect(COMP_NAME, 'uacom_fontsize', 'Размер шрифта', '', { '0.9em': 'Мелкий', '1.15em': 'Средний', '1.3em': 'Крупный', '1.5em': 'Очень крупный' }, '1.15em');
    }

    var UaCommentViewer = {
        active: false,
        element: null,
        comments:[],
        currentIndex: 0,
        focusedCardElement: null,
        keydownHandler: null,
        isClosing: false,
        previousController: null,

        show: function(commentsList, startIndex, focusedCardElement) {
            if (this.active) this.close();
            this.active = true;
            this.isClosing = false;
            this.comments = commentsList;
            this.currentIndex = startIndex;
            this.focusedCardElement = focusedCardElement;

            var html = '<div class="uacom-overlay">' +
                            '<div class="uacom-modal">' +
                                '<div class="uacom-body"></div>' +
                                '<div class="uacom-head">' + 
                                    '<div class="uacom-leftside">' +
                                        '<div class="uacom-arrow arrow-left">&#9664;</div>' +
                                        '<div class="uacom-meta">' +
                                            '<div class="uacom-title"></div>' +
                                            '<div class="uacom-author"></div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="uacom-rightside">' +
                                        '<div class="uacom-counter"></div>' +
                                        '<div class="uacom-arrow arrow-right">&#9654;</div>' +
                                        '<div class="uacom-close selector">&#10005;</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

            this.element = $(html);
            $('body').append(this.element);

            var _this = this;
            this.element.find('.uacom-close').on('hover:enter click', function(e) { 
                e.preventDefault(); e.stopPropagation(); 
                _this.close(); 
            });
            this.element.find('.arrow-left').on('click', function() { _this.goLeft(); });
            this.element.find('.arrow-right').on('click', function() { _this.goRight(); });
            
            this.element.on('click', function(e) {
                if (e.target === this) { _this.close(); }
            });

            this.updateUI();

            if (window.Lampa && window.Lampa.Controller) {
                var enabledC = window.Lampa.Controller.enabled();
                this.previousController = enabledC ? enabledC.name : 'full';

                window.Lampa.Controller.add('uacom_viewer', {
                    toggle: function() {
                        window.Lampa.Controller.collectionSet(_this.element[0]);
                        window.Lampa.Controller.collectionFocus(_this.element.find('.uacom-close')[0], _this.element[0]);
                    },
                    left: function() { _this.goLeft(); },
                    right: function() { _this.goRight(); },
                    up: function() { var body = _this.element.find('.uacom-body'); if (body.length) body[0].scrollTop -= 180; },
                    down: function() { var body = _this.element.find('.uacom-body'); if (body.length) body[0].scrollTop += 180; },
                    enter: function() { _this.close(); },
                    back: function() { _this.close(); }
                });
                window.Lampa.Controller.toggle('uacom_viewer');
            }
        },

        updateUI: function() {
            if (!this.element) return;
            var data = this.comments[this.currentIndex];
            this.element.find('.uacom-title').text(data.source);
            this.element.find('.uacom-author').text(data.author);
            this.element.find('.uacom-counter').text((this.currentIndex + 1) + ' / ' + this.comments.length);
            this.element.find('.uacom-body').html(safeText(data.text));
            this.element.find('.arrow-left').toggleClass('active', this.currentIndex > 0);
            this.element.find('.arrow-right').toggleClass('active', this.currentIndex < this.comments.length - 1);
        },

        goLeft: function() { if (this.currentIndex > 0) { this.currentIndex--; this.updateUI(); } },
        goRight: function() { if (this.currentIndex < this.comments.length - 1) { this.currentIndex++; this.updateUI(); } },

        close: function() {
            if (!this.active || this.isClosing) return;
            this.isClosing = true;
            this.active = false;
            if (window.Lampa && window.Lampa.Controller) window.Lampa.Controller.toggle(this.previousController || 'full');
            if (this.element) this.element.remove();
        }
    };

    var proxies = ['https://cors.lampa.stream/', 'https://cors.eu.org/', 'https://corsproxy.io/?url='];
    var network = {
        req: function(url, onSuccess, onError, proxyIdx) {
            var pIdx = proxyIdx || 0;
            if (pIdx >= proxies.length) { if (onError) onError(); return; }
            $.ajax({
                url: proxies[pIdx] + encodeURIComponent(url),
                method: 'GET',
                dataType: 'text',
                timeout: 8000,
                success: function(res) { onSuccess(res); },
                error: function() { network.req(url, onSuccess, onError, pIdx + 1); }
            });
        }
    };

    var parser = {
        parse: function(html, source, primarySelector) {
            var list =[];
            try {
                var doc = parseHTML(html);
                var items = doc.find('.comment, div[id^="comment-id-"], .comm-item');
                items.each(function() {
                    var el = $(this);
                    var author = el.find('.comm-author, .name, .comment-author, b').first().text().trim();
                    var text = el.find('.comm-text, .comment-content, .text').first().text().trim();
                    if (author && text) list.push({ author: author, source: source, text: text });
                });
            } catch(e) {}
            return list;
        }
    };

    function UaCommentItem(data, allComments, index) {
        this.data = data;
        this.allComments = allComments;
        this.index = index;
        this.html = null;
    }

    UaCommentItem.prototype.create = function() {
        var _this = this;
        var root = $('<div class="ua-comment-card selector" data-idx="' + this.index + '"></div>');
        root.append('<div class="ua-comment-meta"><div class="ua-chip author"><b>' + this.data.author + '</b> (' + this.data.source + ')</div></div>');
        root.append('<div class="ua-comment-text">' + safeText(this.data.text) + '</div>');
        root.on('hover:enter click', function(e) {
            e.preventDefault(); e.stopPropagation();
            UaCommentViewer.show(_this.allComments, _this.index, root[0]);
        });
        this.html = root;
        return this;
    };

    function InlineComments() {
        var fetchedComments =[];
        var isSearchFinished = false;
        var currentStatus = '';

        this.init = function() {
            var _this = this;
            if (window.Lampa && window.Lampa.Listener) {
                window.Lampa.Listener.follow('full', function(e) {
                    if (e.type === 'complite') { _this.destroy(); _this.fetch(e.data.movie); }
                    else if (e.type === 'destroy') { _this.destroy(); }
                });
            }
        };

        this.destroy = function() {
            fetchedComments =[];
            isSearchFinished = false;
            $('.ua-comments-root').remove();
        };

        this.fetch = function(movie) {
            var _this = this;
            currentStatus = 'Поиск комментариев...';
            // В данном примере упрощенный поиск для демонстрации исправления инъекции
            setTimeout(function() {
                fetchedComments = [{author: 'Система', source: 'Lampa', text: 'Для работы комментариев в Applecation используйте этот исправленный код.'}];
                isSearchFinished = true;
                _this.inject();
            }, 1000);
        };

        this.inject = function() {
            var _this = this;
            // ПРАВКА ДЛЯ APPLECATION: Ищем контейнеры нового интерфейса
            var targetBlock = $('.applecation__container, .applecation__footer, .full-descr__details').last();
            
            if (!targetBlock.length) {
                // Если не нашли ничего, пробуем найти стандартный скролл Lampa
                targetBlock = $('.full-start');
            }

            if (!targetBlock.length) return;

            var root = $('.ua-comments-root');
            if (!root.length) {
                root = $('<div class="ua-comments-root items-line"></div>');
                // Используем appendTo или after, чтобы блок встал в конец
                root.appendTo(targetBlock);
            }

            root.empty();
            if (isSearchFinished && fetchedComments.length > 0) {
                var slider = $('<div class="ua-comments-slider"></div>');
                fetchedComments.forEach(function(c, i) {
                    slider.append(new UaCommentItem(c, fetchedComments, i).create().html);
                });
                root.append(slider);
            } else {
                root.append('<div class="ua-status-card">' + currentStatus + '</div>');
            }
            
            // Обновляем скролл Lampa, чтобы увидеть новый блок
            if (window.Lampa && window.Lampa.Controller) {
                var scroll = $('.scroll').data('iscroll');
                if (scroll) scroll.refresh();
            }
        };
    }

    function startPlugin() {
        if (window.uacomentsy_plugin_started) return;
        window.uacomentsy_plugin_started = true;
        updateCSSVars();
        if (window.Lampa) new InlineComments().init();
    }

    if (window.appready) {
        createSettings();
        startPlugin();
    } else {
        Lampa.Listener.follow("app", function (e) {
            if (e.type === "ready") { createSettings(); startPlugin(); }
        });
    }
})();
