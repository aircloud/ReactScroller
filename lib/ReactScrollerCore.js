'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Xiaotao.Nie on 08/07/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * All right reserved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * IF you have any question please email iconie@tencent.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// 目前只支持纵向滚动,并没有对横向滚动的支持


var MINSPEED = 0.02;

(function polyfillforAnimation() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
        window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function reqFrame(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function reqFrame2(id) {
            clearTimeout(id);
        };
    }
})();

var CommonScroll = function (_Component) {
    _inherits(CommonScroll, _Component);

    function CommonScroll(props) {
        _classCallCheck(this, CommonScroll);

        var _this = _possibleConstructorReturn(this, (CommonScroll.__proto__ || Object.getPrototypeOf(CommonScroll)).call(this, props));

        _this.state = {};
        _this.CommonScrollConfig = {
            y1: 0,
            heightForShowRefresh: 35,
            needRefresh: false
        };
        return _this;
    }

    _createClass(CommonScroll, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            this.refs.CommonScrollContainer.style.overflow = "hidden";

            // 修改成addEventListener形式,参考链接:https://www.chromestatus.com/features/5093566007214080
            this.refs.CommonScrollContainer.addEventListener("touchstart", function (e) {
                _this2.handleTouchStart.bind(_this2)(e);
            });
            this.refs.CommonScrollContainer.addEventListener("touchmove", function (e) {
                _this2.handleTouchMove.bind(_this2)(e);
            });
            this.refs.CommonScrollContainer.addEventListener("touchend", function (e) {
                _this2.handleTouchEnd.bind(_this2)(e);
            });

            this.touchInit();
        }
    }, {
        key: 'touchInit',
        value: function touchInit() {
            this.CommonScrollConfig.target = typeof this.props.target === "string" ? document.querySelector(this.props.target) : this.props.target;
            this.CommonScrollConfig.container = typeof this.props.container === "string" ? document.querySelector(this.props.container) : this.props.container;
        }
    }, {
        key: 'handleTouchStart',
        value: function handleTouchStart(e) {
            // 重置needRefresh
            this.needRefresh = false;

            // 如果这里阻止默认事件可能会出现原正常效果没有办法响应
            // e.preventDefault();
            this.CommonScrollConfig.lastCurrentX = this.CommonScrollConfig.x1 = e.touches[0].pageX;
            this.CommonScrollConfig.lastCurrentY = this.CommonScrollConfig.y1 = e.touches[0].pageY;
            this.CommonScrollConfig.isTouchStart = true;

            this.CommonScrollConfig.translateY = this.CommonScrollConfig.translateY ? this.CommonScrollConfig.translateY : 0;

            this.CommonScrollConfig.timeStep = this.CommonScrollConfig.startTime = new Date().getTime();
            this.CommonScrollConfig.trace = [e.touches[0].pageY];

            this.CommonScrollConfig.ifout = false;

            if (this.CommonScrollConfig.frameId) {
                window.cancelAnimationFrame(this.CommonScrollConfig.frameId);
            }

            this.CommonScrollConfig.beginMove = false;
            this.CommonScrollConfig.verticalSlide = true;
        }
    }, {
        key: 'handleTouchMove',
        value: function handleTouchMove(e) {
            e.preventDefault();

            this.CommonScrollConfig.currentY = e.touches[0].pageY;
            this.CommonScrollConfig.currentX = e.touches[0].pageX;

            var maxScroll = parseInt(this.props.maxScroll, 10);
            var minScroll = parseInt(this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight, 10);

            if (!this.CommonScrollConfig.beginMove) {
                this.CommonScrollConfig.beginMove = true;
                this.CommonScrollConfig.verticalSlide = Math.abs(this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY) >= Math.abs(this.CommonScrollConfig.currentX - this.CommonScrollConfig.lastCurrentX);
            }
            // verticalSlide: 表明不是左右滚动
            if (this.CommonScrollConfig.isTouchStart && this.CommonScrollConfig.verticalSlide) {
                if (this.CommonScrollConfig.translateY >= maxScroll || this.CommonScrollConfig.translateY <= minScroll) {
                    if (!this.CommonScrollConfig.ifout) {
                        this.CommonScrollConfig.criticalValue = e.touches[0].pageY;
                        this.CommonScrollConfig.criticalY = this.CommonScrollConfig.translateY;
                    } else {
                        this.CommonScrollConfig.direction = this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY > 0 ? 1 : -1;

                        // 这里自己目前还是不确定用什么缓动函数比较好
                        this.CommonScrollConfig.translateY += 0.3 * (this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY);
                        this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

                        // 这个时候对滑动距离取对数
                        if (new Date().getTime() - this.CommonScrollConfig.timeStep > 100) {
                            // 这个时候距离不再是标准的距离了
                            // 理论上这里的pageY的计算方式应该发生一些变化
                            var currLocation = e.touches[0].pageY;

                            this.CommonScrollConfig.trace.push(currLocation);

                            this.CommonScrollConfig.timeStep += 100;
                        }

                        // 增加下拉刷新的判断逻辑 注意判断是下拉,所以增加了一个判断
                        if (this.CommonScrollConfig.translateY >= maxScroll && Math.abs(this.CommonScrollConfig.currentY - this.CommonScrollConfig.criticalValue) * 0.3 > this.CommonScrollConfig.heightForShowRefresh) {
                            this.props.showRefreshTip();
                            this.needRefresh = true;
                        }
                    }

                    this.CommonScrollConfig.ifout = true;
                } else {
                    this.CommonScrollConfig.ifout = false;

                    if (new Date().getTime() - this.CommonScrollConfig.timeStep > 100) {
                        this.CommonScrollConfig.trace.push(e.touches[0].pageY);
                        this.CommonScrollConfig.timeStep += 100;
                    }

                    this.CommonScrollConfig.translateY += this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY;
                    this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);
                }

                this.CommonScrollConfig.lastCurrentY = this.CommonScrollConfig.currentY;
            }

            if (this.CommonScrollConfig.translateY < minScroll + this.props.lowerBound) {
                this.props.onLowerArrive();
            }
        }
    }, {
        key: 'handleTouchEnd',
        value: function handleTouchEnd(e) {
            this.CommonScrollConfig.currentY = e.changedTouches[0].pageY;

            if (this.needRefresh) {
                this.props.refresh();
            }

            if (new Date().getTime() - this.CommonScrollConfig.timeStep > 100) {
                this.CommonScrollConfig.trace.push(e.changedTouches[0].pageY);
                this.CommonScrollConfig.timeStep += 100;
            }

            if (this.CommonScrollConfig.isTouchStart && this.CommonScrollConfig.verticalSlide) {
                var curr = new Date().getTime();
                var dt = curr - this.CommonScrollConfig.startTime;
                if (dt > 300) {
                    // 如果滑动的时间大于300ms 这个时候应该取后面的一部分的速度
                    // 这个时候该如何计算速度呢 我们需要用到之前的轨迹记录

                    var interval = curr - this.CommonScrollConfig.timeStep + 300;
                    var distance = this.CommonScrollConfig.currentY - this.CommonScrollConfig.trace[this.CommonScrollConfig.trace.length - 3];
                    var speed = distance / interval;

                    this.CommonScrollConfig.direction = speed > 0 ? 1 : -1;
                    speed = Math.abs(speed);
                    this.go(speed, this.props.ease || CommonScroll.easeSmooth, true);
                } else {
                    var _distance = this.CommonScrollConfig.currentY - this.CommonScrollConfig.y1;
                    var _speed = _distance / dt;

                    this.CommonScrollConfig.direction = _speed > 0 ? 1 : -1;
                    _speed = Math.abs(_speed);
                    this.go(_speed, this.props.ease || CommonScroll.easeSmooth, true);
                }
            }
        }
    }, {
        key: 'moveEnd',
        value: function moveEnd() {
            // 这个函数的作用是如果超出边界了就返回
            if (this.CommonScrollConfig.translateY >= this.props.maxScroll) {
                // 超过最大值
                this.CommonScrollConfig.translateY = this.CommonScrollConfig.translateY - Math.ceil((this.CommonScrollConfig.translateY - this.props.maxScroll) / 2);
                this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

                if (this.CommonScrollConfig.translateY > this.props.maxScroll) {
                    window.requestAnimationFrame(this.moveEnd.bind(this));
                } else {
                    this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.props.maxScroll);
                }
            } else {
                // 小于最小值
                this.CommonScrollConfig.translateY = this.CommonScrollConfig.translateY + Math.ceil((this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight - this.CommonScrollConfig.translateY) / 2);
                this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

                if (this.CommonScrollConfig.translateY < this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight) {
                    window.requestAnimationFrame(this.moveEnd.bind(this));
                } else {
                    this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight);
                }
            }
        }
    }, {
        key: 'go',
        value: function go(speed, ease, ifend) {
            var speed0 = speed;
            var goBeginTime = new Date().getTime();
            var lastTime = new Date().getTime();

            var frame = function frame() {
                var time = new Date().getTime() - lastTime;
                var dt = time + lastTime - goBeginTime;
                var frameDistance = Math.ceil(speed * time) * this.CommonScrollConfig.direction;
                if (time === 0) {
                    window.requestAnimationFrame(frame.bind(this));
                    return;
                }
                this.CommonScrollConfig.translateY += frameDistance;
                this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

                if (this.CommonScrollConfig.translateY >= this.props.maxScroll || this.CommonScrollConfig.translateY <= this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight) {
                    speed = ease(speed0, dt, 0.2);
                } else {
                    speed = ease(speed0, dt, 0.0005);
                }

                lastTime = new Date().getTime();
                var minScroll = parseInt(this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight, 10);

                if (this.CommonScrollConfig.translateY < minScroll + this.props.lowerBound) {
                    this.props.onLowerArrive();
                }

                if (speed >= MINSPEED) {
                    this.CommonScrollConfig.frameId = window.requestAnimationFrame(frame.bind(this));
                } else if (ifend) {
                    this.CommonScrollConfig.isTouchStart = false;
                    if (this.CommonScrollConfig.translateY >= this.props.maxScroll || this.CommonScrollConfig.translateY <= this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight) {
                        this.moveEnd();
                    }
                }
            };

            this.CommonScrollConfig.frameId = window.requestAnimationFrame(frame.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { ref: 'CommonScrollContainer',
                    id: 'CommonScrollContainer',
                    style: { width: this.props.width || "100%" }
                },
                this.props.children
            );
        }
    }], [{
        key: 'constructTransformForY',
        value: function constructTransformForY(number) {
            return "translateY(" + number + "px)";
        }
        // 提供一个默认的减速函数

    }, {
        key: 'easeSmooth',
        value: function easeSmooth(x0, dt, friction) {
            return x0 - dt * friction;
        }
    }]);

    return CommonScroll;
}(_react.Component);

exports.default = CommonScroll;
//# sourceMappingURL=ReactScrollerCore.js.map