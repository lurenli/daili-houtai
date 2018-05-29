import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import $ from "jquery";

let baseName = '/game-web';
let Tbutton = {
    fontSize: "14px",
    color: "#fff",
    lineHeight: "35px",
    background: "#00bcd4",
    border: "0px",
    marginTop: "45px",
    width: "100px",
    height: "40px",
    cursor: "pointer",
    marginLeft:"220px"
}
let content = {
    margin: "0 auto",
    marginTop: "35px",
    width: "500px",
    fontSize: "18px",
    lineHeight: "50px",
    height: "50px",
    textAlign: "center"
}
let label = {float: "left", color: "#000", display: "block", width: "100px", fontSize: "16px", marginLeft: "50px"}
let input = {float: "left", display: "block", height: "50px", width: "250px", marginLeft: "10px", textIndent: "10px"}
export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.CheckClick = this.CheckClick.bind(this);
        this.state = {
            open: false,
            error: "",
            oldPwd: "",
            firstPwd: "",
            secondPwd: "",
        };
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    CheckClick() {
        if (!this.state.oldPwd) {
            this.setState({open: true, error: '请输入旧密码'})
        } else if (this.state.firstPwd !== this.state.secondPwd) {
            this.setState({open: true, error: '两次输入的新密码不一致'})
        } else {
            let url = process.env.HOST_URL + '/rest/user/updatePwd';
            let data = {
                oldPwd: this.state.oldPwd,
                newPwd: this.state.firstPwd,
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
                    self.setState({open: true, error: '修改成功'});
                    setTimeout(function () {
                        location.href = baseName + "/login";
                    }, 2000);
                } else if (response.result === 2) {
                    localStorage.removeItem("token");
                    location.href = baseName + "/Login";
                } else {
                    self.setState({open: true, error: response.message})
                }
            }.bind(this));
        }

    }

    OldChange(e) {
        this.setState({oldPwd: e.target.value})
    }

    newChange(e) {
        this.setState({firstPwd: e.target.value})
    }

    SecondChange(e) {
        this.setState({secondPwd: e.target.value})
    }

    render() {
        return (
            <div style={{minWidth: "1000px"}}>
                <div style={{width: "500px", margin:"50px auto"}}>
                <from>
                    <div style={content}>
                       <label style={label}>旧密码</label>
                       <input type="password" style={input} onChange={this.OldChange.bind(this)}/>
                    </div>
                    <div style={content}>
                       <label style={label}>新密码</label>
                       <input type="password" style={input} onChange={this.newChange.bind(this)}/>
                    </div>
                    <div style={content}>
                       <label style={label}>确认新密码</label>
                       <input type="password"  style={input} onChange={this.SecondChange.bind(this)}/>
                    </div>
                    <button style={Tbutton} default={true} onClick={this.CheckClick}>确认</button>
                </from>
                </div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.error}
                    autoHideDuration={2000}
                    onRequestClose={() => {
                        this.setState({
                            open: false,
                        });
                    }}
                />
            </div>
        )
    }


}