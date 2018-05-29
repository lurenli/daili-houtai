import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import  QRCode  from 'qrcode.react';
import $ from "jquery";
let baseName = '/game-web';
let left = {float: "left", width: "70%", height: "50px"}
let right = {float: "right", width: "30%", height: "50px"}
let copybutton={width:"80px",height:"30px",color:"#fff",border: "1px solid #ccc",background:"#00bcd4"}
let downbutton={width:"80px",height:"30px",marginTop:"20px",color:"#fff",border: "1px solid #ccc",background:"#00bcd4"}
let ewm={width:"300px",height:"300px",background:"#00bcd4"}
export default class MyShareCode extends Component {
    constructor(props) {
        super(props);
        this.onCopy = this.onCopy.bind(this);
        this.state = {
            copied: false,
            value: "",
            code: "",
            url: '',

            size: 200,
            fgColor: '#000000',
            bgColor: '#ffffff',
            level: 'L',
            renderAs: 'canvas',
        }
    }

    componentWillMount() {
        var a = localStorage.getItem("proxyCode")
        var b = "http://120.26.215.224/game-web/RechargeCenter#proxyCode="
       // var b = "localhost:8090/game-web/RechargeCenter#proxyCode="
        this.setState({
            code: a,
            value: b + a
        })
    }

    componentDidMount() {
        this.setState({
            copied: false
        })
    }

    onCopy() {
        this.setState({copied: true});
        alert("复制链接成功")
    }
    download(){
        var c=document.getElementById("qr");  
        var a = document.createElement('a');
        a.href = c.toDataURL('image/png');  //将画布内的信息导出为png图片数据
        a.download = "erweima";  //设定下载名称
        a.click(); //点击触发下载   
    }
    render() {
        return (
            <div style={{width: "1000px", margin: "0 auto", fontSize: "14px", padding: "30px"}}>
             <ul style={{height:"50px"}}>
                <li style={left}>链接:
                    <input type="text" ref="input" readOnly="readonly" value={this.state.value}
                           style={{width: "500px", border: "none"}}/>
                </li>
                <li style={right}>
                    <CopyToClipboard text={this.state.value} onCopy={this.onCopy}>
                        <button style={copybutton}>复制链接</button>
                    </CopyToClipboard>
                </li>
            </ul>
                 <div id="ewm">
                   <QRCode
                      id="qr"
                      value={this.state.value}
                      size={this.state.size}
                      fgColor={this.state.fgColor}
                      bgColor={this.state.bgColor}
                      level={this.state.level}
                      renderAs={this.state.renderAs}
                    />
                 </div>
                <button style={downbutton} onClick={this.download.bind(this)}>下载二维码</button>
            </div>
        )
    }
}
// }