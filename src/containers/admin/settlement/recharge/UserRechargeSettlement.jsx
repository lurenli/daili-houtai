import React, {Component} from "react";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import DatePicker from "material-ui/DatePicker";
import $ from "jquery";
import {Link} from 'react-router';
import Pagination from "../../../../components/Pagination.jsx";
import {
    Table, 
    TableBody, 
    TableHeader, 
    TableHeaderColumn, 
    TableRow, 
    TableRowColumn
} from "material-ui/Table";
let style = {
   width:"88px",
   height:"36px",
   border:"0px",
   background: "#00bcd4",
   color:"#fff",
   marginLeft:"15px"
};
let content = {float:"left",width:"18%",marginLeft:"1%"}
let label={fontSize:"16px",lineHeight:"60px"}
let input = {marginLeft:"29px",textIndent:"5px",width:"210px",height:"35px",border:"1px solid #ccc"}
let contentTime = {float:"left",width:"42%",marginLeft:"1%"}
let baseName = '/game-web';
export default class UserRechargeSettlement extends Component {
    constructor(props) {
        super(props);
        this.detail = this.detail.bind(this);
        this.SearchClick = this.SearchClick.bind(this);
        this.startTime = this.startTime.bind(this);
        this.endTime = this.endTime.bind(this);
        this.state = {
            level: "",
            value: 1,
            roles: [],
            tableList: [], //列表
            tableList1: [],
            Detailid: "",
            startTime:"",
            endTime: "",
            num:"",
            pageSize:10, //每页显示的条数
            goValue:1,  //要去的条数index
            indexList:[]//分页显示的数据
        };
    }

    componentWillMount() {
        
    }
    tableList(){
        let url = process.env.HOST_URL + "/rest/rebate/list/customerRebate/sum";
        // let timer = document.getElementsByClassName("timer");
        // let start = timer[0].innerText.slice(3, 14);
        // let end = timer[0].innerText.slice(16, 26);
        // var startFormatTimeS = new Date(start).getTime();
        // var endFormatTimeS = new Date(end).getTime();
        let now = new Date().getTime()
        let data = {
            token: localStorage.getItem("token"),
            start: 0,
            end: now
        };
        let settings = {
            async: true,
            url: url,
            cache: false,
            xhrFields: {
                withCredentials: true
            },
            method: "POST",
            data: data,
            error: function (e) {
                //弹出报错内容
                console.log("error");
            }.bind(this)
        };
        let self = this;
        $.ajax(settings).done(
            function (response) {
                if (response.result === 1) {
                    let data = response.data.list
                    self.setState({tableList:data}); 
                    let str = JSON.stringify(data); 
                    sessionStorage.setItem("UserRechlistData",str)
                    self.pageNext(this.state.goValue)
                } else if (response.result === 2) {
                    //登录失效
                    localStorage.removeItem("token");
                    location.href = baseName + "/Login";
                } else {
                    self.setState({snackOpen: true, error: response.message});
                }
            }.bind(this)
        );
    }
    RolesData() {
        let url = process.env.HOST_URL + "/rest/user/listRoles";
        let data = {token: localStorage.getItem("token")};
        let settings = {
            async: true,
            url: url,
            cache: false,
            xhrFields: {
                withCredentials: true
            },
            method: "POST",
            data: data,
            error: function (e) {
                //弹出报错内容
                console.log("error");
            }.bind(this)
        };
        let self = this;
        $.ajax(settings).done(
            function (response) {
                if (response.result === 1) {
                    let data = response.data;
                    self.setState({roles: data.roles});
                } else if (response.result === 2) {
                    //登录失效
                    localStorage.removeItem("token");
                    location.href = baseName + "/Login";
                } else {
                    self.setState({snackOpen: true, error: response.message});
                }
            }.bind(this)
        );
    }

    componentDidMount() {
        this.RolesData();
        this.tableList();
        this.pageNext(this.state.goValue)
    }

