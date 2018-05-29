import React, {Component} from "react";
import TextField from "material-ui/TextField";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
// import RaisedButton from "material-ui/RaisedButton";
import Toggle from "material-ui/Toggle";
import Dialog from "material-ui/Dialog";
import Snackbar from "material-ui/Snackbar";
import DatePicker from "material-ui/DatePicker";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Pagination from "../../../components/Pagination.jsx";
import $ from "jquery";

let baseName = "/game-web";
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
let contentTop={margin:"0 auto",marginTop:"20px",width:"680px",height:"48px",textAlign:"center"}
let label ={float:"left",color:"#000",display:"block",width:"100px",textAlign:"right"}
let input ={float:"left",display:"block",width:"200px",marginLeft:"20px",textIndent:"10px"}
let inputtop ={float:"left",display:"block",border:"none",width:"150px",marginLeft:"10px",textIndent:"10px"}
let boxLeft = {float:"left",width:"30%",marginLeft:"1%",marginRight:"2%"}
let boxLabel={fontSize:"16px",lineHeight:"60px"}
let boxInput = {marginLeft:"29px",textIndent:"5px",width:"230px",height:"35px",border:"1px solid #ccc"}
let title = {color:"red",fontSize:"20px",marginLeft:"90px"}
export default class MemberManager extends Component {
    constructor(props) {
        super(props);
        this.AddClick = this.AddClick.bind(this);
        this.Editclick = this.Editclick.bind(this);
        this.state = {
            open: false,
            open2:false,
            name: "",
            phone: "",
            roles: [], //会员等级列表
            tableList: [], //表数据
            tableList2: [], //表数据
            parentid: "",
            level: "",
            value: 1,
            addUser: "",
            addName: "",
            addPhone: "",
            addLevel: "",
            addLevel2:"",
            addParent: "",
            superior: "",
            snackOpen: false,
            error: "",
            agentPhone: "",
            // addParent2:"",
            lastLevelNameList: [],
            lastLevelName: "",
            lastLevelName2:"",
            warn: "",
            accountTest: "none",
            addNameTest: "none",
            addPhoneTest: "none",
            addLevelTest: "none",
            addDateTest: "none",
            roleId: "",
            num:"",
            pageSize:10, //每页显示的条数
            goValue:1,  //要去的条数index
            indexList:[]//分页显示的数据
        };
    }

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
                    sessionStorage.setItem("MemberlistData",str)
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
    //会员等级列表
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
                    self.setState({roles: data.roles}); // level: data.roles[0].id
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
        //设置总页数
    }
    //搜索按钮
    SearchClick() {
        let url = process.env.HOST_URL + "/rest/admin/user/listUsers";
        let userName = this.refs.userName.value;
        let userPhone = this.refs.userPhone.value;
        if(userName==""&&userPhone==""&&this.state.level==""){
            this.tableList()
        }else{
            let data = {};
            if (userName) {
                data.username = userName;
            }
            if (userPhone) {
                data.phone = userPhone;
            }
            //会员等级
            if (this.state.level && this.state.level != "全部") {
                data.roleId = this.state.level;
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
                    console.log("error");
                }.bind(this)
            };
            let self = this;
            $.ajax(settings).done(
                function (response) {
                    if (response.result === 1) {
                        let data = response.data.list;
                        let str = JSON.stringify(data); 
                        sessionStorage.setItem("MemberlistData",str)
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
    //新增会员按钮
    AddClick(item, e) {
        this.setState({
            accountTest: "none",
            addNameTest: "none",
            addPhoneTest: "none",
            open:true,
            addUser: "",//账号
            addName: "",//姓名
            addPhone: "",//电话
            addLevel: "",//当前会员等级
            lastLevelName: "",//上级会员等级等级
        });
    }
    //编辑按钮
    Editclick(item) {
        // console.log(item)
            this.setState({
                open2:true,
                id: item.id,
                // roleId: item.role.id,
                addLevel2:item.role.id,
                lastLevelName2:item.role.parent?item.role.parent.id:"",
                addUser: item.username,//账号
                addName: item.name,//姓名
                addPhone: item.phone,//电话
                addParent2:item.proxyParent?item.proxyParent.role.id:"0",
                lastLevelName2:item.proxyParent?item.proxyParent.name:"",//上级会员等级(名字)
                token: localStorage.getItem('token')
            });
        if (item.role.id!= 11) {
            let url = process.env.HOST_URL + "/rest/admin/user/listUsers";
            let data = {
                token: localStorage.getItem("token"), 
                roleId: item.role.parent.id
           };
            let settings = {
                async: true,
                url: url,
                cache: false,
                method: "POST",
                data: data,
                xhrFields: {
                    withCredentials: true
                },
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
                        self.setState({lastLevelNameList: data});
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        self.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            )
        }else if(item.role.id==11){
            this.state.lastLevel2 = "";
            this.state.lastLevelName2 = "";
            this.state.lastLevelNameList = [];
        }

    }
    //编辑当前会员等级列表框选择方法
     addLevel2(event, index, value) {
        let list = this.state.roles;
        let parentid = '';
       //console.log(value)// value是等级对应的数字
        for (let item of list) {
            if (item.id === value && item.parent) {
                 parentid = item.parent.id;//上级用户等级id
             }
            else if(item.id==11){
              parentid = 0//上级用户等级id
            }
          this.setState({
            addLevel2: value
          })
         }
        
        if (value!= 11) {
            let url = process.env.HOST_URL + "/rest/admin/user/listUsers";
            let data = {
                token: localStorage.getItem("token"), 
                roleId: parentid
           };
            let settings = {
                async: true,
                url: url,
                cache: false,
                method: "POST",
                data: data,
                xhrFields: {
                    withCredentials: true
                },
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
                        self.setState({lastLevelNameList: data}); // level: data.roles[0].id
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        self.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            )
        }else if(value==11){
            this.setState({
               lastLevel2:"",
               lastLevelName2:"",
               lastLevelNameList:[]
           })
        }

    }
    //编辑时候上级会员等级列表框选择方法
     lastLevelName2(event,index,value) {
        this.setState({
            lastLevelName2:value
        })
    }
   //确认编辑按钮
   TrueEdit(){
        let url = process.env.HOST_URL + "/rest/admin/user/updateUser";
        let data = {
            id: this.state.id,
            username: this.state.addUser,
            name: this.state.addName,
            phone: this.state.addPhone,
            roleId: this.state.addLevel2,
            parentId: this.state.lastLevelName2,
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
        this.setState({
                open2: false,
            });
   }
   //确认新增
    TrueAdd() {
        if (
            this.state.accountTest == "none" &&
            this.state.addNameTest == "none" &&
            this.state.addPhoneTest == "none"
        ) {
            if (!this.state.addUser) {
                    this.setState({snackOpen: true, error: "请输入账号"});
            } else {
                    let url = process.env.HOST_URL + "/rest/admin/user/addUser";
                    let role = this.state.addLevel;
                    let data = {
                        username: this.state.addUser,
                        name: this.state.addName,
                        phone: this.state.addPhone,
                        roleId: this.state.addLevel,
                        parentId: this.state.lastLevelName,
                        token: localStorage.getItem("token")
                    };
                    // console.log(data)
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
                                // self.setState({tableList: this.state.tableList})
                                self.tableList()
                                self.setState({
                                    open: false,
                                    accountTest: "none",
                                    addNameTest: "none",
                                    addPhoneTest: "none"
                                });
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
   //设置分页数据内容
    setPage(num){
        let b = JSON.parse(sessionStorage.getItem("MemberlistData"))        
        this.setState({
            indexList:b.slice((num-1)*this.state.pageSize,num*this.state.pageSize)
        }) 

    }
   //分页事件
     pageNext (num) {
        let  c =  JSON.parse(sessionStorage.getItem("MemberlistData"))
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
        }else{
            this.setState({
                indexList:[],
                num:num
            })

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
        this.setState({addUser: e.target.value});
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
   //新增时候当前会员等级列表框选择
    AddLevel(e, index, value) {
        let list = this.state.roles;
        let parentid = '';
        let parent = '';
       //console.log(value)// value是等级对应的数字
        for (let item of list) {
            if (item.id === value && item.parent) {
                 parentid = item.parent.id;//上级用户等级id
                 // console.log(parentid)
             }
            else if(item.id==11){
              parentid = 0//上级用户等级id
            }
          this.setState({
            addLevel: value,
            addParent: parentid,
          })
        }

        if (value != 11) {
            let url = process.env.HOST_URL + "/rest/admin/user/listUsers";
            let data = {
                token: localStorage.getItem("token"), 
                roleId: parentid
           };
            let settings = {
                async: true,
                url: url,
                cache: false,
                method: "POST",
                data: data,
                xhrFields: {
                    withCredentials: true
                },
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
                        self.setState({lastLevelNameList: data}); // level: data.roles[0].id
                    } else if (response.result === 2) {
                        //登录失效
                        localStorage.removeItem("token");
                        location.href = baseName + "/Login";
                    } else {
                        self.setState({snackOpen: true, error: response.message});
                    }
                }.bind(this)
            )
        }else if(value==11){
            this.state.lastLevelName = "";
            this.state.lastLevelNameList =[];
        }
    }
    //新增时候上级会员列表框选择方法
    AddLastLevel(e,index, value) {
        this.setState({
            lastLevelName: value,
            lastLevelId: value
        })
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
            <FlatButton label="确认新增" primary={true} onClick={this.TrueAdd.bind(this)}/>
        ];
        
        const actions2 = [
            <FlatButton
                label="取消"
                default={true}
                onClick={() => {
                    this.setState({open2: false});
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
                <div style={boxLeft}>
                    <label style={boxLabel}>会员名称</label>
                    <input type="text" ref="userName" placeholder="请输入会员名称" style={boxInput}/>
                </div>
                <div style={boxLeft}>
                    <label style={boxLabel}>会员等级</label>
                    <SelectField
                        style={{width: "50%", marginLeft: "5%",marginRight: "5%", verticalAlign: "bottom"}}
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
                <div style={boxLeft}>
                    <label style={boxLabel}>会员电话</label>
                    <input type="text" ref="userPhone" placeholder="请输入会员电话" style={boxInput}/>
                </div>
                <button  style={style} onClick={this.SearchClick.bind(this)}>
                 搜索
                </button>
                <button style={style} onClick={this.AddClick.bind(this, "item")}>
                 新增会员
                </button>
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
                                    <div
                                        onClick={this.Editclick.bind(this, item)}
                                        style={{cursor: "pointer", color: "rgb(0, 188, 212)"}}
                                    >
                                        修改
                                    </div>
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination total={100} page={this.state.num} onChange={this.pageNext.bind(this)} />
                {/*新增会员框*/}
                <Dialog actions={actions} modal={true} open={this.state.open}>
                <div style={main}>
                    <h4 style={title}>新增会员</h4>
                    <div style={content}>
                     <label style={label}>帐号:</label>
                      <input
                        onBlur={this.AddUser1.bind(this)}
                        placeholder="帐号"
                        id="account"
                        value={this.state.addUser}
                        onChange={this.AddUser.bind(this)}
                        style={input}
                        type="text"
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
                   <label style={label}>姓名:</label>
                   <input
                        onBlur={this.AddName1.bind(this)}
                        placeholder="姓名"
                        id="account"
                        value={this.state.addName}
                        onChange={this.AddName.bind(this)}
                        style={input}
                        type="text"
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
                   <label style={label}>电话:</label>
                   <input
                        onBlur={this.AddPhone1.bind(this)}
                        placeholder="电话"
                        id="account"
                        value={this.state.addPhone}
                        onChange={this.AddPhone.bind(this)}
                        style={input}
                        type="text"
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
                <div style={contentTop}>
                   <label style={{float:"left",lineHeight:"48px",color:"#000",textAlign:"right",display:"block",width:"100px"}}>
                      会员等级:
                   </label>
                   <SelectField
                        style={input}
                        onChange={this.AddLevel.bind(this)}
                        value={this.state.addLevel}
                    >
                     {this.state.roles.map((item, i) =>
                         <MenuItem key={i} value={item.id} primaryText={item.name}/>
                        )}
                    </SelectField>
                </div>
                <div style={content}>
                   <label style={label}>上级会员:</label>
                   <SelectField
                        onChange={this.AddLastLevel.bind(this)}
                        style={input}
                        value={this.state.lastLevelName}
                    >
                    {this.state.lastLevelNameList.map((item, i) => (
                        <MenuItem key={i} value={item.id} primaryText={item.name} />
                    ))}
                   </SelectField>
                </div>
                </div>
                </Dialog>
              
              {/*编辑框*/}
              <Dialog actions={actions2} modal={true} open={this.state.open2}>
                <div style={main}>
                    <h4 style={title}>编辑会员</h4>
                    <div style={content}>
                     <label style={label}>帐号:</label>
                      <input
                        readOnly="readonly"
                        placeholder="帐号"
                        id="account"
                        value={this.state.addUser}
                        style={inputtop}
                        type="text"
                    />
                </div>
                <div style={content}>
                   <label style={label}>姓名:</label>
                   <input
                        onBlur={this.AddName1.bind(this)}
                        placeholder="姓名"
                        id="account"
                        value={this.state.addName}
                        onChange={this.AddName.bind(this)}
                        style={input}
                        type="text"
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
                   <label style={label}>电话:</label>
                   <input
                        onBlur={this.AddPhone1.bind(this)}
                        placeholder="电话"
                        id="account"
                        value={this.state.addPhone}
                        onChange={this.AddPhone.bind(this)}
                        style={input}
                        type="text"
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
                <div style={contentTop}>
                   <label style={{float:"left",lineHeight:"48px",color:"#000",textAlign:"right",display:"block",width:"100px"}}>
                      会员等级:
                   </label>
                   <SelectField
                        style={input}
                        onChange={this.addLevel2.bind(this)}
                        value={this.state.addLevel2}
                    >
                     {this.state.roles.map((item, i) =>
                         <MenuItem key={i} value={item.id} primaryText={item.name}/>
                        )}
                    </SelectField>
                </div>
                <div style={content}>
                   <label style={label}>上级会员:</label>
                   <SelectField
                        style={input}
                        onChange={this.lastLevelName2.bind(this)}
                        value={this.state.lastLevelName2}                      
                    >
                    {this.state.lastLevelNameList.map((item, i) => 
                        <MenuItem key={i}  value={item.id} primaryText={item.name} />
                    )}
                   </SelectField>
                </div>
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
