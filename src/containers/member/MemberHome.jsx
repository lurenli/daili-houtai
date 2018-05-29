import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import ChangePassword from '../ChangePassword.jsx';
import ChildManager from './childmember/ChildManager.jsx';
import UserRechargeSettlementDetail from './settlement/recharge/UserRechargeSettlementDetail.jsx';
import MemberRakeBackSettlementDetail from './settlement/rakeback/MemberRakeBackSettlementDetail.jsx';
import MyShareCode from "./share/MyShareCode.jsx"
import Logout from "../Logout.jsx";
import $ from "jquery";
import {CSS} from "../../../assets/common.css"

let baseName = '/game-web';
let list = [
    {parent: '会员管理', children: ['我的会员']},
    {
        parent: '会员结算',
        children: ['用户充值结算', '下级返佣结算']
    },
    {parent: '我的会员码', children: ['我的会员码']}
];
export default class MemberHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userType: 0,
            menuList: [],
            open: false,
            clickText: "我的会员",
            page: <ChildManager/>,
        };
    }


    componentWillMount() {
        if (this.state.userType === 0) {
            list = [
                {parent: '会员管理', children: ['我的会员']},
                {parent: '会员结算', children: ['用户充值结算', '下级返佣结算']},
                {parent: '我的会员码', children: ['我的会员码']},
            ];
        }
        this.setState({menuList: list});
    }

    componentDidMount() {
        //获取用户信息
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
                newPage = <ChildManager/>;
                break;
            case '用户充值结算':
                newPage = <UserRechargeSettlementDetail/>;
                break;
            case '下级返佣结算':
                newPage = <MemberRakeBackSettlementDetail/>;
                break;
            case '我的会员码':
                newPage = <MyShareCode/>;
                break;
        }
        this.setState({clickText: text, open: false, page: newPage})
    };

    PasswordClick() {
        this.setState({clickText: '修改密码', open: false, page: <ChangePassword/>});
    }

    DailiMydailima() {
        this.setState({clickText: '我的会员码', open: false, page: <MyShareCode/>});
    }

    Logout() {
        this.setState({clickText: '退出登录', open: false, page: <Logout/>});
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
                        <Subheader>会员:{this.state.userName}</Subheader>
                        <div style={{height: "3rem", padding: "0.3rem"}}>
                            <button
                                className="dalilogoutbutton"
                                onClick={this.Logout.bind(this)}>
                                退出登录
                            </button>
                            <button
                                className="dalilogoutbutton"
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