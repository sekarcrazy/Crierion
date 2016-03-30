
!function ($) {

    "use strict";

    /* LIST CLASS DEFINITION
     * ========================= */
    https://github.com/triceam/MegaList/issues/2
    // shim layer with setTimeout faag161llback
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback) {
                        //using 1 ms for mobile device latency
                        window.setTimeout(callback, 1);
                    };
        })();

    var Megalist = function (element) {
        this.touchSupported = false;
        this.$el = null;
        this.init(element);
    };



    Megalist.prototype = {

        animating: false,

        constructor: Megalist,

        init: function (element) {

            this.vendorPrefix = this.getVendorPrefix();
            var self = this;

            //params used in detecting "click" action - without collision of DOM events            
            this.MAX_CLICK_DURATION_MS = 350;
            this.MAX_MOUSE_POSITION_FLOAT_PX = 10;
            this.MAX_TOUCH_POSITION_FLOAT_PX = 10;

            this.SCROLLBAR_BORDER = 1;
            this.SCROLLBAR_MIN_SIZE = 20;
            this.onScoll = false;

            this.RESIZE_TIMEOUT_DELAY = 100;

            this.processedItems = {};
            this.totalItems = [];
            this.itemHeight = -1;
            this.reorderstarted = false;
            this.mouseMoved = false;
            this.reorderSupported = false;
            this.source = null;
            this.destination = null;
            this.scrollOffset = null;

            this.touchSupported = ("onorientationchange" in window);
            this.$el = $(element);
            this.$ul = this.$el.find("ul");
            this.$scrollbar = $("<div id='scrollbar'></div>");
            this.reorderDragElement = null;

            if (this.$ul.length <= 0) {
                this.$ul = $("<ul />");
                this.$el.append(this.$ul);
            }
            this.$el.append(this.$scrollbar);


            this.dataProvider = this.$ul.find("li");
            this.listItems = (this.dataProvider.length > 0) ? this.dataProvider : $();

            this.listItems.each(function (i) {
                if (i === 0) {
                    self.itemHeight = $(this).outerHeight();
                }
                $(this).addClass("megalistItem");
                $(this).remove();
            });

            this.$ul.css("visibility", "visible");

            this.yPosition = 0;
            this.updateLayout();
            this.scrollVisible = false;
            this.timerGoingOn = false;
            this.scrollPoistion = {};
            this.isScrollStart = false;
            this.timer;
            this.mouseWheeltimer;
            this.scrollReorderTimer;
            this.mousewheel = false;
            this.resizeHandler = function (event) { return self.onResize(event); };
            this.touchStartHandler = function (event) { return self.onTouchStart(event); };
            this.megalistItemReorderstartedHandler = function (event) { return self.megalistItemReorderstarted(event); };
            this.megalistItemReorderMoveHandler = function (event) { return self.megalistItemReorderMove(event); };
            this.megalistItemReorderEndHandler = function (event) { return self.reorderEndHandler(event); };
            this.megalistItemhover = function (event) { return self.hover(event); };
            this.megalistItemleave = function (event) { return self.leave(event); };
            this.touchMoveHandler = function (event) { return self.onTouchMove(event); };
            this.touchEndHandler = function (event) { return self.onTouchEnd(event); };
            //  this.reorderEndHandler = function (event) { return self.reorderEndHandler(event); };
            this.TOUCH_START = this.touchSupported ? "touchstart" : "mousedown";
            this.TOUCH_MOVE = this.touchSupported ? "touchmove" : "mousemove";
            this.TOUCH_END = this.touchSupported ? "touchend" : "mouseup";
            this.MOUSE_WHEEL = (navigator.userAgent.search("Fire") < 0) ? "mousewheel" : "DOMMouseScroll";
            //   $(window).off("resize");
            $(window).resize(this.resizeHandler);
            this.$el.bind("gesturestart", function (event) { event.preventDefault(); return false; });
            this.$el.bind(this.TOUCH_START, this.touchStartHandler);
            //  this.enableReorder
            //this.$el.bind('mouseup', this.megalistItemReorderEndHandler);
            this.$el.bind(this.MOUSE_WHEEL, function (event) { event.preventDefault(); return self.onMouseWheel(event); });
            this.scrollbarMouseEnterHandler = function (event) { return self.scrollbarMouseEnter(event); };
            this.scrollbarMouseLeaveHandler = function (event) { return self.scrollbarMouseLeave(event); };
            this.scrollbarMouseMoveHandler = function (event) { return self.scrollbarMouseMove(event); };
            if (!this.touchSupported) {
                var sbWidth = parseInt(this.$scrollbar.css("width"), 10);
                // this.$scrollbar.css("width", 1.25 * sbWidth);
                this.scrollbarStartHandler = function (event) { return self.scrollbarTouchStart(event); };
                this.scrollbarMoveHandler = function (event) { return self.scrollbarTouchMove(event); };
                this.scrollbarEndHandler = function (event) { return self.scrollbarTouchEnd(event); };
                this.$scrollbar.bind(this.TOUCH_START, this.scrollbarStartHandler);
                this.$el.on('mouseleave', this.scrollbarMouseLeaveHandler);
                this.$el.on('mouseenter', this.scrollbarMouseEnterHandler);
                this.$scrollbar.fadeOut('fast');
            }
            else {
                this.$scrollbar.fadeTo(0, 0);
            }

            this.inputCoordinates = null;
            this.velocity = { distance: 0, lastTime: 0, timeDelta: 0 };
            // this.cleanupEventHandlers();
        },
        scrollbarMouseEnter: function (event) {
            if (this.$el.find('#scrollbar').length > 0) {
                if (!this.scrollVisible && !this.timerGoingOn && !this.mousewheel) {
                    this.$scrollbar.fadeIn('fast');
                    this.scrollVisible = true;
                    this.resolveScrollBarVisibility(event);
                }
                this.$el.on('mousemove', this.scrollbarMouseMoveHandler);
            }
        },

        setScrollOffset: function (value) {
            this.scrollOffset = value;
        },

        getDragElementID: function (ev, addevent) {
            var target = ev.target;
            while (target.parentNode != undefined) {
                var id = $(target).attr("id");
                if (target.nodeName === "DIV" && id && id !== '') {
                    break;
                }
                target = target.parentNode;
            }
            var id = $(target).attr('id');
            var folder = $(target).find('.disabledrag');
            if (addevent) {
                $(target).bind('mousemove', mouseMoveEvent);
            }
            else {
                $(target).unbind('mousemove', mouseMoveEvent);
            }
            if (folder !== null && folder !== undefined && folder.length > 0) {
                id = null;
            }
            return id;
        },
        hover: function (event) {
            var listItem = this.getListItem(event);
            $(listItem).find('#dummyroot').addClass('reorderIndicator_hover');
        },

        leave: function (event) {
            var listItem = this.getListItem(event);
            $(listItem).find('#dummyroot').removeClass('reorderIndicator_hover');
        },

        //sonu
        megalistItemReorderstarted: function (event) {
            if (!(event.target.id && (event.target.id === 'deleteicon' || event.target.id === 'levelLink' || event.target.id === 'dalexpander' || event.target.id === 'check' || event.target.id === 'radio')) && this.reorderSupported) {
                var listItem = this.getListItem(event);
                if (listItem) {
                    var sourceIndex = $(listItem).attr('list-index');
                    if (sourceIndex && sourceIndex >= 0 && this.dataProvider && this.dataProvider.length >= sourceIndex) {
                        this.source = this.dataProvider[sourceIndex];
                        if (this.source && !this.source.DALParentKey) {
                            this.reorderDragElement = $("<div class='reorderCue'><div></div><ul class='reorderItem'><li> " + this.source.name + "</li></ul></div>");
                            this.reorderDragElement.addClass('dragCue');
                            this.reorderstarted = true;
                            this.mouseMoved = false;
                            // this.$scrollbar.fadeIn('fast');
                            $(document).bind('mousemove', this.megalistItemReorderMoveHandler);
                            $(document).bind('mouseup', this.megalistItemReorderEndHandler);
                            // this.$el.addClass('isReorderScrollDown');
                        }
                    }
                }
            }
        },

        getListItem: function (ev) {
            var target = ev.target;
            while (target.parentNode != undefined) {
                if (target.nodeName === "LI") {
                    break;
                }
                target = target.parentNode;
            }
            return target;
        },

        getListItemfromElement: function (el) {
            var target = el;
            while (target.parentNode != undefined) {
                if (target.nodeName === "LI") {
                    break;
                }
                target = target.parentNode;
            }
            return target;
        },

        megalistItemReorderMove: function (ev) {
            if (this.reorderstarted && this.reorderSupported) {
                if (!this.mouseMoved) {
                    this.$scrollbar.fadeIn('fast');
                    if (!this.$el.hasClass('isReorderScrollDown')) {
                        this.$el.addClass('isReorderScrollDown');
                    }
                    this.mouseMoved = true;
                }
                $($(document)[0].body).append(this.reorderDragElement);
                $($(document)[0].body).css('cursor', 'pointer!important');
                //  inputCoordinates = this.getInputCoordinates(ev);
                var x = ev.clientX + 13, y = ev.clientY + 3;// - 21;
                this.reorderDragElement.css('left', x + 'px');
                this.reorderDragElement.css('top', y + 'px');
                var self = this;
                // this.setReorderIndicator(event, 0);
                if (this.isScrollingDown(ev)) {
                    //this.$el.removeClass('isReorderScrollUp');
                    //this.$el.addClass('isReorderScrollDown');
                    if (!this.onScoll) {
                        var scrollOffSet = 2 * this.itemHeight;
                        this.yPosition += scrollOffSet;
                        this.autoScroll(self, true, ev);
                    }
                }
                else if (this.isScrollingUp(ev)) {
                    //this.$el.removeClass('isReorderScrollDown');
                    //this.$el.addClass('isReorderScrollUp');
                    if (!this.onScoll) {
                        var scrollOffSet = 2 * this.itemHeight;
                        this.yPosition -= scrollOffSet;
                        this.autoScroll(self, false, ev);
                    }
                }
                else {
                    //this.reorderstarted = false;
                    //this.reorderDragElement.remove();
                    //this.reorderDragElement = null;
                    clearInterval(self.scrollReorderTimer);
                    self.onScoll = false;
                }
            }
        },

        scrollDown: function (event) {
            var scrollOffSet = 2 * this.itemHeight;
            this.yPosition += scrollOffSet;
            this.updateLayOutWhileReorder(event);
        },

        scrollUp: function (event) {
            var scrollOffSet = 2 * this.itemHeight;
            this.yPosition -= scrollOffSet;
            this.updateLayOutWhileReorder(event);
        },

        autoScroll: function (self, isScrollDown, event) {
            var event = event;
            var self = self;
            var isScrollDown = isScrollDown;
            self.onScoll = true;
            this.updateLayOutWhileReorder(event);
            clearTimeout(this.timer);
            clearInterval(this.scrollReorderTimer);
            clearTimeout(this.cleanupTimeout);
            this.cleanupTimeout = setTimeout(function () {
                self.cleanupListItems();
            }, 100);

            this.scrollReorderTimer = setInterval(function () {
                if (isScrollDown) {
                    self.scrollDown(event);
                    // self.setReorderIndicator(event,26);
                }
                else {
                    self.scrollUp(event);
                    //self.setReorderIndicator(event, -26);
                }
            }, 500);
        },

        setReorderIndicator: function (event, offset) {
            var list = document.elementFromPoint(event.clientX, event.clientY);
            var listItem = this.getListItemfromElement(list);
            this.$el.find('#dummyroot').removeClass('reorderIndicator_hover');
            $(listItem).find('#dummyroot').addClass('reorderIndicator_hover');
        },
        updateLayOutWhileReorder: function (event) {
            var maxPosition = ((this.dataProvider.length) * this.itemHeight) - this.$el.height();
            if (this.yPosition > maxPosition) {
                this.yPosition = maxPosition + this.itemHeight;
            }
            if (this.yPosition < 0) {
                this.yPosition = 0;
            }
            this.updateLayout();

        },

        isScrollingDown: function (event) {
            var isScroll = false;
            var bottomPosition = this.$el.offset().top + this.$el.height();
            var offset = 2 * this.itemHeight;
            if (event.pageY && (event.pageY > bottomPosition - offset) && event.pageY < bottomPosition) {
                isScroll = true;
            }
            return isScroll;
        },
        isScrollingUp: function (event) {
            var isScroll = false;
            var bottomPosition = this.$el.offset().top;
            var offset = 2 * this.itemHeight;
            if (event.pageY && (event.pageY < bottomPosition + offset) && (event.pageY > bottomPosition)) {
                isScroll = true;
            }
            return isScroll;
        },

        reorderEndHandler: function (event) {
            if (this.reorderSupported) {
                this.onScoll = false;
                $(document).unbind('mousemove', this.megalistItemReorderMoveHandler);
                $(document).unbind('mouseup', this.megalistItemReorderEndHandler);
                this.$el.removeClass('isReorderScrollDown');

                if (this.reorderstarted) {
                    this.reorderstarted = false;
                    if (this.mouseMoved) {
                        this.reorderDragElement.remove();
                        this.reorderDragElement = null;
                        clearInterval(this.scrollReorderTimer);
                        var listItem = this.getListItem(event);
                        if (listItem) {
                            var destinationIndex = $(listItem).attr('list-index');
                            if (!destinationIndex) {
                                if (event.target.id === this.$el[0].id || event.target.nodeName === 'UL') {
                                    destinationIndex = this.dataProvider.length - 1;
                                }
                            }
                            if (destinationIndex && destinationIndex >= 0 && this.dataProvider && this.dataProvider.length >= destinationIndex) {
                                this.destination = this.dataProvider[destinationIndex];
                                var firstMemberUniqueKey = '';
                                var firstDiv = this.$el.find('li').first().find('div[memberuniquekey]');
                                if (firstDiv && firstDiv.length > 0) {
                                    firstMemberUniqueKey = firstDiv.attr('memberuniquekey');
                                }
                                if (this.destination) {
                                    var data = {
                                        source: this.source,
                                        target: this.destination,
                                        firstVisibleID: firstMemberUniqueKey,
                                    };
                                    var e = jQuery.Event("reordered", data);
                                    this.$el.trigger(e);
                                }
                            }
                        }
                    }
                }
            }
        },

        //getInputCoordinates : function (targetEvent) {
        //    var result = { x: Math.round(targetEvent.pageX), y: Math.round(targetEvent.pageY) };
        //    return result;
        //},

        scrollbarMouseLeave: function (event) {
            if (this.$el.find('#scrollbar').length > 0 && !this.mousewheel) {
                this.resolveScrollBarVisibility(event);
                this.$el.off('mousemove');
            }
        },
        scrollbarMouseMove: function (event) {
            if (this.$el.find('#scrollbar').length > 0 && !this.mousewheel) {
                this.resolveScrollBarVisibility(event);
            }
        },

        resolveScrollBarVisibility: function (event) {
            var scroll = this.$scrollbar;
            var self = this;
            if (this.$scrollbar && event && event.pageX && event.pageY && event.pageX > 0 && event.pageY > 0 && !this.isScrollStart && !this.reorderstarted) {
                if (this.isScrollBar(event)) {
                    clearTimeout(self.timer);
                    if (!this.scrollVisible && !this.timerGoingOn) {
                        this.$scrollbar.fadeIn('fast');
                        this.scrollVisible = true;
                    }
                    else {
                        clearTimeout(self.timer);
                        self.timerGoingOn = false;
                    }
                }
                else {
                    if (this.scrollVisible && !this.timerGoingOn) {
                        this.scrollVisible = false;
                        this.timerGoingOn = true;
                        clearTimeout(self.timer);
                        self.timer = setTimeout(function () {
                            if (!self.mousewheel) {
                                scroll.fadeOut('slow');
                            }
                            self.timerGoingOn = false;
                        }
                   , 1000);
                    }
                }
            }
        },

        isScrollBar: function (event) {

            var isScoll = false;
            if (event && event.type === 'mouseleave') {
                return false;
            }
            if (this.$scrollbar) {
                this.scrollPoistion.left = this.$el.offset().left + this.$el.width() - 7;
                this.scrollPoistion.top = this.$el.offset().top + parseInt(this.$scrollbar.css("top"), 10);
                var scrollRelativePosition = {};
                scrollRelativePosition.x = this.scrollPoistion.left + 7;
                scrollRelativePosition.y = this.scrollPoistion.top + this.$scrollbar.height();
                var offset = 10;
                if (this.scrollOffset !== null) {
                    offset = this.scrollOffset;
                }
                if (event.pageX + offset > this.scrollPoistion.left && event.pageX - offset < scrollRelativePosition.x
                    && event.pageY > this.scrollPoistion.top && event.pageY < scrollRelativePosition.y) {
                    isScoll = true;
                }
            }
            return isScoll;
        },
        dispose: function () {
            $(window).off("resize", this.resizeHandler);
            this.$el.unbind('gesturestart');
            this.$el.unbind(this.TOUCH_START);
            this.$el.unbind(this.MOUSE_WHEEL);
            this.$el.off('mousemove');
            this.$el.off('reordered');
            this.$el.off('mouseleave');
            this.$scrollbar.unbind();
            this.$scrollbar.off();
            this.cleanupEventHandlers();
            this.$el.find('ul').remove();
            this.$el.find('#scrollbar').remove();
            this.$el.data('list', null);
            this.$el.removeData('list');
            if (this.dataProvider) {
                this.dataProvider.length = 0;
            }
            if (this.reorderSupported) {
                $(document).unbind('mousemove', this.megalistItemReorderMoveHandler);
                $(document).unbind('mouseup', this.megalistItemReorderEndHandler);
            }
        },

        getVendorPrefix: function () {
            //vendor prefix logic from http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
            var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;

            var someScript = document.getElementsByTagName('script')[0];

            for (var prop in someScript.style) {
                if (regex.test(prop)) {
                    // test is faster than match, so it's better to perform
                    // that on the lot and match only when necessary
                    return prop.match(regex)[0];
                }
            }

            // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
            // However (prop in style) returns the correct value, so we'll have to test for
            // the precence of a specific property
            if ('WebkitOpacity' in someScript.style) { return 'Webkit'; }
            if ('KhtmlOpacity' in someScript.style) { return 'Khtml'; }

            return '';
        },

        onResize: function (event) {
            if (event && event.target && $(event.target).hasClass('ui-resizable')) {
                return;
            }
            clearTimeout(this.reizeTimeout);
            var maxPosition = (this.dataProvider.length * this.itemHeight) - (this.$el.height());
            this.yPosition = Math.min(this.yPosition, maxPosition);
            // this.yPosition = this.yPosition + 10;
            var self = this;
            this.reizeTimeout = setTimeout(function () {
                self.updateLayout();
            }, this.RESIZE_TIMEOUT_DELAY);
        },

        isDesktopDevice: function (event) {
            if (!this.touchSupported && event.target.id !== "scrollbar") {
                return true;
            }
            else return false;
        },

        onTouchStart: function (event) {
            if (!this.isDesktopDevice(event)) {
                if (!this.animating) {
                    this.animating = true;
                    this.render();
                }

                if (this.touchSupported) {
                    this.$scrollbar.fadeTo(300, 1);
                }
                this.updateVelocity(0);
                this.cleanupEventHandlers();

                this.$el.unbind(this.TOUCH_START, this.touchStartHandler);
                $(document).bind(this.TOUCH_MOVE, this.touchMoveHandler);
                $(document).bind(this.TOUCH_END, this.touchEndHandler);
                this.inputCoordinates = this.getInputCoordinates(event);
                this.inputStartCoordinates = this.inputCoordinates;
                this.inputStartTime = new Date().getTime();
            }
            event.preventDefault();
            return false;
        },

        onTouchMove: function (event) {
            if (this.$scrollbar.active == false) {
                return false;
            }
            var newCoordinates = this.getInputCoordinates(event);
            // if (!this.isDesktopDevice(event)) {
            var yDelta = this.inputCoordinates.y - newCoordinates.y;

            this.yPosition += yDelta;
            this.updateVelocity(yDelta);

            //limit scroll to within range of visible area
            var startPosition = Math.ceil(this.yPosition / this.itemHeight);
            if (startPosition < 0 && startPosition * this.itemHeight <= -(this.$el.height() - this.itemHeight)) {
                this.yPosition = -(this.$el.height() - this.itemHeight);
            }

            var maxPosition = (this.dataProvider.length * this.itemHeight) - this.itemHeight;
            if (this.yPosition > maxPosition) {
                this.yPosition = maxPosition;
            }
            //}
            //end scroll limiting

            this.inputCoordinates = newCoordinates;

            event.preventDefault();
            return false;
        },

        onTouchEnd: function (event) {
            this.animating = false;
            var id = this.$el.attr("id");

            this.inputEndCoordinates = this.inputCoordinates;
            var clickEvent = this.detectClickEvent(event);
            this.inputCoordinates = null;

            this.cleanupEventHandlers();
            if (!clickEvent && this.$scrollbar.active) {
                this.scrollWithInertia();
            }
            else {
                this.cleanupListItems();
            }
            this.$el.bind(this.TOUCH_START, this.touchStartHandler);
            event.preventDefault();
            return false;
        },

        scrollToItem: function (itemIndex) {
            this.yPosition = (itemIndex) * this.itemHeight;
            this.scroll();
        },

        scroll: function (event) {
            //limit the mouse wheel scroll area
            var maxPosition = ((this.dataProvider.length) * this.itemHeight) - this.$el.height();
            if (this.yPosition > maxPosition) {
                this.yPosition = maxPosition + this.itemHeight;
            }
            if (this.yPosition < 0) {
                this.yPosition = 0;
            }
            var self = this;
            this.updateLayout();
            this.cleanupTimeout = setTimeout(function () { self.cleanupListItems(); }, 100);
        },

        highlightItem: function (itemIndex) {
            this.$ul.find("li[list-index='" + itemIndex + "']").find('div').addClass('membersselected');
        },

        onMouseWheel: function (event) {
            if (this.$scrollbar.active == false) {
                return false;
            }
            //if (!this.scrollVisible) {
            this.$scrollbar.fadeIn('fast');
            this.scrollVisible = true;
            // }
            clearTimeout(this.cleanupTimeout);
            clearTimeout(this.mouseWheeltimer);
            this.mousewheel = true;
            //only concerned about vertical scroll
            //scroll wheel logic from: https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js
            var orgEvent = event.originalEvent;
            var delta = 0;

            // Old school scrollwheel delta
            if (orgEvent.wheelDelta) { delta = orgEvent.wheelDelta / 120; }
            if (orgEvent.detail) { delta = -orgEvent.detail / 3; }

            // Webkit
            if (orgEvent.wheelDeltaY !== undefined) { delta = orgEvent.wheelDeltaY / 120; }

            this.yPosition -= (delta * this.itemHeight);

            //limit the mouse wheel scroll area
            var maxPosition = ((this.dataProvider.length) * this.itemHeight) - this.$el.height();
            if (this.yPosition > maxPosition) {
                this.yPosition = maxPosition + this.itemHeight;
            }
            if (this.yPosition < 0) {
                this.yPosition = 0;
            }

            var self = this;
            this.updateLayout();
            this.cleanupTimeout = setTimeout(function () {
                self.cleanupListItems();
            }, 100);

            this.mouseWheeltimer = setTimeout(function () {
                self.mousewheel = false;
                self.resolveScrollBarVisibility(event);
            }, 1000);

            return false;
        },

        detectClickEvent: function (event) {
            var target = event.target;
            while (target.parentNode != undefined) {
                if (target.nodeName === "LI") {
                    break;
                }
                target = target.parentNode;
            }

            if (target.nodeName === "LI") {

                var endTime = new Date().getTime();

                if ((endTime - this.inputStartTime) < this.MAX_CLICK_DURATION_MS) {
                    var delta = {
                        x: Math.abs(this.inputStartCoordinates.x - this.inputEndCoordinates.x),
                        y: Math.abs(this.inputStartCoordinates.y - this.inputEndCoordinates.y)
                    };

                    var triggerEvent = false;
                    if (this.touchSupported) {
                        triggerEvent = delta.x <= this.MAX_TOUCH_POSITION_FLOAT_PX && delta.y <= this.MAX_TOUCH_POSITION_FLOAT_PX;
                    }
                    else {
                        triggerEvent = delta.x <= this.MAX_MOUSE_POSITION_FLOAT_PX && delta.y <= this.MAX_MOUSE_POSITION_FLOAT_PX;
                    }

                    if (triggerEvent) {
                        var index = $(target).attr("list-index");
                        if (index === this.selectedIndex) { return false; }
                        this.setSelectedIndex(index);

                        //make this asynch so that any "alert()" on a change event
                        //does not block the UI from updating the selected row
                        //this is particularly an issue on mobile devices
                        var self = this;
                        setTimeout(function () {
                            var data = {
                                selectedIndex: index,
                                srcElement: $(target),
                                item: self.dataProvider[index]
                            };
                            var e = jQuery.Event("change", data);
                            self.$el.trigger(e);
                        }, 150);

                        return true;
                    }
                }
            }
            return false;
        },

        cleanupEventHandlers: function () {
            $(document).unbind(this.TOUCH_MOVE, this.touchMoveHandler);
            $(document).unbind(this.TOUCH_END, this.touchEndHandler);
            $(document).unbind(this.TOUCH_MOVE, this.scrollbarMoveHandler);
            $(document).unbind(this.TOUCH_END, this.scrollbarEndHandler);
        },

        cleanupListItems: function (keepScrollBar) {
            //remove any remaining LI elements hanging out on the dom
            var item, index;
            for (var x = 0; x < this.totalItems.length; x++) {
                item = this.totalItems[x];
                index = item.attr("list-index");
                if (this.processedItems[index] === undefined) {
                    item.remove();
                }
            }
            //cleanup totalItems array
            var temp = [];
            if (this.processedItems) {
                for (index in this.processedItems) {
                    temp.push(this.processedItems[index]);
                }
            }
            this.totalItems = temp;

            if (this.touchSupported && keepScrollBar !== true) {
                this.$scrollbar.fadeTo(300, 0);
            }
        },

        getInputCoordinates: function (event) {

            var targetEvent;
            if (this.touchSupported) {
                targetEvent = event.originalEvent.touches[0];
            }
            else {
                targetEvent = event;
            }

            var result = { x: Math.round(targetEvent.pageX), y: Math.round(targetEvent.pageY) };
            return result;
        },

        checkIfDistinctItem: function (value) {
            var present = true;
            if (IRI.Visualization.Common.Util.isObjectNotNullorUndefined(this.totalItems) && this.totalItems.length > 0) {
                $.each(this.totalItems, function (index, item) {
                    if ($(item).attr('list-index') === $(value).attr('list-index')) {
                        present = false;
                    }
                });
            }
            return present;
        },

        removeAllChild: function (element) {
            var child;
            while (child = element.lastChild) {
                element.removeChild(child);
            }
        },

        updateLayout: function (ignoreScrollbar) {

            if (this.dataProvider.length > 0) {

                var height = this.$el.height();

                this.$ul.detach();
                this.removeAllChild(this.$ul[0]);//fix for the scroll up issue :-sonu
                //   this.$ul[0].innerHTML = '';  

                var i = -1;
                var startPosition = Math.ceil(this.yPosition / this.itemHeight);
                var offset = -(this.yPosition % this.itemHeight);

                this.setItemPosition(this.$ul, 0, -this.yPosition);
                this.processedItems = {};

                while (((i) * this.itemHeight) < 2 * (height + (2 * this.itemHeight))) {

                    var index = Math.max(startPosition + i, 0);
                    index = Math.min(index, this.dataProvider.length);

                    var item = this.getItemAtIndex(index);
                    //  if (this.checkIfDistinctItem(item)) {
                    this.totalItems.push(item);
                    //  }

                    this.processedItems[index.toString()] = item;
                    this.setItemPosition(item, 0, ((startPosition + i) * this.itemHeight));

                    if (item.parent().length <= 0) {
                        if (index < this.dataProvider.length) {
                            this.$ul.append(item);
                            //  item.remove();
                        }
                        if (this.itemHeight <= 0) {
                            this.$el.append(this.$ul);
                            this.itemHeight = item.outerHeight();
                            this.updateLayout();
                            return;
                        }
                    }
                    i++;
                }

                this.cleanupListItems(true);
                if (ignoreScrollbar !== true) {
                    this.updateScrollBar();
                }
                this.$scrollbar.before(this.$ul);
                this.animating = !ignoreScrollbar; // do not animate if there is no scroll bar
                this.$el.prepend(this.$ul);
            }
            else { //Removing the scroll if there are no items in the list, this will happen from search :sonu
                if (this.$scrollbar != null && this.$scrollbar != undefined && this.$scrollbar.height() > 0) {
                    var parent = this.$scrollbar.parent();
                    if (this.itemHeight > 0) {
                        if ((this.dataProvider.length * this.itemHeight) <= this.$el.height()) {
                            if (parent.length > 0) {
                                this.$scrollbar.remove();
                                this.$scrollbar.active = false;
                                this.yPosition = 0;
                            }
                        }

                    }
                    //else if (this.itemHeight < 0) {
                    //    this.$scrollbar.remove();
                    //    this.$scrollbar.active = false;
                    //}
                }
            }
            //this.$el.find('li').unbind('mousemove', this.megalistItemhover);
            //this.$el.find('li').unbind('mouseleave', this.megalistItemleave);
            //this.$el.find('li').bind('mousemove', this.megalistItemhover);
            //this.$el.find('li').bind('mouseleave', this.megalistItemleave);
            // this.onScoll = false;
        },

        updateScrollBar: function () {
            var height = this.$el.height();
            var maxScrollbarHeight = this.$el.height() - (2 * this.SCROLLBAR_BORDER);
            var maxItemsHeight = (this.dataProvider.length) * this.itemHeight;
            var targetHeight = Math.min(maxScrollbarHeight / maxItemsHeight, 1) * maxScrollbarHeight;
            var actualHeight = Math.max(targetHeight, this.SCROLLBAR_MIN_SIZE);

            var scrollPosition = this.SCROLLBAR_BORDER + ((this.yPosition / (maxItemsHeight - height)) * (maxScrollbarHeight - actualHeight));
            if (scrollPosition < this.SCROLLBAR_BORDER) {

                actualHeight = Math.max(actualHeight + scrollPosition, 0);
                scrollPosition = this.SCROLLBAR_BORDER;
            }
            else if (scrollPosition > (height - actualHeight)) {
                actualHeight = Math.min(actualHeight, (height - (scrollPosition + this.SCROLLBAR_BORDER)));
            }

            this.$scrollbar.height(actualHeight);
            var parent = this.$scrollbar.parent();

            if ((this.dataProvider.length * this.itemHeight) <= this.$el.height()) {
                if (parent.length > 0) {
                    this.$scrollbar.remove();
                    this.$scrollbar.active = false;
                    this.yPosition = 0;
                }
            }
            else {
                if (parent.length <= 0) {
                    this.$el.append(this.$scrollbar);
                    this.$scrollbar.active = true;
                    this.$scrollbar.unbind(this.TOUCH_START, this.scrollbarStartHandler);
                    this.$scrollbar.bind(this.TOUCH_START, this.scrollbarStartHandler);
                }
                this.$scrollbar.css("top", scrollPosition);
            }

        },

        updateVelocity: function (yDelta) {
            this.velocity.distance = yDelta;
            var time = new Date().getTime();
            this.velocity.timeDelta = time - this.velocity.lastTime;
            this.velocity.lastTime = time;

            if (this.velocity.timeDelta > 1000) {
                this.velocity.distance = 0;
            }
        },

        render: function () {
            //console.log("render");
            var self = this;
            if (this.animating) {
                requestAnimFrame(function () { self.render(); });
            }

            this.updateLayout();
        },

        scrollWithInertia: function () {
            if (this.$scrollbar.active == false) {
                return false;
            }
            var friction = 0.97;

            //detect bounds and "snap back" if needed
            var startPosition = Math.ceil(this.yPosition / this.itemHeight);

            if (startPosition <= 0 && this.yPosition <= 0 || (this.dataProvider.length * this.itemHeight) < this.$el.height()) {
                this.snapToTop();
                return;
            }

            var maxPosition = (this.dataProvider.length * this.itemHeight) - (this.$el.height());
            if (this.yPosition > maxPosition) {
                this.snapToBottom();
                return;
            }

            //end "snap back"


            var yDelta = this.velocity.distance * (friction * (Math.max(1000 - this.velocity.timeDelta, 0) / 1000));
            this.yPosition += yDelta;
            this.updateVelocity(yDelta);
            this.updateLayout();

            var self = this;
            if (Math.abs(yDelta) >= 1) {
                this.cleanupListItems(true);
                requestAnimFrame(function () { self.scrollWithInertia(); });
            }
            else {
                this.cleanupListItems();
            }
        },

        snapToTop: function () {
            if (this.$scrollbar.active == false) {
                return false;
            }
            var self = this;
            var snapRatio = 5;
            var targetPosition = 0;

            if (this.yPosition < -2) {
                this.yPosition += (targetPosition - this.yPosition) / snapRatio;
                this.updateLayout();
                if (!this.animating) {
                    requestAnimFrame(function () { self.snapToTop(); });
                }
            }
            else {
                this.yPosition = 0;
                this.updateLayout();
                this.cleanupListItems();
            }
        },

        snapToBottom: function () {
            var self = this;
            var snapRatio = 5;

            var maxPosition = (this.dataProvider.length * this.itemHeight) - (this.$el.height());
            if (Math.round(this.yPosition) > maxPosition) {

                this.yPosition += (maxPosition - this.yPosition) / snapRatio;

                this.updateLayout();

                if (!this.animating) {
                    requestAnimFrame(function () { self.snapToBottom(); });
                }
            }
            else {
                this.yPosition = maxPosition;
                this.updateLayout();
                this.cleanupListItems();
            }
        },

        setItemPosition: function (item, x, y) {

            if (this.useTransform === null || this.useTransform === undefined) {
                var body = document.body || document.documentElement;
                var style = body.style;
                this.useTransform = style.WebkitTransition !== undefined || style.MozTransition !== undefined || style.OTransition !== undefined || style.transition !== undefined;
            }


            //temporarily disabling 3d transform
            if (false) {//this.useTransform ) {
                var cssString = "translate3d(" + x + "px, " + y + "px, 0px)";
                item.css("-" + this.vendorPrefix + "-transform", cssString);
            }
            else {
                item.css("left", x);
                item.css("top", y);
            }
        },

        getItemAtIndex: function (i) {
            var item;
            if (this.dataProvider === this.listItems) {
                item = $(this.listItems[i]);
            }
            else if (i !== undefined) {
                var iString = i.toString();

                /*
                if ( this.listItems[ iString ] === null || this.listItems[ iString ] === undefined ) {
                    for ( var j = 0; j< 200; j++ ) {
                        var index = (j+i);
                        this.listItems[ index.toString() ] = $("<li class='megalistItem' />");
                    }
                }
                item = this.listItems[ iString ];
                */
                if (this.listItems[iString] === null || this.listItems[iString] === undefined) {
                    item = $("<li class='megalistItem' />");
                    this.listItems[iString] = item;
                }
                else {
                    item = this.listItems[i];
                }
                if (i >= 0 && i < this.dataProvider.length) {
                    var data = this.dataProvider[i];
                    var label = this.labelFunction ? this.labelFunction(data) : data.toString();
                    item.html(label);
                }
            }
            if (item !== null && item !== undefined) {
                item.attr("list-index", i);
            }
            if (item && this.reorderSupported) {
                $(item).unbind('mousedown', this.megalistItemReorderstartedHandler);
                $(item).bind('mousedown', this.megalistItemReorderstartedHandler);
                $(item).bind('mouseenter', this.megalistItemhover);
                $(item).bind('mouseleave', this.megalistItemleave);
            }
            return item;
        },

        setDataProvider: function (dataProvider) {
            //removing scrollbar if dataProvider.length == 0 :Sonu
            if (dataProvider.length == 0) {
                this.$scrollbar.remove();
                this.$scrollbar.active = false;
                this.yPosition = 0;
            }

            this.clearSelectedIndex();
            this.dataProvider = dataProvider;

            this.$ul.find("li").each(function (i) {
                $(this).remove();
            });

            this.yPosition = 0;
            this.updateLayout();
        },

        enableReorderinList: function () {
            this.reorderSupported = true;
        },

        setLabelFunction: function (labelFunction) {
            this.labelFunction = labelFunction;
            this.updateLayout();
        },

        getSelectedIndex: function () {
            return parseInt(this.selectedIndex, 10);
        },

        setSelectedIndex: function (index) {
            var item = this.getItemAtIndex(this.selectedIndex);

            if (item !== undefined) {
                item.removeClass("megalistSelected");
            }

            this.selectedIndex = index;
            this.getItemAtIndex(index).addClass("megalistSelected");
        },

        clearSelectedIndex: function () {
            var item = this.getItemAtIndex(this.selectedIndex);

            if (item !== undefined) {
                item.removeClass("megalistSelected");
            }
            this.selectedIndex = -1;
        },

        scrollbarTouchStart: function (event) {
            if (this.$scrollbar.active == false) {
                return false;
            }
            this.isScrollStart = true;
            this.cleanupEventHandlers();
            this.scrollbarInputCoordinates = this.getInputCoordinates(event);

            $(document).bind(this.TOUCH_MOVE, this.scrollbarMoveHandler);
            $(document).bind(this.TOUCH_END, this.scrollbarEndHandler);

            event.preventDefault();
            return false;
        },

        scrollbarTouchMove: function (event) {
            if (this.$scrollbar.active == false) {
                return false;
            }
            var newCoordinates = this.getInputCoordinates(event);
            var yDelta = this.scrollbarInputCoordinates.y - newCoordinates.y;

            var yPosition = parseInt(this.$scrollbar.css("top"), 10);
            yPosition -= yDelta;

            yPosition = Math.max(yPosition, this.SCROLLBAR_BORDER);
            yPosition = Math.min(yPosition, this.$el.height() - this.SCROLLBAR_BORDER - this.$scrollbar.height());

            this.$scrollbar.css("top", yPosition);
            this.scrollbarInputCoordinates = newCoordinates;

            var newYPosition = ((yPosition - this.SCROLLBAR_BORDER) /
                                (this.$el.height() - (2 * this.SCROLLBAR_BORDER) - this.$scrollbar.height())
                               ) * (this.itemHeight * this.dataProvider.length - 1);
            newYPosition = Math.max(0, newYPosition);
            newYPosition = Math.min(newYPosition, (this.itemHeight * (this.dataProvider.length)) - (this.$el.height() - (2 * this.SCROLLBAR_BORDER) - this.$scrollbar.height()));
            this.yPosition = newYPosition - this.$scrollbar.height() + this.itemHeight;
            this.updateLayout(true);

            event.preventDefault();
            return false;
        },

        scrollbarTouchEnd: function (event) {
            if (this.$scrollbar.active == false) {
                return false;
            }
            this.cleanupEventHandlers();
            this.cleanupListItems();
            event.preventDefault();
            this.isScrollStart = false;
            return false;
        }

    };

    /* LIST PLUGIN DEFINITION
     * ========================== */

    $.fn.megalist = function (option, params) {
        return this.each(function () {
            var $this = $(this), data = $this.data('list');
            if (!data) { $this.data('list', (data = new Megalist(this))); }
            if (typeof option === 'string') { data[option](params); }
        });
    };

    $.fn.megalist.Constructor = Megalist;

}(window.jQuery);