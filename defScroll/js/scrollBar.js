/**
 * Created by Rocky-Wang on 2017/5/1.
 */
var Scroll = {};

/**
 * JS下的
 * scrollTop：获取一个元素距离他容器顶部的像素距离，该容器必须是具备overflow属性
 * scrollHeight：容器中具备滚动元素的距离最大值，不是可见高度。
 * clientHeight：元素可见高度
 */

(function (win,doc,$) {
    function CusScrollBar(options) {
        this._init(options);
    }

    $.extend(CusScrollBar.prototype,{
        // 插件初始化函数
        _init:function (options) {
            var self = this;
            self.options = {
                scrollDir       : "y",  // 滚动方向
                contSelector    : "" ,  // 滚动内容选择器
                barSelector     : "" ,  // 滚动条选择器
                sliderSelector  : "" ,  // 滚动滑块选择器
                tabItemSelector : ".nav-item",   // 标签选择器
                tabActiveClass  : "nav-active",  // 选中标签类名
                anchorSelector  : ".anchor",    // 锚点选择器
                wheelStep       : 10    // 滚轮步长
            };
            $.extend(true,self.options,options || {});

            self._initDomEvent();

            return self;
        },
        // 初始化DOM引用
        _initDomEvent : function () {
            var opts = this.options;
            // 滚动内容对象，必填
            this.$cont = $(opts.contSelector);
            // 滚动滑块对象，必填
            this.$slider = $(opts.sliderSelector);
            // 滚动条对象，必填
            this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();

            // 标签项
            this.$tabItem = $(opts.tabItemSelector);
            // 锚点项
            this.$anchor = $(opts.anchorSelector);

            this.$doc = $(doc);

            this._initSliderDragEvent()
                ._bindContScroll()
                ._bindMousewheel()
                ._initTabEvent();
        },
        // 初始化滑块的鼠标点击功能
        _initSliderDragEvent: function () {
            var self = this;
            var slider = this.$slider,
                sliderEl = slider[0];

            if (sliderEl){
                var doc = this.$doc,
                    dragStartPagePosition,      // 每次点击鼠标后，获取滑块的对整个浏览器的Y值坐标
                    dragStartScrollPosition,    // 每次点击鼠标后，获取已经移除的内容高度
                    dragContBarRate;

                // 计算当前滚动的速度，通过滑动的内容高度除以滑动条的距离
                dragContBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
                // 鼠标移动事件处理
                function mousemoveHandler(e) {
                    e.preventDefault();
                    if (dragStartPagePosition === null){
                        return undefined;
                    }
                    // 设置文章内容的滚动距离，通过滑块的偏移量，计算移动量。
                    self.scrollTo(dragStartScrollPosition +
                        (e.pageY - dragStartPagePosition)*dragContBarRate);
                }
                // 鼠标松开事件处理
                function mouseupHandler() {
                    doc.off(".scroll");
                }

                // 处理滑动块的鼠标点击事件
                slider.on("mousedown",function (e) {
                    e.preventDefault();
                    dragStartPagePosition = e.pageY;
                    dragStartScrollPosition = self.$cont[0].scrollTop;
                    // 注册移动鼠标事件的关联
                    doc.on("mousemove.scroll", mousemoveHandler)
                        .on("mouseup.scroll", mouseupHandler);
                });
            }

            return self;
        },

        // 内容可滚动的高度，常量
        getMaxScrollPosition : function () {
            var self = this;
            return Math.max(self.$cont.height(),self.$cont[0].scrollHeight) - self.$cont.height();
        },
        // 滑块可移动的距离，常量
        getMaxSliderPosition : function () {
            var self = this;
            return self.$bar.height() - self.$slider.height();
        },
        // 设置内容滚动高度值
        scrollTo: function (positionVal) {
            var self = this;
            var posArr = self.getAllAnchorPosition();

            function getIndex(pos) {
                for (var i = posArr.length-1; i >= 0; i--){
                    if (pos >= posArr[i]){
                        return i;
                    }
                }
            }
            self.changeTabSelect(getIndex(positionVal));
            self.$cont.scrollTop(positionVal);
        },

        // 监听内容的滚动，同步滑块位置
        _bindContScroll : function () {
            var self = this;
            self.$cont.on("scroll",function () {
                var sliderEl = self.$slider && self.$slider[0];
                if (sliderEl){
                    sliderEl.style.top = self.getSliderPosition() + "px";
                }
            });
            return self;
        },
        // 计算滑块当前位置
        getSliderPosition : function () {
            var self = this,
                maxSliderPosition = self.getMaxSliderPosition();

            return Math.min(maxSliderPosition,maxSliderPosition * self.$cont[0].scrollTop/self.getMaxScrollPosition());
        },
        // 绑定滑块的鼠标滚动功能
        _bindMousewheel: function () {
            var self = this;

            self.$cont.on("mousewheel DOMMouseScroll",function (e) {
                e.preventDefault();
                var oEv = e.originalEvent,
                    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta/120 : (oEv.detail || 0)/3;
                self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep);
            });
            return self;
        },
        // 初始化标签的切换功能
        _initTabEvent : function () {
            var self = this;

            self.$tabItem.on("click",function (e) {
                e.preventDefault();
                var index = $(this).index();
                self.changeTabSelect(index);
                // 指定锚点与内容容器的距离
                self.scrollTo(self.$cont[0].scrollTop + self.getAnchorPosition(index));
            });
            return self;
        },
        // 获取指定锚点到上边界的像素
        getAnchorPosition: function (index) {
            return this.$anchor.eq(index).position().top;
        },
        // 获取每个锚点位置信息的数组
        getAllAnchorPosition: function () {
            var self = this,
                allPositionArr = [];
            for (var i = 0; i < self.$anchor.length; i++){
                allPositionArr.push(self.$cont[0].scrollTop + self.getAnchorPosition(i));
            }
            return allPositionArr;
        },
        // 切换标签选中
        changeTabSelect : function (index) {
            var self = this,
                actived = self.options.tabActiveClass;

            return self.$tabItem.eq(index).addClass(actived).siblings().removeClass(actived);
        }
    });

    Scroll.CusScrollBar = CusScrollBar;
})(window,document,jQuery);