    SearchClick() {
        let url = process.env.HOST_URL + "/rest/rebate/list/customerRebate/sum";
        let userName = this.refs.userName.value;
        let userPhone = this.refs.userPhone.value;
        if(this.state.startTime==""||this.state.endTime==""){
            alert("时间区间必选") 
        }else{
            let data = {};
            if (userName&&this.state.startTime&&this.state.endTime) {
                data.username = userName;
            }
            if (userPhone&&this.state.startTime&&this.state.endTime) {
                data.phone = userPhone;
            }
            if (this.state.level && this.state.level != "全部"&&this.state.startTime&&this.state.endTime) {
                data.roleId = this.state.level;
            }else if(this.state.level == "全部"){
                this.tableList()
            }
             if (this.state.startTime) {
                data.start = this.state.startTime
            }
             if (this.state.endTime) {
                 data.end = this.state.endTime
             } 
            data.token = localStorage.getItem("token");
            // console.log(data);
            let settings = {
                async: true,
                url: url,
                cache: false,
                xhrFields: {
                    withCredentials: true
                },
                method: "POST",
                data: data,
                error: function (e) {
                    //弹出报错内容
                    console.log("error");
                }.bind(this)
            };
            let self = this;
            $.ajax(settings).done(
                function (response) {
                    if (response.result === 1) {
                        let data = response.data.list;
                        let str = JSON.stringify(data); 
                        sessionStorage.setItem("UserRechlistData",str)
                        self.pageNext(this.state.goValue)
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        self.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            );
          }
        }
    detail(item) {
           sessionStorage.setItem("UserDetailkey", item.user[0].id);
           let a = sessionStorage.getItem('UserDetailkey')
           // const newWindow = window.open(`http://localhost:8090/game-web/UserRechargeSettlementDetail`, '_blank')
           const newWindow = window.open(`http://120.26.215.224/game-web/UserRechargeSettlementDetail`, '_blank')
           newWindow.onload = () => newWindow.postMessage(a, window.origin)
    }
    //设置分页数据内容
    setPage(num){
            let  b = JSON.parse(sessionStorage.getItem("UserRechlistData"))   
            this.setState({
                indexList:b.slice((num-1)*this.state.pageSize,num*this.state.pageSize)
            })
    }
    //分页事件
     pageNext (num) {
        let  c =  JSON.parse(sessionStorage.getItem("UserRechlistData"))
        if(c){
            let pageNum = Math.ceil((c.length?c.length:1)/(this.state.pageSize))  
            if(num>pageNum){
                num = pageNum
                return num
            }else {
                 this.setState({
                    num:num
                })
                this.setPage(num)
            }
        }
    }
    // 获取时间信息
    startTime(e, value) {
        let formatTimeS = new Date(value).getTime();
        this.setState({
            startTime: formatTimeS,
        })
    }

    endTime(e, value) {
        let formatTimeS = new Date(value).getTime();
        this.setState({endTime: formatTimeS})
    }
    cancelLabel(){
       this.refs.userPhone.value="";
       this.refs.userName.value="";
       this.state.level = ""
       this.tableList()
    }
    render() {
        return (
            <div style={{minWidth: "1000px"}}>
                <div style={{height:"72px"}}>
                    <div style={content}>
                        <label style={label}>会员名称</label>
                        <input type="text" ref="userName" placeholder="请输入会员名称" style={input}/>
                    </div>
                    <div style={content}>
                        <label style={label}>会员等级</label>
                        <SelectField
                            style={{width: "50%", marginLeft: "5%", marginRight: "5%", verticalAlign: "bottom"}}
                            value={this.state.level}
                            autoWidth={true}
                            onChange={(event, index, value) => this.setState({level: value})}
                        >
                            <MenuItem value="全部" primaryText="全部"/>
                            {this.state.roles.map((item, i) => (
                                <MenuItem key={i} value={item.id} primaryText={item.name}/>
                            ))}
                        </SelectField>
                    </div>
                    <div style={content}>
                        <label style={label}>会员电话</label>
                        <input type="text" ref="userPhone" placeholder="请输入会员电话" style={input}/>
                    </div>
                    <div style={contentTime}>
                          <label style={{fontSize:"16px",lineHeight:"72px",float:"left"}}>用户充值时间区间</label>
                          <DatePicker
                            ref="time"
                            style={{marginLeft:"5%",float:"left"}}
                            hintText="请选择开始时间"
                            okLabel="确认"
                            cancelLabel="取消"
                            onChange={this.startTime}
                          />
                          <DatePicker
                            ref="time"
                            style={{marginLeft:"5%",float:"left"}}
                            hintText="请选择结束时间"
                            okLabel="确认"
                            cancelLabel="取消"
                            onChange={this.endTime}
                        />
                    </div>
                </div>
                <button  style={style} onClick={this.SearchClick}>搜索</button>
                <button  style={style} onClick={this.cancelLabel.bind(this)}>显示总数据</button>
                <br/>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>会员名称</TableHeaderColumn>
                            <TableHeaderColumn>电话</TableHeaderColumn>
                            <TableHeaderColumn>等级</TableHeaderColumn>
                            <TableHeaderColumn>充值时间</TableHeaderColumn>
                            <TableHeaderColumn>客户消费额度</TableHeaderColumn>
                            <TableHeaderColumn>会员返利额度</TableHeaderColumn>
                            <TableHeaderColumn>操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.indexList.map(
                            (item, i) => (
                                <TableRow key={i}>
                                    <TableRowColumn>{item.user[0].name}</TableRowColumn>
                                    <TableRowColumn>{item.user[0].phone}</TableRowColumn>
                                    <TableRowColumn>{item.user[0].role.name}</TableRowColumn>
                                    <TableRowColumn>{item.user[0].createDt}</TableRowColumn>
                                    <TableRowColumn>{item.total}</TableRowColumn>
                                    <TableRowColumn>{item.rebate}</TableRowColumn>
                                    <TableRowColumn>
                                        <span  style={{cursor:"pointer"}} onClick={() => this.detail(item)}>详情</span>
                                    </TableRowColumn>
                                </TableRow>
                            )
                        )}
                        {this.state.tableList1.map(
                            (item, i) => (
                                <TableRow key={i}>
                                    <TableRowColumn>{item.customerName}</TableRowColumn>
                                    <TableRowColumn>{}</TableRowColumn>
                                    <TableRowColumn>{item.customerId}</TableRowColumn>
                                    <TableRowColumn>{item.createDt}</TableRowColumn>
                                    <TableRowColumn>{item.total}</TableRowColumn>
                                    <TableRowColumn>{item.rebate}</TableRowColumn>
                                    <TableRowColumn>
                                        <Link to="/game-web/UserRechargeSettlementDetail"
                                              onClick={() => this.detail(item)} 
                                              style={{textDecoration:"none",cursor:"pointer",color:"#000000"}}>
                                            详情
                                        </Link>
                                    </TableRowColumn>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                <Pagination total={100} page={this.state.num}  onChange={this.pageNext.bind(this)} />
            </div>
        );
    }
}
