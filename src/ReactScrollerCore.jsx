/**
 * Created by Xiaotao.Nie on 08/07/2017.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

// 目前只支持纵向滚动,并没有对横向滚动的支持
import React, { Component } from 'react';

const MINSPEED = 0.02;

(function polyfillforAnimation() {
    let lastTime = 0;
    const vendors = ['webkit', 'moz'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function reqFrame(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            const id = window.setTimeout(() => {
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
}());

class CommonScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.CommonScrollConfig = {
            y1: 0,
            heightForShowRefresh: 35,
            needRefresh: false,
            stopResponse:false,
        };
    }

    static constructTransformForY(number) {
        return "translateY(" + number + "px)";

    }
    // 提供一个默认的减速函数
    static easeSmooth(x0, dt, friction) {
        return x0 - (dt * friction);
    }

    componentDidMount() {
        this.refs.CommonScrollContainer.style.overflow = "hidden";

        // 修改成addEventListener形式,参考链接:https://www.chromestatus.com/features/5093566007214080
        this.refs.CommonScrollContainer.addEventListener("touchstart", (e) => { this.handleTouchStart.bind(this)(e); });
        this.refs.CommonScrollContainer.addEventListener("touchmove", (e) => { this.handleTouchMove.bind(this)(e); });
        this.refs.CommonScrollContainer.addEventListener("touchend", (e) => { this.handleTouchEnd.bind(this)(e); });

        this.touchInit();
    }
    touchInit() {
        this.CommonScrollConfig.target = typeof this.props.target === "string" ? document.querySelector(this.props.target) : this.props.target;
        this.CommonScrollConfig.container = typeof this.props.container === "string" ? document.querySelector(this.props.container) : this.props.container;
    }
    handleTouchStart(e) {
        // 重置needRefresh
        this.needRefresh = false;
        this.CommonScrollConfig.stopResponse = false;

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
    handleTouchMove(e) {
        e.preventDefault();

        if(this.CommonScrollConfig.stopResponse) return;

        this.CommonScrollConfig.currentY = e.touches[0].pageY;
        this.CommonScrollConfig.currentX = e.touches[0].pageX;

        const maxScroll = parseInt(this.props.maxScroll, 10);
        const minScroll = parseInt((this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight), 10);

        if (!this.CommonScrollConfig.beginMove) {
            this.CommonScrollConfig.beginMove = true;
            this.CommonScrollConfig.verticalSlide = (Math.abs(this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY) >= Math.abs(this.CommonScrollConfig.currentX - this.CommonScrollConfig.lastCurrentX));
        }
        // verticalSlide: 表明不是左右滚动
        if (this.CommonScrollConfig.isTouchStart && this.CommonScrollConfig.verticalSlide) {
            if (this.CommonScrollConfig.translateY >= maxScroll
                || this.CommonScrollConfig.translateY <= minScroll
            ) {
                if (!this.CommonScrollConfig.ifout) {
                    this.CommonScrollConfig.criticalValue = e.touches[0].pageY;
                    this.CommonScrollConfig.criticalY = this.CommonScrollConfig.translateY;
                } else {
                    this.CommonScrollConfig.direction = this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY > 0 ? 1 : -1;

                    // 这里自己目前还是不确定用什么缓动函数比较好
                    this.CommonScrollConfig.translateY += 0.3 * (this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY);
                    this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

                    // 这个时候对滑动距离取对数
                    if ((new Date().getTime() - this.CommonScrollConfig.timeStep) > 100) {
                        // 这个时候距离不再是标准的距离了
                        // 理论上这里的pageY的计算方式应该发生一些变化
                        const currLocation = e.touches[0].pageY;

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

                if ((new Date().getTime() - this.CommonScrollConfig.timeStep) > 100) {
                    this.CommonScrollConfig.trace.push(e.touches[0].pageY);
                    this.CommonScrollConfig.timeStep += 100;
                }

                this.CommonScrollConfig.translateY += (this.CommonScrollConfig.currentY - this.CommonScrollConfig.lastCurrentY);
                this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);
            }
            this.CommonScrollConfig.lastCurrentY = this.CommonScrollConfig.currentY;
        }

        if (this.CommonScrollConfig.translateY < minScroll + this.props.lowerBound) {
            this.props.onLowerArrive();
            if(this.props.showLoadMore) {
                this.CommonScrollConfig.stopResponse = true;
            }
        }
    }
    handleTouchEnd(e) {
        // e.preventDefault();

        this.CommonScrollConfig.currentY = e.changedTouches[0].pageY;

        if (this.needRefresh) {
            this.props.refresh();
        }

        if ((new Date().getTime() - this.CommonScrollConfig.timeStep) > 100) {
            this.CommonScrollConfig.trace.push(e.changedTouches[0].pageY);
            this.CommonScrollConfig.timeStep += 100;
        }

        if (this.CommonScrollConfig.isTouchStart && this.CommonScrollConfig.verticalSlide) {
            const curr = new Date().getTime();
            const dt = curr - this.CommonScrollConfig.startTime;
            if (dt > 300) {
                // 如果滑动的时间大于300ms 这个时候应该取后面的一部分的速度
                // 这个时候该如何计算速度呢 我们需要用到之前的轨迹记录

                const interval = (curr - this.CommonScrollConfig.timeStep) + 300;
                const distance = this.CommonScrollConfig.currentY - this.CommonScrollConfig.trace[this.CommonScrollConfig.trace.length - 3];
                let speed = distance / interval;

                this.CommonScrollConfig.direction = speed > 0 ? 1 : -1;
                speed = Math.abs(speed);
                this.go(speed, this.props.ease || CommonScroll.easeSmooth, true);
            } else {
                const distance = this.CommonScrollConfig.currentY - this.CommonScrollConfig.y1;
                let speed = distance / dt;

                this.CommonScrollConfig.direction = speed > 0 ? 1 : -1;
                speed = Math.abs(speed);
                this.go(speed, this.props.ease || CommonScroll.easeSmooth, true);
            }
        }
    }

    moveEnd() {
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
            this.CommonScrollConfig.translateY = this.CommonScrollConfig.translateY + Math.ceil(((this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight) - this.CommonScrollConfig.translateY) / 2);
            this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

            if (this.CommonScrollConfig.translateY < (this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight)) {
                window.requestAnimationFrame(this.moveEnd.bind(this));
            } else {
                this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY((this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight));
            }
        }
    }
    go(speed, ease, ifend) {
        const speed0 = speed;
        const goBeginTime = new Date().getTime();
        let lastTime = new Date().getTime();

        const frame = function () {

            // if(this.CommonScrollConfig.stopResponse) return;

            const time = new Date().getTime() - lastTime;
            const dt = (time + lastTime) - goBeginTime;
            const frameDistance = Math.ceil(speed * time) * this.CommonScrollConfig.direction;
            if (time === 0) {
                window.requestAnimationFrame(frame.bind(this));
                return;
            }
            this.CommonScrollConfig.translateY += frameDistance;
            this.CommonScrollConfig.target.style.transform = CommonScroll.constructTransformForY(this.CommonScrollConfig.translateY);

            if (this.CommonScrollConfig.translateY >= this.props.maxScroll
                || this.CommonScrollConfig.translateY <= (this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight)
            ) {
                speed = ease(speed0, dt, 0.2);
            } else {
                speed = ease(speed0, dt, 0.0006);
            }
            lastTime = new Date().getTime();
            const minScroll = parseInt((this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight), 10);

            if (this.CommonScrollConfig.translateY < minScroll + this.props.lowerBound) {
                this.props.onLowerArrive();
                if(this.props.showLoadMore) {
                    this.CommonScrollConfig.stopResponse = true;
                }
            }

            if (speed >= MINSPEED) {
                this.CommonScrollConfig.frameId = window.requestAnimationFrame(frame.bind(this));
            } else if (ifend) {
                this.CommonScrollConfig.isTouchStart = false;
                if (this.CommonScrollConfig.translateY >= this.props.maxScroll
                    || this.CommonScrollConfig.translateY <= (this.CommonScrollConfig.container.offsetHeight - this.CommonScrollConfig.target.scrollHeight)
                ) {
                    this.moveEnd();
                }
            }
        };

        this.CommonScrollConfig.frameId = window.requestAnimationFrame(frame.bind(this));
    }
    render() {
        return (
            <div ref="CommonScrollContainer"
                 id="CommonScrollContainer"
                 style={{width:this.props.width||"100%"}}
                 onClick={()=>{console.log("CommonScrollContainer");}}
            >
                {this.props.children}
            </div>
        );
    }
}

export default CommonScroll;
