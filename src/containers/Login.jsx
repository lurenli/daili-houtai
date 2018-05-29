import React, {Component} from 'react';
import $ from 'jquery';
import Snackbar from 'material-ui/Snackbar';

const style = {
    margin: '1rem',
};
let baseName = '/game-web';
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
let login = {
    fontSize: "20px",
    color: "#fff",
    lineHeight: "60px",
    background: "#00bcd4",
    border: "0px",
    marginTop: "35px",
    width: "150px",
    height: "60px",
    cursor: "pointer"
}
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.LoginClick = this.LoginClick.bind(this);
        this.HandleKeydown = this.HandleKeydown.bind(this)
        this.state = {
            name: "",
            password: "",
            snackOpen: false,
            error: ""
        }
    }

    componentWillUmount() {
        window.removeEventListener("keydown", this.HandleKeydown);
    }

    componentDidMount() {
        window.addEventListener("keydown", this.HandleKeydown);
    }

    NameChange(e) {
        this.setState({name: e.target.value});
    }

    PwdChange(e) {
        this.setState({password: e.target.value});
    }

    HandleKeydown(e) {
        if (e.keyCode == "13") {
            this.LoginClick()
        }
    }

    LoginClick() {
        let url = process.env.HOST_URL + '/rest/user/loginByUsername';
        let data = {username: this.state.name, pwd: this.state.password};
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
                let data = response.user;
                let id = data.role.id
                let proxyCode = response.user.proxyCode
                localStorage.setItem('token', response.token);
                if (id !== 1) {
                    window.location.href = baseName + "/MemberHome";
                    localStorage.setItem("proxyCode", proxyCode);
                } else {
                    window.location.href = baseName + "/AdminHome";
                }
            } else {
                self.setState({snackOpen: true, error: response.message})
            }
        }.bind(this));
    }

    render() {
        return (
            <div style={{
                textAlign: "center",
                margin: "50px auto",
                width: "500px",
                height: "300px",
                border: "1px solid #ccc"
            }}>
                <from>
                    <div style={content}>
                        <label style={label}>用户名</label>
                        <input type="text" onChange={this.NameChange.bind(this)} style={input} placeholder="请输入用户名"/>
                    </div>
                    <div style={content}>
                        <label style={label}>密码</label>
                        <input type="password" onChange={this.PwdChange.bind(this)} style={input} placeholder="请输入密码"/>
                    </div>
                </from>
                <button style={login} onKeyDown={this.HandleKeydown} onClick={() => this.LoginClick()}>登录</button>
                <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.error}
                    autoHideDuration={2000}
                    onRequestClose={() => {
                        this.setState({
                            snackOpen: false,
                        });
                    }}
                />
            </div>
        )
    }


}