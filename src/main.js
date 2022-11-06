import count from "./js/count";
import sum from "./js/sum";
import { mul } from "./js/math";
//要想webpack打包资源，必须引入改资源
import "./css/index.css";
import "./less/index1.less";
import "./css/iconfont.css";

console.log(mul(3, 3));
console.log(count(2, 1));
console.log(sum(1, 2, 3, 4, 5, 6));

if (module.hot) {
  //是否支持热模块替换功能
  module.hot.accept("./js/count");
  module.hot.accept("./js/sum");
}
