import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from "material-ui/DatePicker";
import $ from "jquery";
import Pagination from "../../../components/Pagination.jsx";
import {
    Table, 
    TableBody, 
    TableHeader, 
    TableHeaderColumn,
    TableRow, 
    TableRowColumn
 } from 'material-ui/Table';
const style = {
   width:"88px",
   height:"36px",
   border:"0px",
   background: "#00bcd4",
   color:"#fff",
   marginLeft:"15px"
};
let content = {float:"left",width:"17%",marginLeft:"2%"}
let label={fontSize:"16px",lineHeight:"60px"}
let input = {marginLeft:"29px",textIndent:"5px",width:"200px",height:"35px",border:"1px solid #ccc"}
let contentTime = {float:"left",width:"40%",marginLeft:"1%"}
export default class UserRCUsedStatistics extends Component {
    constructor(props) {
        super(props);
        this.ExcelOut= this.ExcelOut.bind(this)
        this.startTime = this.startTime.bind(this);
        this.endTime = this.endTime.bind(this);
        this.state = {
            level: 1,
            value: 1,
            listData: [],
            startTime:"",
            endTime: "",
            num:"",
            pageSize:10, //每页显示的条数
            goValue:1,  //要去的条数index
            indexList:[]//分页显示的数据
        }
    }


    componentWillMount() {
       
    }

    componentDidMount() {
        this.listData()
        this.pageNext(this.state.goValue)
    }
     //列表展示
    listData() {
        let url = getHost() + "/rest/rebate/cardNum/outList";
        // var oldTime = (new Date("2018/01/01")).getTime()
        // var newsTime = (new Date("2018/01/30")).getTime()
        // var oldtime2 = (new Date("2018/02/01")).getTime()
        // var newtime2 = (new Date("2018/02/30")).getTime()
        // console.log(oldTime)
        // console.log(newsTime)
        let data = {
            // customerName:" ",
            // customerId:" ",
            // address:" ",
            // start:" ",
            // end:" ",
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
                let data = response.data.list;
                self.setState({listData: data})
                let str = JSON.stringify(data); 
                sessionStorage.setItem("UserUsedlistData",str)
                self.pageNext(1)
                // console.log(this.refs.page)
            } else if (response.result === 2) {
                //登录失效
                localStorage.removeItem("token");
                location.href = baseName + "/Login";
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));
    }
    //搜索按钮
    SearchClick() {
        let url = getHost() + "/rest/rebate/cardNum/outList";
        let time = document.querySelectorAll(".time");
        // let start = time[0].innerText.slice(0,10);
        // let end   = time[0].innerText.slice(11,21);
        // let start2 = start.replace(/\//g,"-");
        // let end2 = end.replace(/\//g,"-");
        // var endFormatTimeS = new Date(end).getTime();
        let userId = this.refs.userId.value//用户ID搜索
        let userName = this.refs.userName.value//用户昵称搜索
        let addressValue = this.refs.address.value//地址搜索
        if(userId==""&&userName==""&&addressValue==""){
            this.listData()
        }else{
            let data = {}
            if (userId) {
              data.customerId = userId;
            }
            if (userName) {
              data.customerName = userName;
            }
            if (addressValue) {
              data.address = addressValue;
            }
            if (this.state.startTime) {
                data.start = this.state.startTime
            }
            if (this.state.endTime) {
                 data.end = this.state.endTime
            } 
            data.token = localStorage.getItem("token")
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
                    console.log("error");
                }.bind(this)
            };
            let self = this;
            $.ajax(settings).done(
                function (response) {
                    if (response.result === 1) {
                        let data = response.data.list;
                        let str = JSON.stringify(data); 
                        sessionStorage.setItem("UserUsedlistData",str)
                        self.pageNext(this.state.goValue)
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        self.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            )
          }
    }
    ExcelOut(){
            let url = getHost() + "/rest/rebate/cardNum/export";
            let a = "&customerId="
            let b = "&customerName="
            let c = "&address="
            if(!this.refs.userId.value){
                a  = " "
            }
            if(!this.refs.userName.value){
                b  = " "
            }
            if(!this.refs.address.value){
                c  = " "
            }
            document.location.href = getHost() + "/rest/rebate/cardNum/export?1=1"+a+this.refs.userId.value+b+this.refs.userName.value+c+this.refs.address.value
    }
     //设置分页数据内容
    setPage(num){
        let  b = JSON.parse(sessionStorage.getItem("UserUsedlistData"))   
        this.setState({
            indexList:b.slice((num-1)*this.state.pageSize,num*this.state.pageSize)
        })
    }
   //分页事件
     pageNext (num) {
        let c  =  JSON.parse(sessionStorage.getItem("UserUsedlistData"))
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
     // 获取时间信息
    startTime(e, value) {
        // let formatTimeS = new Date(value);
        let c  = (value.getMonth() + 1).toString()
        let d = 0 + c
        let a = value.getMonth() + 1<10? d :value.getMonth() + 1
        let datevalue=value.getFullYear() + '-' + a + '-' + value.getDate();
        this.setState({
            startTime: datevalue,
        })
    }

    endTime(e, value) {
        // let formatTimeS = new Date(value).getTime();
        let c  = (value.getMonth() + 1).toString()
        let d = 0 + c
        let a = value.getMonth() + 1<10? d :value.getMonth() + 1
        let datevalue=value.getFullYear() + '-' + a + '-' + value.getDate();  
        this.setState({endTime: datevalue})
    }
    render() {
        return (
            <div style={{minWidth: "1000px"}}>
               <div style={{height:"72px"}}>
                <div style={contentTime}>
                          <label style={{fontSize:"16px",lineHeight:"72px",float:"left"}}>日期时间区间</label>
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
                <div style={content}>
                    <label style={label}>用户ID</label>
                    <input type="text" ref="userId" placeholder="请输入用户id" style={input}/>
                </div>
                <div style={content}>
                    <label style={label}>用户昵称</label>
                    <input type="text" ref="userName" placeholder="请输入用户昵称" style={input}/>
                </div>
                <div style={content}>
                    <label style={label}>地理位置</label>
                    <input type="text" ref="address" placeholder="请输入地理位置" style={input}/>
                </div>
                </div>
                <div style={{textAlign: "left"}}>
                    <button style={style} onClick={this.SearchClick.bind(this)}>搜索</button>
                    <button style={style} onClick={this.ExcelOut}>导出</button>
                </div>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>用户昵称</TableHeaderColumn>
                            <TableHeaderColumn>用户id</TableHeaderColumn>
                            <TableHeaderColumn>消耗房卡数量</TableHeaderColumn>
                            <TableHeaderColumn>地理位置</TableHeaderColumn>
                            <TableHeaderColumn>日期</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {this.state.indexList.map((item, i) =>
                        <TableRow key={i}>
                             <TableRowColumn>{item.NickName}</TableRowColumn>
                             <TableRowColumn>{item.UserID}</TableRowColumn>
                             <TableRowColumn>{item.CardNum}</TableRowColumn>
                             <TableRowColumn>{item.Address}</TableRowColumn>
                             <TableRowColumn>{item.Dt}</TableRowColumn>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                <Pagination total={100} ref="page" page={this.state.num} onChange={this.pageNext.bind(this)} />
            </div>
        )
    }


}