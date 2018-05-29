import React from 'react';
import {IndexRoute, Route} from 'react-router';
import App from '../src/App.jsx';
import Login from '../src/containers/Login.jsx'; //管理员登录
import AdminHome from '../src/containers/admin/AdminHome.jsx'; //主页
import Download from '../src/containers/Download.jsx'; //扫一扫下载
import Mdownload from '../src/containers/Mdownload.jsx'; //移动端下载
import MemberHome from '../src/containers/member/MemberHome.jsx'; //主页
import RechargeCenter from "../src/containers/recharge/RechargeCenter.jsx";
import UserRechargeSettlementDetail from "../src/containers/admin/settlement/recharge/UserRechargeSettlementDetail.jsx";
import MemberRakeBackSettlementDetail from "../src/containers/admin/settlement/rakeback/MemberRakeBackSettlementDetail.jsx";
// import RoomCardGive from '../src/containers/RoomCardGive.jsx';//房卡发放
let baseName = '/game-web';
export default (
    <Route path={baseName} component={App}>
        <IndexRoute component={AdminHome}/>
        <Route path={baseName + "/Download"} component={Download}/>
        <Route path={baseName + "/Mdownload"} component={Mdownload}/>
        /*登录页*/
        <Route path={baseName + "/Login"} component={Login}/>
        /*管理员主页*/
        <Route path={baseName + "/AdminHome"} component={AdminHome}/>
        /*会员主页*/
        <Route path={baseName + "/MemberHome"} component={MemberHome}/>
        /*充值中心*/
        <Route path={baseName + "/RechargeCenter"} component={RechargeCenter}/>
        /*用户充值结算详情*/
        <Route path={baseName + "/UserRechargeSettlementDetail"} component={UserRechargeSettlementDetail}/>
        /*下级返佣结算详情*/
        <Route path={baseName + "/MemberRakeBackSettlementDetail"} component={MemberRakeBackSettlementDetail}/>
        {/*<Route path="/RoomCardGive" component={RoomCardGive}/>*/}
    </Route>
)