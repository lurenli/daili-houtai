import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
// require('es6-promise').polyfill();
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import $ from "jquery";
const style = {
   width:"88px",
   height:"36px",
   border:"0px",
   background: "#00bcd4",
   color:"#fff",
   marginLeft:"15px"
};
let baseName = '/game-web';
const border ={
    border: "1px solid rgb(224, 224, 224)"
}
let edit = {float:"left",width:"50px",cursor:"pointer"}
let main ={textAlign:"center"}
let content={margin:"0 auto",marginTop:"20px",width:"500px",height:"22px",textAlign:"center"}
let contentTop={margin:"0 auto",marginTop:"20px",width:"500px",height:"48px",textAlign:"center"}
let label ={float:"left",color:"#000",display:"block",width:"200px"}
let input ={float:"left",display:"block",width:"250px",marginLeft:"50px",textIndent:"10px"}
let title = {color:"red",fontSize:"12px"}
export default class MemberRebateRule extends Component {
    constructor(props) {
        super(props);
        this.AddShow = this.AddShow.bind(this);
        this.EditClick= this.EditClick.bind(this);
        this.AddClick = this.AddClick.bind(this);
        this.Trueedit = this.Trueedit.bind(this)
        this.DeleteClick = this.DeleteClick.bind(this);
        this.Listshow = this.Listshow.bind(this);
        // this.EditName = this.EditName.bind(this);
        this.state = {
            open: false,
            opendia:false,
            listData:[],//列表数据列表
            roleId:"",
            ProxyRank:"",
            ProxyRank2:"",
            proxyAmount:"",
            customerRebateRate:"",
            proxyRebateRate:"",
            proxyRebateRate2:"",
            parentId:"",
            addParent:"",
            parentId2:"",
            addParent2:"",
            roles: [],//会员等级列表
        }
    }


