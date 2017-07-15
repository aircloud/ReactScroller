/**
 * Created by Xiaotao.Nie on 08/07/2017.
 * All right reserved
 * IF you have any question please email iconie@tencent.com
 */

import React, { Component } from 'react';
import "./ReactScroller.less";
import ReactScrollerCore from "./ReactScrollerCore";

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
                          lowerBound={50}
                          showRefreshTip = {() => {
                              this.props.showRefreshTip();
                          }}
                          refresh = {() => {
                              if(this.props.showRefresh)return;
                              this.props.refresh();
                          }}
                          onLowerArrive={()=>{
                              if(this.props.showLoadMore)return;
                              this.props.loadmore();
                          }}
            >
                <div id="ReactScrollerCoreContainer" style={{height:this.props.containerHeight}}>
                    <div id="ReactScrollerCoretarget" className="ReactScollerTarget">
                        <div className={this.props.showRefresh?"refreshShow":"refreshHide"}>{this.props.refreshTip}</div>
                        {this.props.children}
                        <div className={this.props.showLoadMore?"loadMoreShow":"loadMoreHide"}>
                            {this.props.loadMoreTip}
                        </div>
                    </div>
                </div>
            </ReactScrollerCore>
        )
    }
}

export default ReactScroller;
