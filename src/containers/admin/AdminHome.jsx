import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import ChangePassword from '../ChangePassword.jsx';
import MemberManager from './member/MemberManager.jsx';
import UserRechargeSettlement from './settlement/recharge/UserRechargeSettlement.jsx';
import UserRechargeSettlementDetail from "./settlement/recharge/UserRechargeSettlementDetail"
import MemberRakeBackSettlement from './settlement/rakeback/MemberRakeBackSettlement.jsx';
import MemberRakeBackSettlementDetail from "./settlement/rakeback/MemberRakeBackSettlementDetail"
import UserRCGotStatistics from './statistics/UserRCGotStatistics.jsx';
import UserRCUsedStatistics from './statistics/UserRCUsedStatistics.jsx';
import MemberRebateRule from './rule/MemberRebateRule.jsx';
import UserRechargeRule from './rule/UserRechargeRule.jsx';
import Logout from "../Logout.jsx";
import $ from "jquery";
import {CSS} from "../../../assets/common.css"

let baseName = '/game-web';
let list = [{parent: '会员管理', children: ['我的会员']}, {
    parent: '会员结算',
    children: ['用户充值结算', '下级返佣结算'],
}];
export default class AdminHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userType: 0,
            menuList: [],
            open: false,
            clickText: "我的会员",
            page: <MemberManager/>,
        };
    }

    componentWillMount() {
        if (this.state.userType === 0) {
            list = [
                {parent: '会员管理', children: ['我的会员']},
                {parent: '会员结算', children: ['用户充值结算', '下级返佣结算']},
                {parent: '房卡统计', children: ['房卡发放统计', '房卡消耗统计']},
                {parent: '设置', children: ['会员返佣规则', '用户充值规则']}
            ];
        }
        this.setState({menuList: list});
    }

    componentDidMount() {
        // //获取用户信息
        let url = process.env.HOST_URL + '/rest/admin/user/info';
        let data = {
            token: localStorage.getItem('token')
        };
        let settings = {
            "async": true,
            "url": url,
            "cache": false,
            "xhrFields": {
                withCredentials: true
            },
            "method": "POST",
            "data": data,
            "error": function (e) {
                //弹出报错内容
                console.log('error')
            }.bind(this)
        };
        let self = this;
        $.ajax(settings).done(function (response) {
            if (response.result === 1) {
                let data = response.data;
                self.setState({userName: data.user.username})
            } else if (response.result === 2) {
                //登录失效
                localStorage.removeItem("token");
                location.href = baseName + "/Login";
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));


    }

    handleToggle() {
        this.setState({open: !this.state.open})
    };

    handleClose(text) {
        let newPage = null;
        switch (text) {
            case '我的会员':
                newPage = <MemberManager/>;
                break;
            case '用户充值结算':
                newPage = <UserRechargeSettlement/>;
                break;
            case '用户充值结算详情':
                newPage = <UserRechargeSettlementDetail/>;
                break;
            case '下级返佣结算':
                newPage = <MemberRakeBackSettlement/>;
                break;
            case '下级返佣结算详情':
                newPage = <MemberRakeBackSettlementDetail/>;
                break;
            case '房卡发放统计':
                newPage = <UserRCGotStatistics/>;
                break;
            case '房卡消耗统计':
                newPage = <UserRCUsedStatistics/>;
                break;
            case '会员返佣规则':
                newPage = <MemberRebateRule/>;
                break;
            case '用户充值规则':
                newPage = <UserRechargeRule/>;
                break;
        }
        this.setState({clickText: text, open: false, page: newPage})
    };

    Logout() {
        this.setState({clickText: '退出登录', open: false, page: <Logout/>});
    }

    PasswordClick() {
        this.setState({clickText: '修改密码', open: false, page: <ChangePassword/>});
    }

    render() {
        return (
            <div>
                <AppBar
                    style={{minWidth: "1000px"}}
                    title={this.state.clickText}
                    onLeftIconButtonClick={this.handleToggle.bind(this)}
                />
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <div>
                        <Subheader>管理员：{this.state.userName}</Subheader>
                        <div style={{height: "3rem", padding: "0.3rem"}}>
                            <button
                                className="adminlogoutbutton"
                                onClick={this.Logout.bind(this)}>
                                退出登录
                            </button>
                            <button
                                className="adminlogoutbutton"
                                onClick={this.PasswordClick.bind(this)}>
                                修改密码
                            </button>
                        </div>
                    </div>
                    <List>
                        {this.state.menuList.map((item, i) =>
                            <ListItem
                                key={i}
                                primaryText={item.parent}
                                initiallyOpen={true}
                                primaryTogglesNestedList={true}
                                nestedItems={item.children.map((child, index) =>
                                    <ListItem
                                        key={index}
                                        innerDivStyle={child === this.state.clickText ? {color: "rgb(0, 188, 212)"} : {}}
                                        primaryText={child}
                                        onClick={this.handleClose.bind(this, child)}
                                    />)}
                            />
                        )}
                    </List>
                </Drawer>

                <div>
                    {this.state.page}
                </div>

            </div>
        )
    }
}