    componentWillMount() {
        let url = process.env.HOST_URL + '/rest/user/listRoles';
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
                self.setState({roles: data.roles})// level: data.roles[0].id
            } else if (response.result === 2) {
                //登录失效
                localStorage.removeItem("token");
                location.href = baseName+"/Login";
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));
        this.Listshow()
    }
    
    componentDidMount() {
      
    }
    //列表展示
    Listshow(){
        let url = getHost() + "/rest/rebate/rule/proxy/list";
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
                location.href = baseName+"/Login";
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));
    }
    //新增按钮
    AddShow() {
       this.setState({open: true})
    }
    //新增时候等级列表方法
    ProxyRank(event, index, value) {
        let list = this.state.roles;
        let parentid = '';
        let parent = '';
        //console.log(value)// value是等级对应的数字
        for (let item of list) {
            if (item.id === value && item.parent) {
                parentid = item.parent.id;//上级用户等级id
                parent = item.parent.name;//上级用户等级名字
            }else if(item.id==11){
               parentid = 0//上级用户等级id
               parent = "无"//上级用户等级名字
            }
          this.setState({
            ProxyRank: value,
            addParent: parentid,
            superior: parent
          })
        }
    }
    //编辑时候等级列表方法
    ProxyRank2(event, index, value) {
        let list = this.state.roles;
        let parentid = '';
        let parent = '';
       // console.log(value)// value是等级对应的数字
        for (let item of list) {
            if (item.id === value && item.parent) {
                 parentid = item.parent.id;//上级用户等级id
                 parent = item.parent.name;//上级用户等级名字
            }else if(item.id==11){
               parentid = 0//上级用户等级id
               parent = "无"//上级用户等级名字
            }
          this.setState({
            ProxyRank2: value,
            addParent2: parentid,
            parentId2: parent
          })
        }
    }

     proxyAmount(e) {
        this.setState({proxyAmount: e.target.value})
    }
     customerRebateRate(e) {
        this.setState({customerRebateRate: e.target.value})
    }
    proxyRebateRate(e) {
      this.setState({proxyRebateRate: e.target.value})
    }
    proxyRebateRate2(e) {
        this.setState({proxyRebateRate2: e.target.value})
    }
    ParentId(e){
      let zx = Number("e.target.value")
      this.setState({ParentId: zx})
    }

   // 弹框 新增/保存
    AddClick() {
            let url = getHost() + '/rest/rebate/rule/proxy/update';
            let data = {
                roleId: this.state.ProxyRank,
                proxyAmount: this.state.proxyAmount,
                customerRebateRate: this.state.customerRebateRate,
                proxyRebateRate: this.state.proxyRebateRate?this.state.proxyRebateRate:0,
                ParentId:this.state.ParentId?this.state.ParentId:0,
                proxyRebateRate2:this.state.proxyRebateRate2?this.state.proxyRebateRate2:0,
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
            this.setState({open: false})
        }
    //删除
   DeleteClick(item){
       let True = confirm("确认删除这条数据吗")
        if(True){
        let url = getHost() + '/rest/rebate/rule/proxy/del';
            let data = {
               roleId:item.id,
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
   //编辑按钮
   EditClick(item){ 
       // console.log(item)
       this.setState({
                opendia: true,
                roleId: item.id,
                ProxyRank2: item.id,
                customerRebateRate:item.customerRebateRate,
                proxyAmount: item.proxyAmount,
                proxyRebateRate: item.role.parent?item.proxyRebateRate:"0",
                proxyRebateRate2:item.role.parent?item.proxyRebateRate2:"0",
                parentId2:item.role.parent?item.role.parent.name:"无",
                token: localStorage.getItem('token')
       })
   }
   
   //确认编辑按钮
   Trueedit(){
      let url = getHost() + '/rest/rebate/rule/proxy/update';
            let data = {
                roleId: this.state.ProxyRank2,
                // ProxyRank: this.state.ProxyRank,
                customerRebateRate: this.state.customerRebateRate,
                proxyAmount: this.state.proxyAmount,
                proxyRebateRate: this.state.proxyRebateRate,
                proxyRebateRate2:this.state.proxyRebateRate2,
                parentId:this.state.parentId2,
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
            this.setState({opendia: false})
        }
   warn(text){
        let warn = document.querySelector(".warn");
        warn.style.display = "block";
        this.setState({
            warn:text
        })
    }
    render() {
        const actions = [
            <FlatButton
                label="取消"
                default={true}
                onClick={() => {
                    this.setState({
                        open: false,
                        ProxyRank: "",
                        addParent: "",
                        superior:""
                    });
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
                    this.setState({opendia: false});
                }}
            />,
            <FlatButton
                label="确认修改"
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
                    <TableHeader style={border} adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>会员等级</TableHeaderColumn>
                            <TableHeaderColumn>需要交纳会员费金额</TableHeaderColumn>
                            <TableHeaderColumn>用户充值返利比例</TableHeaderColumn>
                            <TableHeaderColumn>上级返佣比例</TableHeaderColumn>
                            <TableHeaderColumn>上上级返佣比例</TableHeaderColumn>
                            <TableHeaderColumn>上级会员等级</TableHeaderColumn>
                            <TableHeaderColumn>操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.listData.map((item, i) =>
                            <TableRow key={i}>
                            <TableRowColumn>{item.role.name}</TableRowColumn>
                            <TableRowColumn>{item.proxyAmount}</TableRowColumn>
                            <TableRowColumn>{item.customerRebateRate}</TableRowColumn>
                            <TableRowColumn>{item.proxyRebateRate}</TableRowColumn>
                            <TableRowColumn>{item.role.parent?item.proxyRebateRate2:"0"}</TableRowColumn>
                            <TableRowColumn>{item.role.parent?item.role.parent.name:"无"}</TableRowColumn>
                            <TableRowColumn>
                                <div style={edit} onClick={()=> this.EditClick(item)}>编辑</div>
                                <div style={edit} onClick={()=> this.DeleteClick(item)}>删除</div>
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
                   <p className="warn" style={title}>{this.state.warn}</p>
                    <div style={main}>                        
                        <h3 >新增用户返利规则</h3>
                        <from>
                          <div style={contentTop}>
                             <label  style={{float:"left",lineHeight:"48px",color:"#000",display:"block",width:"200px"}}>
                               会员等级
                             </label>
                             <SelectField
                                className="agentGrade"
                                style={input}
                                value={this.state.ProxyRank}
                                onChange={this.ProxyRank.bind(this)}
                            >
                                 {this.state.roles.map((item, i) =>
                                    <MenuItem key={i} value={item.id} primaryText={item.name}/>
                                )}
                            </SelectField>
                          </div>
                          <div style={content}> 
                              <label style={label}>缴纳会员费</label>
                              <input type="text" className="needMoney" onChange={this.proxyAmount.bind(this)} style={input} placeholder={"单行输入"}/>
                           </div>
                           <div style={content}>
                              <label style={label}>用户充值返利比例</label>
                              <input type="text" className="rechargeMoney" onChange={this.customerRebateRate.bind(this)}  style={input} placeholder={"单行输入"}/>
                          </div>
                          <div style={content}>
                              <label style={label}>上级会员等级</label>                       
                              <span>{this.state.superior}</span>
                          </div>
                          <div style={content}>
                              <label style={label}>上级返佣比例</label>
                              <input type="text" className="lastGradeBack" onChange={this.proxyRebateRate.bind(this)} style={input} placeholder={"单行输入"}/>
                          </div>
                          <div style={content} >
                              <label style={label}>上上级返佣比例</label>
                              <input type="text" className="lastLastGradeBack" onChange={this.proxyRebateRate2.bind(this)} style={input} placeholder={"单行输入"}/>
                          </div>                 
                        </from>
                    </div>
                </Dialog>
                {/*编辑框*/}
                 <Dialog
                    actions={actions2}
                    modal={true}
                    open={this.state.opendia}
                >
                 <div style={main}>                        
                        <h3 >编辑用户返利规则</h3>
                        <from>
                          <div style={contentTop}>
                             <label  style={label}>会员等级</label>
                             <SelectField
                                style={input}
                                value={this.state.ProxyRank2}
                                onChange={this.ProxyRank2.bind(this)}>
                                 {this.state.roles.map((item, i) =>
                                    <MenuItem key={i} value={item.id} primaryText={item.name}/>
                                )}
                            </SelectField>
                          </div>
                          <div style={content}> 
                              <label style={label}>缴纳会员费</label>
                              <input type="text" onChange={this.proxyAmount.bind(this)} defaultValue={this.state.proxyAmount}  style={input} />
                           </div>
                           <div style={content}>
                              <label style={label}>用户充值返利比例</label>
                              <input type="text"   onChange={this.customerRebateRate.bind(this)} defaultValue={this.state.customerRebateRate}  style={input} />
                          </div>
                          <div style={content}>
                                 {/*<input type="text"
                                  style={input}
                                  onChange={this.ParentId.bind(this)} defaultValue={this.state.parentId}
                                 />*/}
                              <label style={label}>上级会员等级</label>                       
                              <span>{this.state.parentId2}</span>
                          </div>
                          <div style={content}>
                              <label style={label}>上级返佣比例</label>
                              <input type="text"  onChange={this.proxyRebateRate.bind(this)} defaultValue={this.state.proxyRebateRate} style={input} />
                          </div>
                          <div style={content} >
                              <label style={label}>上上级返佣比例</label>
                              <input type="text"  onChange={this.proxyRebateRate2.bind(this)} defaultValue={this.state.proxyRebateRate2}   style={input} />
                          </div>           
                                         
                        </from>
                    </div>
                </Dialog>
            </div>
        )
    }

}