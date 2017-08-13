/**
 * Created by Xiaotao.Nie on 08/07/2017.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

import React, { Component } from 'react';
import "./ReactScroller.less";
import ReactScrollerCore from "./ReactScrollerCore.jsx";

class ReactScroller extends Component{
    constructor(props) {
        super(props);

        let arr = [];

        for(let i = 0 ; i < 50 ; i++){
            arr.push(i);
        }

        this.state = {
            content:arr,
            showRefresh:false,
            showLoadMore:false
        };
    }
    render(){
        return(
            <ReactScrollerCore maxScroll={0} container="#ReactScrollerCoreContainer" target="#ReactScrollerCoretarget"
                               lowerBound={this.props.lowerBound || 50}
                               showRefreshTip = {() => {
                                   this.props.showRefreshTip();
                               }}
                               refresh = {() => {
                                   if(!this.props.showRefresh)return;
                                   this.props.refresh();
                               }}
                               onLowerArrive={()=>{
                                   if(!this.props.showLoadMore)return;
                                   this.props.loadMore();
                               }}
                               showRefresh={this.props.showRefresh}
                               showLoadMore={this.props.showLoadMore}
            >
                <div id="ReactScrollerCoreContainer"  onClick={()=>{console.log("ReactScrollerCoreContainer");}}
                     style={{height:this.props.containerHeight,width:this.props.containerWidth||"100%"}}>
                    <div id="ReactScrollerCoretarget" className="ReactScollerTarget" onClick={()=>{console.log("ReactScollerTarget");}}>
                        <div className={this.props.showRefresh ? (this.props.refreshTip ? "refreshShow":"refreshHide" ) : "refreshHide"}>{this.props.refreshTip}</div>
                        {this.props.children}
                        <div className={this.props.showLoadMore? (this.props.loadMoreTip ? "loadMoreShow":"loadMoreHide") : "loadMoreHide"}>
                            {this.props.loadMoreTip}
                        </div>
                    </div>
                </div>
            </ReactScrollerCore>
        )
    }
}

export default ReactScroller;
