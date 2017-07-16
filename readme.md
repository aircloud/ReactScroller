<p align="center">
<img src="https://www.10000h.top/images/data_img/reactscroller.png"/>
</p>
<p align="center">
<span style="font-size:16px;">An universal scroll component for React</span>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/reactscroller"><img src="https://img.shields.io/npm/v/reactscroller.svg" alt="Version"></a>
  <a href="https://github.com/aircloud/ReactScroller"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
</p>

## usage

```
npm i reactscroller --save
```

and then you can(ES6):

```
import ReactScoller from "reactscroller";
```

or:
 
```
var ReactScoller = require("reactscroller");
```

You can visit [ReactScrollerExample](https://github.com/aircloud/ReactScrollerExample) to find more details for usage.

**The following is a list of incoming properties：**

| property | Optional | Default | description | type |
| ------| ------ | ------ | ------ | ------ | 
| containerHeight | Necessary | null | The height for the outer container to scroll | String \| Number |
| containerWidth  | Optional | 100% | The width for the outer container to scroll |String \| Number |
| refresh | Optional | null | The function for pull down to refresh | Function |
| loadmore | Optional | null | The function for scroll up to load more | Function |
| lowerBound | Optional | 50 | The distance to the bottom when trigger the function loadmore | Number |
| refreshTip | Necessary | null | The refreshTip for the different stages of refreshing(a property of `this.state` is better. It should be changed) | String or Component |
| loadMoreTip | Necessary | null | The loadmoreTip for the different stages of loading more (a property of `this.state` is better. It should be changed) | String or Component |
| showRefresh | Necessary | null | Whether the refreshTip should be displayed | bool |
| showLoadmore | Necessary | null | Whether the loadMoreTip should be displayed | bool |

## Advanced

I peeled off the core module and the presentation module during the coding phase. So you can use the `ReactScrollerCore` to make more customization.

```
import {ReactScrollerCore} from "reactscroller";
```
I continue thinking and testing, if you have some good ideas please visit [issues](https://github.com/aircloud/ReactScroller/issues)

## License

MIT


