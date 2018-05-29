import React, {Component} from "react";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
// import RaisedButton from "material-ui/RaisedButton";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import DatePicker from "material-ui/DatePicker";
import Toggle from "material-ui/Toggle";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Pagination from "../../../components/Pagination.jsx";
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
let main ={}
let content={margin:"0 auto",marginTop:"20px",width:"680px",height:"22px",textAlign:"center"}
let label ={float:"left",color:"#000",display:"block",width:"100px",textAlign:"right"}
let input ={float:"left",display:"block",width:"200px",marginLeft:"20px",textIndent:"10px"}
let inputtop ={float:"left",display:"block",border:"none",width:"150px",marginLeft:"10px",textIndent:"10px"}
let boxLeft = {float:"left",width:"30%",marginLeft:"1%",marginRight:"2%"}
let boxLabel={fontSize:"16px",lineHeight:"60px"}
let boxInput = {marginLeft:"29px",textIndent:"5px",width:"230px",height:"35px",border:"1px solid #ccc"}
let title = {color:"red",fontSize:"20px",marginLeft:"90px"}
export default class ChildManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            open2:false,
            name: "",
            phone: "",
            tableList: [], //表数据
            parentId: "",
            level: "",
            value: 1,
            account: "",
            addName: "",
            addPhone: "",
            // addLevel: "",
            addParent: "",
            superior: "",
            superiorText: "",
            snackOpen: false,
            error: "",
            input: "",
            agentPhone: "",
            id: "",//编辑
            resetBtn: '',
            warn: '',
            accountTest: "none",
            addNameTest: "none",
            addPhoneTest: "none",
            num:"",
            pageSize:10, //每页显示的条数
            goValue:1,  //要去的条数index
            indexList:[],//分页显示的数据
            pageNum:""//页数
        };
    }

    //获取初始页面我的会员列表;
    componentWillMount() {

    }
    tableList(){
        let url = process.env.HOST_URL + "/rest/admin/user/listUsers";
        let data = {
            token: localStorage.getItem("token")
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
                    sessionStorage.setItem("ChildManagerlistData",str)
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
    componentDidMount() {
       this.tableList()
       this.pageNext(this.state.goValue)
    }
    //搜索
    SearchClick() {
        let url = process.env.HOST_URL + "/rest/admin/user/listUsers";
        let data = {};
        let userName = this.refs.userName.value
        let userPhone = this.refs.userPhone.value
        if(userName==""&&userPhone==""){
            this.tableList()
        }else{      
             if (userName) {
                data.username = userName;
            }
            if (userPhone) {
                data.phone = userPhone;
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
                        sessionStorage.setItem("ChildManagerlistData",str)
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
    //新增会员按钮
    AddClick() {
        this.setState({
            open:true,
            account: "",
            addName: "",
            addPhone: ""
         });
    }
    //确认增加
    TrueAdd(){
            if (!this.state.account) {
                this.setState({snackOpen: true, error: "请输入账号"});
            } else if(this.state.accountTest=="none"&&this.state.addNameTest=="none"&&this.state.addPhoneTest=="none"){
                let url = process.env.HOST_URL + "/rest/admin/user/addUser";
                let data = {
                    name: this.state.account,
                    username: this.state.addName,
                    phone: this.state.addPhone,
                    // roleId: roleId,
                    token: localStorage.getItem("token")
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
                            self.tableList()
                            self.setState({open: false});
                            window.location.reload()
                        } else if (response.result === 2) {
                            //登录失效
                            localStorage.removeItem("token");
                            location.href = baseName + "/Login";
                        } else {
                            this.setState({snackOpen: true, error: response.message});
                        }
                    }.bind(this)
                );
            }
    }
   //设置分页数据内容
    setPage(num){
        let  b = JSON.parse(sessionStorage.getItem("ChildManagerlistData"))
        this.setState({
            indexList:b.slice((num-1)*this.state.pageSize,num*this.state.pageSize)
        })
    }
   //分页事件
     pageNext(num) {
        let  c =  JSON.parse(sessionStorage.getItem("ChildManagerlistData"))
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

    OffClick(id, off) {
        //启用／停用
        let url = process.env.HOST_URL + "/rest/admin/user/offUser";
        let data = {
            uid: id,
            off: off === 0
            // token: localStorage.getItem('token')
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
                    self.SearchClick();
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

    //账号change事件
    AddUser(e) {
        this.setState({account: e.target.value});
        let str = e.target.value;
        let reg = /^[0-9a-zA-Z]{1,10}$/;
        if (reg.test(str)) {
            this.setState({
                accountTest: "none"
            });
        }
    }
  //账号脱离光标事件
    AddUser1(e) {
        let str = e.target.value;
        let reg = /^[0-9a-zA-Z]{1,10}$/;
        if (!reg.test(str)) {
            this.setState({
                accountTest: "inline-block"
            });
        }
    }
    //姓名change事件
    AddName(e) {
        this.setState({addName: e.target.value});
        let str = e.target.value;
        let reg = /^[a-zA-Z0-9\u4E00-\u9FFF]{1,20}$/;
        if (reg.test(str)) {
            this.setState({
                addNameTest: "none"
            });
        }
    }
    //姓名脱离光标事件
    AddName1(e) {
        let str = e.target.value;
        let reg = /^[a-zA-Z0-9\u4E00-\u9FFF]{1,20}$/;
        if (!reg.test(str)) {
            this.setState({
                addNameTest: "inline-block"
            });
        }
    }
   //电话号码change事件
    AddPhone(e) {
        this.setState({addPhone: e.target.value});
        let str = e.target.value;
        let reg = /^1[34578]\d{9}$/;
        if (reg.test(str)) {
            this.setState({
                addPhoneTest: "none"
            });
        }
    }
 //电话号码脱离光标事件
    AddPhone1(e) {
        let str = e.target.value;
        let reg = /^1[34578]\d{9}$/;
        if (!reg.test(str)) {
            this.setState({
                addPhoneTest: "inline-block"
            });
        }
    }

    //编辑按钮
    EditClick(item){
        this.setState({
            open2:true,
            id: item.id,
            account: item.username,
            addName: item.name,
            addPhone: item.phone,
        });
    }
    //确认编辑按钮
    TrueEdit(){
        if(this.state.addName&&this.state.addPhone){
        if(this.state.addNameTest=="none"&&this.state.addPhoneTest=="none"){
            let url = process.env.HOST_URL + "/rest/admin/user/updateUser";
            let data = {
                name: this.state.addName,
                phone: this.state.addPhone,
                id: this.state.id,
                token: localStorage.getItem("token")
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
                        self.tableList()
                        self.setState({
                            open2:false
                        })
                        window.location.reload()
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        this.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            );
        }
      }
    }
    //重置密码
    resetPassword(){
        if(this.state.addName&&this.state.addPhone){
        if(this.state.addNameTest=="none"&&this.state.addPhoneTest=="none"){
            let url = process.env.HOST_URL + "/rest/admin/user/updateUser";
            let data = {
                id: this.state.id,
                resetPwd:true,
                token: localStorage.getItem("token")
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
                        this.setState({
                            open2:false
                        })
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        this.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            );
        }
      }
    }
    render() {
        const actions = [
            <FlatButton
                label="取消"
                default={true}
                onClick={() => {
                    this.setState({
                        open: false,
                        accountTest: "none",
                        addNameTest: "none",
                        addPhoneTest: "none"
                    });
                }}
            />,
            <FlatButton label="确认新增" primary={true} onClick={this.TrueAdd.bind(this)}/>

        ];

         const actions2 = [
            <FlatButton 
               className="resetPassword"
               style={{display: this.state.resetBtn}} label="重置密码" primary={true}
               onClick={this.resetPassword.bind(this)}></FlatButton>,
            <FlatButton
                label="取消"
                default={true}
                onClick={() => {
                    this.setState({
                        open2: false,
                        accountTest: "none",
                        addNameTest: "none",
                        addPhoneTest: "none"
                    });
                }}
            />,
            <FlatButton label="确认编辑" primary={true} onClick={this.TrueEdit.bind(this)}/>
        ];
         const styles = {
            block: {
                maxWidth: 250
            },
            toggle: {
                marginBottom: 16
            },
            thumbOff: {
                backgroundColor: "#ffcccc"
            },
            trackOff: {
                backgroundColor: "#ff9d9d"
            },
            thumbSwitched: {
                backgroundColor: "red"
            },
            trackSwitched: {
                backgroundColor: "#ff9d9d"
            },
            labelStyle: {
                color: "red"
            }
        };
        const {editDialog, confirmLoading, ModalText} = this.state;
        return (
            <div style={{minWidth: "1000px"}}>
                <div style={{height:"72px"}}>
                    <div style={boxLeft}>
                            <label style={boxLabel}>会员名称</label>
                            <input type="text" ref="userName" style={boxInput} placeholder="请输入会员名称"/>
                    </div>
                    <div style={boxLeft}>
                            <label style={boxLabel}>会员电话</label>
                            <input type="text" ref="userPhone" style={boxInput} placeholder="请输入会员电话"/>
                    </div>
                </div>
                <button  style={style} onClick={this.SearchClick.bind(this)}>
                 搜索
                </button>
                <button style={style} onClick={this.AddClick.bind(this)}>
                 新增会员
                </button>
                <br/>
                <Table>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>会员名称</TableHeaderColumn>
                            <TableHeaderColumn>电话</TableHeaderColumn>
                            <TableHeaderColumn>等级</TableHeaderColumn>
                            <TableHeaderColumn>创建时间</TableHeaderColumn>
                            <TableHeaderColumn>状态</TableHeaderColumn>
                            <TableHeaderColumn>操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.indexList.map((item, i) => (
                            <TableRow key={i}>
                                <TableRowColumn>{item.name}</TableRowColumn>
                                <TableRowColumn>{item.phone}</TableRowColumn>
                                <TableRowColumn>{item.role.name}</TableRowColumn>
                                <TableRowColumn>{item.createDt}</TableRowColumn>
                                <TableRowColumn>
                                    <Toggle style={styles.toggle}/>
                                </TableRowColumn>
                                <TableRowColumn>
                                    <div onClick={this.EditClick.bind(this, item)}>修改</div>
                                    <div onClick={this.OffClick.bind(this, item.id, item.off)}>
                                        启用／停用
                                    </div>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination total={100} page={this.state.num}  onChange={this.pageNext.bind(this)} />
                <Dialog actions={actions} modal={true} open={this.state.open}>
                <div style={main}>
                    <h4 style={title}>新增会员</h4>  
                 <from>
                     <div style={content}>
                         <label  style={label}>账号</label>
                         <input type="text"
                            style={input}
                            onBlur={this.AddUser1.bind(this)}
                            className="editInfo"
                            onChange={this.AddUser.bind(this)}
                            value={this.state.account}
                         />
                          <span style={{
                              marginLeft: "10px",
                              color: "rgb(0, 188, 212)",
                              display: this.state.accountTest,
                              fontSize: "14px",
                          }}
                          >
                          请输入账号,只能输入英文和数字,长度最多10位
                        </span>
                    </div>
                    <div style={content}>
                       <label  style={label}>姓名</label>
                       <input type="text"
                            onBlur={this.AddName1.bind(this)}
                            style={input}
                            className="editInfo"
                            onChange={this.AddName.bind(this)}
                            value={this.state.addName}
                        />
                        <span style={{
                          marginLeft: "10px",
                          color: "rgb(0, 188, 212)",
                          display: this.state.addNameTest,
                          fontSize: "14px",
                         }}
                        >
                        请输入姓名最多20位,可输中/英文/数字,不可输入符号
                       </span>
                    </div>
                    <div style={content}>
                       <label  style={label}>电话</label>
                       <input type="text"
                            onBlur={this.AddPhone1.bind(this)}
                            style={input}
                            className="editInfo"
                            onChange={this.AddPhone.bind(this)}
                            value={this.state.addPhone}
                        />
                         <span style={{
                              marginLeft: "10px",
                              color: "rgb(0, 188, 212)",
                              display: this.state.addPhoneTest,
                              fontSize: "14px",
                          }}
                         >
                         请输入正确的11位电话号码,只能输入数字
                        </span>
                    </div>
                  </from>
                  </div>
                </Dialog>
                
                <Dialog actions={actions2} modal={true} open={this.state.open2}>
                <div style={main}>
                    <h4 style={title}>编辑会员</h4>  
                 <from>
                     <div style={content}>
                         <label  style={label}>账号</label>
                         <input type="text"
                            readOnly="readonly"
                            style={inputtop}
                            className="editInfo"
                            value={this.state.account}
                         />
                    </div>
                    <div style={content}>
                       <label  style={label}>姓名</label>
                       <input type="text"
                            onBlur={this.AddName1.bind(this)}
                            style={input}
                            className="editInfo"
                            onChange={this.AddName.bind(this)}
                            value={this.state.addName}
                        />
                        <span style={{
                          marginLeft: "5px",
                          color: "rgb(0, 188, 212)",
                          display: this.state.addNameTest,
                          fontSize: "14px",
                         }}
                        >
                        请输入姓名最多20位,可输中/英文/数字,不可输入符号
                       </span>
                    </div>
                    <div style={content}>
                       <label  style={label}>电话</label>
                       <input type="text"
                            onBlur={this.AddPhone1.bind(this)}
                            style={input}
                            className="editInfo"
                            onChange={this.AddPhone.bind(this)}
                            value={this.state.addPhone}
                        />
                        <span style={{
                              marginLeft: "10px",
                              color: "rgb(0, 188, 212)",
                              display: this.state.addPhoneTest,
                              fontSize: "14px",
                          }}
                         >
                        请输入正确的11位电话号码,只能输入数字
                        </span>
                    </div>
                  </from>
                  </div>
                </Dialog>
                <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.error}
                    autoHideDuration={2000}
                    onRequestClose={() => {
                        this.setState({
                            snackOpen: false
                        });
                    }}
                />
            </div>
        );
    }
}
