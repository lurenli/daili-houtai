import React, {Component} from "react";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
// import RaisedButton from "material-ui/RaisedButton";
import DatePicker from "material-ui/DatePicker";
import RaisedButton from "material-ui/RaisedButton";
import $ from "jquery";
import {Link} from 'react-router'
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
export default class MemberRakeBackSettlement extends Component {
    constructor(props) {
        super(props);
        this.SearchClick = this.SearchClick.bind(this);
        this.startTime = this.startTime.bind(this);
        this.endTime = this.endTime.bind(this);
        this.state = {
            level: 1,
            value: 1,
            tableList: [],
            tableList1: [],
            roles: [],//会员等级列表,
            startTime:"",
            endTime: "",
            num:"",
            pageSize:10, //每页显示的条数
            goValue:1,  //要去的条数index
            indexList:[]//分页显示的数据
        };
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
                    let data = response.data.roles;
                    self.setState({roles: data});
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
    tableList(){
        let url = process.env.HOST_URL + "/rest/rebate/list/proxyRebate/sum";
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
                    let data = response.data.list;
                    self.setState({tableList: data}); 
                    let str = JSON.stringify(data); 
                    sessionStorage.setItem("MemRakeBacklistData",str)
                    self.pageNext(this.state.goValue)
                } else if (response.result === 2) {
                    //登录失效
                    localStorage.removeItem("token");
                    location.href = baseName + "/Login";
                } else {
                    // self.setState({ snackOpen: true, error: response.message });
                }
            }.bind(this)
        );
    }
    componentWillMount() {
        
    }

    componentDidMount() {
        this.RolesData();
        this.tableList();
        this.pageNext(this.state.goValue)
    }
    //搜索
    SearchClick() {
        let url = process.env.HOST_URL + "/rest/rebate/list/proxyRebate/sum";
        let userName = this.refs.userName.value;
        let userPhone = this.refs.userPhone.value;
        if(this.state.startTime==""||this.state.endTime==""){
             alert("时间区间必选") 
        }else{
            let data = {};
            if (userName) {
                data.username = userName;
            }
            if (userPhone) {
                data.phone = userPhone;
            }
            if (this.state.level && this.state.level != "全部") {
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
                        sessionStorage.setItem("MemRakeBacklistData",str)
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
    //详情
    detail(item) {
        sessionStorage.setItem("MemberDetailkey", item.user[0].id);
        let a = sessionStorage.getItem('MemberDetailkey')
        // const newWindow = window.open(`http://localhost:8090/game-web/MemberRakeBackSettlementDetail`, '_blank')
        const newWindow = window.open(`http://120.26.215.224/game-web/MemberRakeBackSettlementDetail`, '_blank')
        newWindow.onload = () => newWindow.postMessage(a, window.origin)
    }
     //设置分页数据内容
    setPage(num){
        let  b = JSON.parse(sessionStorage.getItem("MemRakeBacklistData")) 
        this.setState({
            indexList:b.slice((num-1)*this.state.pageSize,num*this.state.pageSize)
        })

    }
   //分页事件
     pageNext (num) {
        let  c =  JSON.parse(sessionStorage.getItem("MemRakeBacklistData"))
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
                          <label style={{fontSize:"16px",lineHeight:"72px",float:"left"}}>用户返佣时间区间</label>
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
                <button style={style} onClick={this.SearchClick}>搜索</button>
                <button  style={style} onClick={this.cancelLabel.bind(this)}>显示总数据</button>
                <br/>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>姓名</TableHeaderColumn>
                            <TableHeaderColumn>电话</TableHeaderColumn>
                            <TableHeaderColumn>等级</TableHeaderColumn>
                            <TableHeaderColumn>返佣时间</TableHeaderColumn>
                            <TableHeaderColumn>下级会员业务总额</TableHeaderColumn>
                            <TableHeaderColumn>下级返佣总额</TableHeaderColumn>
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
                                        <span style={{cursor:"pointer"}} onClick={() => this.detail(item)}>详情</span>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        {this.state.tableList1.map((item, i) => (
                            <TableRow key={i}>
                                <TableRowColumn>{item.customerName}</TableRowColumn>
                                <TableRowColumn>{}</TableRowColumn>
                                <TableRowColumn>{item.customerId}</TableRowColumn>
                                <TableRowColumn>{item.createDt}</TableRowColumn>
                                <TableRowColumn>{item.total}</TableRowColumn>
                                <TableRowColumn>{item.rebate}</TableRowColumn>
                                <TableRowColumn>
                                    <Link to="/game-web/MemberRakeBackSettlementDetail"
                                          onClick={() => this.detail(item)}
                                          style={{textDecoration:"none",cursor:"pointer",color:"#000000"}}
                                    >
                                        详情                                      
                                    </Link>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination total={100}  page={this.state.num} onChange={this.pageNext.bind(this)} />
            </div>
        );
    }
}
