import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import $ from "jquery";
let baseName = '/game-web';
const style = {
   width:"88px",
   height:"36px",
   border:"0px",
   background: "#00bcd4",
   color:"#fff",
   marginLeft:"15px"
};
let content={margin:"0 auto",marginTop:"25px",width:"500px",height:"22px",textAlign:"center"}
let label ={float:"left",color:"#000",display:"block",width:"200px"}
let input ={float:"left",display:"block",width:"250px",marginLeft:"50px",textIndent:"10px"}
let main ={textAlign:"center"}
let edit = {float:"left",width:"50px",cursor:"pointer"}
export default class UserRechargeRule extends Component {
    constructor(props) {
        super(props);
        this.AddShow = this.AddShow.bind(this);
        this.EditClick = this.EditClick.bind(this);
        this.Trueedit  = this.Trueedit.bind(this);
        this.AddClick = this.AddClick.bind(this);
        this.state = {
            open: false,
            open2:false,
            listData:[],
            amount:"",
            cardNum:""
        }
    }


    componentWillMount() {
        this.Listshow()
    }

    componentDidMount() {
    }
    //列表展示
    Listshow(){
        let url = getHost() + "/rest/rebate/rule/recharge/list";
        let data = {token: localStorage.getItem('token')};
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
                self.setState({listData: data.list})
            } else if (response.result === 2) {
                //登录失效
                localStorage.removeItem("token");
                location.href = baseName + "/Login";
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));
    }
    AddShow() {
        this.setState({open: true})
    }
    amount(e){
        this.setState({amount: e.target.value})
    }
    cardnum(e){
        this.setState({cardNum: e.target.value})
      }
      //新增保存
    AddClick() {
        let url = getHost() + '/rest/rebate/rule/recharge/update';
        let data = {
            amount: this.state.amount,
            cardNum: this.state.cardNum,
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
                self.Listshow();
            } else if (response.result === 2) {
                //登录失效
                localStorage.removeItem("token");
                location.href = baseName + "/Login";
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));
        this.setState({open: false})
    }
     //编辑按钮
   EditClick(item,i){ 
       this.setState({
            open2: true,
            amount:item.amount,
            cardNum:item.cardnum,
            token: localStorage.getItem('token')
       })
   }
   Trueedit(){
      let url = getHost() + '/rest/rebate/rule/recharge/update';
            let data = {
               amount:this.state.amount,
               cardNum:this.state.cardNum,
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
                    self.Listshow();
                } else if (response.result === 2) {
                    //登录失效
                    localStorage.removeItem("token");
                    location.href = baseName+"/Login";
                } else {
                    self.setState({snackOpen: true, error: response.message})
                }
            }.bind(this));
            this.setState({open2: false})
        }
    DeleteClick(item){
        let True = confirm("确认删除这条数据吗")
        if(True){
        let url = getHost() + '/rest/rebate/rule/recharge/del';
            let data = {
               amount:item.amount,
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
                    self.Listshow();
                } else if (response.result === 2) {
                    //登录失效
                    localStorage.removeItem("token");
                    location.href = baseName+"/Login";
                } else {
                    self.setState({snackOpen: true, error: response.message})
                }
            }.bind(this));
        }
    }
     render() {
        const actions = [
            <FlatButton
                label="取消"
                default={true}
                onClick={() => {
                    this.setState({open: false});
                }}
            />,
            <FlatButton
                label="新增/保存"
                primary={true}
                onClick={this.AddClick}
            />,
        ];
        const actions2 = [
            <FlatButton
                label="取消"
                default={true}
                onClick={() => {
                    this.setState({open2: false});
                }}
            />,
            <FlatButton
                label="确认编辑"
                primary={true}
                onClick={this.Trueedit}
            />,
        ];
        return (
            <div style={{minWidth: "1000px"}}>
                <div style={{height:"100px"}}>
                    <button  style={style} onClick={this.AddShow}>新增</button>
                </div>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>充值金额</TableHeaderColumn>
                            <TableHeaderColumn>兑换房卡数量</TableHeaderColumn>
                            <TableHeaderColumn>操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {this.state.listData.map((item, i) =>
                            <TableRow key={i}>
                            <TableRowColumn>{item.amount}</TableRowColumn>
                            <TableRowColumn>{item.cardnum}</TableRowColumn>
                            <TableRowColumn>
                             <div style={edit} onClick={()=> this.EditClick(item,i)}>编辑</div>
                             <div style={edit} onClick={()=> this.DeleteClick(item,i)}>删除</div>
                          </TableRowColumn>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                <Dialog
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                    <div style={main}>                        
                     <h3>新增用户充值规则</h3>
                     <from>
                          <div style={content}>
                             <label  style={label}>充值余额</label>
                             <input type="text"   onChange={this.amount.bind(this)} style={input} placeholder={"单行输入"}/>
                          </div>
                          <div style={content}> 
                              <label style={label}>兑换房卡数量</label>
                              <input type="text"  onChange={this.cardnum.bind(this)} style={input} placeholder={"单行输入"}/>
                           </div>
                      </from>
                   </div>
                </Dialog>

                <Dialog
                    actions={actions2}
                    modal={true}
                    open={this.state.open2}
                >
                    <div style={main}>                        
                     <h3>编辑用户充值规则</h3>
                     <from>
                          <div style={content}>
                             <label  style={label}>充值余额</label>
                             <input type="text"  onChange={this.amount.bind(this)} defaultValue={this.state.amount} style={input}  placeholder={"单行输入"}/>
                          </div>
                          <div style={content}> 
                              <label style={label}>兑换房卡数量</label>
                              <input type="text"  onChange={this.cardnum.bind(this)} defaultValue={this.state.cardNum} style={input}/>
                           </div>
                      </from>
                   </div>
                </Dialog>
            </div>
        )
    }

}