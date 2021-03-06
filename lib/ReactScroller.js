"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./ReactScroller.less");

var _ReactScrollerCore = require("./ReactScrollerCore.jsx");

var _ReactScrollerCore2 = _interopRequireDefault(_ReactScrollerCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Xiaotao.Nie on 08/07/2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * All right reserved
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * IF you have any question please email iconie@tencent.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ReactScroller = function (_Component) {
    _inherits(ReactScroller, _Component);

    function ReactScroller(props) {
        _classCallCheck(this, ReactScroller);

        var _this = _possibleConstructorReturn(this, (ReactScroller.__proto__ || Object.getPrototypeOf(ReactScroller)).call(this, props));

        var arr = [];

        for (var i = 0; i < 50; i++) {
            arr.push(i);
        }

        _this.state = {
            content: arr,
            showRefresh: false,
            showLoadMore: false
        };
        return _this;
    }

    _createClass(ReactScroller, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                _ReactScrollerCore2.default,
                { maxScroll: 0, container: "#ReactScrollerCoreContainer", target: "#ReactScrollerCoretarget",
                    lowerBound: this.props.lowerBound || 50,
                    showRefreshTip: function showRefreshTip() {
                        _this2.props.showRefreshTip();
                    },
                    refresh: function refresh() {
                        if (!_this2.props.showRefresh) return;
                        _this2.props.refresh();
                    },
                    onLowerArrive: function onLowerArrive() {
                        if (!_this2.props.showLoadMore) return;
                        _this2.props.loadMore();
                    },
                    showRefresh: this.props.showRefresh,
                    showLoadMore: this.props.showLoadMore
                },
                _react2.default.createElement(
                    "div",
                    { id: "ReactScrollerCoreContainer", onClick: function onClick() {
                            console.log("ReactScrollerCoreContainer");
                        },
                        style: { height: this.props.containerHeight, width: this.props.containerWidth || "100%" } },
                    _react2.default.createElement(
                        "div",
                        { id: "ReactScrollerCoretarget", className: "ReactScollerTarget", onClick: function onClick() {
                                console.log("ReactScollerTarget");
                            } },
                        _react2.default.createElement(
                            "div",
                            { className: this.props.showRefresh ? this.props.refreshTip ? "refreshShow" : "refreshHide" : "refreshHide" },
                            this.props.refreshTip
                        ),
                        this.props.children,
                        _react2.default.createElement(
                            "div",
                            { className: this.props.showLoadMore ? this.props.loadMoreTip ? "loadMoreShow" : "loadMoreHide" : "loadMoreHide" },
                            this.props.loadMoreTip
                        )
                    )
                )
            );
        }
    }]);

    return ReactScroller;
}(_react.Component);

exports.default = ReactScroller;
//# sourceMappingURL=ReactScroller.js.map