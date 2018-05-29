import React, {Component} from "react";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import DatePicker from "material-ui/DatePicker";
import $ from "jquery";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Pagination from "../../../../components/Pagination.jsx";
let search ={width:"88px",height:"36px",border:"0px",background: "#00bcd4",color:"#fff",marginLeft:"15px"}
let content = {float:"left",width:"22%",marginLeft:"1%",marginRight:"2%"}
let contentTime = {float:"left",width:"45%",marginLeft:"1%",marginRight:"2%"}
let label={fontSize:"16px",lineHeight:"60px"}
let input = {marginLeft:"29px",textIndent:"5px",width:"200px",height:"35px",border:"1px solid #ccc"}
let baseName = '/game-web';
export default class UserRechargeSettlementDetail extends Component {
    constructor(props) {
        super(props);
        this.SearchClick = this.SearchClick.bind(this);
        this.startTime = this.startTime.bind(this);
        this.endTime = this.endTime.bind(this);
        this.state = {
            level: "",
            value: 1,
            tableList: [], //列表
            id: "",
            startTime:"",
            endTime: "",
            // startTime1: "",//默认开始时间
            // endTime1: "",//默认结束时间
            num:"",
            pageSize:10, //每页显示的条数
            goValue:1,  //要去的条数index
            indexList:[]//分页显示的数据
        };
    }

    componentWillMount() {
        this.ListData() //这里一定要放在这里,不然报错
        // let now = new Date();
        // this.setState({endTime1: now});
        // let lastNow = new Date(now).getTime() - 604800000;
        // lastNow = new Date(lastNow);
        // console.log(lastNow)
        // this.setState({startTime1: lastNow})
        // 
    }

    componentDidMount() {
        // this.ListData() 
    }
    ListData(){
        let datailId = sessionStorage.getItem("key")
        this.setState({id: datailId});
        let url = process.env.HOST_URL + "/rest/rebate/list/customerRebate/details";
        let now = new Date().getTime()
        let data = {
            token: localStorage.getItem("token"),
            start: 0,
            end: now
            // customerId: datailId
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
                    self.setState({tableList: data}); 
                    let str = JSON.stringify(data); 
                    sessionStorage.setItem("UserReSettlistData",str)
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
        // let nowdata = new Date()
        // let enddata  = new Date()
        // let nowdate = new Date(nowdata).getTime();
        // let enddate = new Date(enddata).getTime();
        // this.setState({
        //     startTime:nowdata,
        //     endTime:enddata
        // })
    }
    SearchClick() {
        let url = process.env.HOST_URL + "/rest/rebate/list/customerRebate/details";
        let userId = this.refs.userId.value
        let userName = this.refs.userName.value
        if(this.state.startTime==""||this.state.endTime==""){
           alert("时间区间不能为空")
        }else{
            let data = {};
            if (userId) {
                data.customerId = userId;
            }
            if (userName) {
                data.customerName = userName;
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
                        sessionStorage.setItem("UserReSettlistData",str)
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
       this.ListData()
   }
    //设置分页数据内容
    setPage(num){
        let  b = JSON.parse(sessionStorage.getItem("UserReSettlistData"))   
        this.setState({
            indexList:b.slice((num-1)*this.state.pageSize,num*this.state.pageSize)
        })
    }
   //分页事件
     pageNext (num) {
        let  c =  JSON.parse(sessionStorage.getItem("UserReSettlistData"))
        if(c){
            let pageNum = Math.ceil((c.length?c.length:1)/(this.state.pageSize))  
            if(num>pageNum){
                num = pageNum
                return num
            }else {
                 this.setPage(num)
                 this.setState({
                    num:num
                })
            }
        }
    }
  
    render() {
       
        return (
            <div style={{minWidth: "1000px"}}>
                <div style={{height:"72px"}}>
                    <div style={content}>
                        <label style={label}>用户ID</label>
                        <input type="text" ref="userId" style={input} placeholder="请输入用户ID"/>
                    </div>
                    <div style={content}>
                        <label style={label}>用户昵称</label>
                        <input type="text" ref="userName" style={input} placeholder="请输入用户昵称"/>
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
                <button  style={search} onClick={this.SearchClick}>搜索</button>
                <button  style={search} onClick={this.cancelLabel.bind(this)}>显示总数据</button>
                <br/>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>用户昵称</TableHeaderColumn>
                            <TableHeaderColumn>用户ID</TableHeaderColumn>
                            <TableHeaderColumn>充值时间</TableHeaderColumn>
                            <TableHeaderColumn>充值金额</TableHeaderColumn>
                            <TableHeaderColumn>兑换房卡数</TableHeaderColumn>
                            <TableHeaderColumn>返利金额</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.indexList.map(
                            (item, i) => (
                                <TableRow key={i}>
                                    <TableRowColumn>{item.customerName}</TableRowColumn>
                                    <TableRowColumn>{item.customerId}</TableRowColumn>
                                    <TableRowColumn>{item.createDt}</TableRowColumn>
                                    <TableRowColumn>{item.total}</TableRowColumn>
                                    <TableRowColumn>{item.cardNum}</TableRowColumn>
                                    <TableRowColumn>{item.rebate}</TableRowColumn>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                <Pagination total={100}  page={this.state.num}  onChange={this.pageNext.bind(this)} />
            </div>
        );
    }
}
