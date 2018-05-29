import React, {Component} from 'react';
import {CSS} from "../../assets/common.css"

let baseName = '/game-web';
let Ul = {width: "700px", height: "410px"}
let Li = {float: "left", marginRight: "100px"}
let LiTwo = {float: "left",}
let title = {fontSize: "39px", color: "#fff", lineHeight: "99px"}
let img = {width: "300px", height: "300px", background: "#fff"}
let content = {color: "#fff", fontSize: "20px", lineHeight: "30px"}
export default class Login extends Component {
    constructor(props) {
        super(props);

    }


    componentWillUmount() {

    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="download">
                <ul style={Ul}>
                    <li style={Li}>
                        <h4 style={title}>扫一扫下载</h4>
                        <div style={img}></div>
                    </li>
                    <li style={LiTwo}>
                        <h4 style={title}>扫一扫下载</h4>
                        <div style={img}></div>
                    </li>
                </ul>
                <p style={content}>紧商科技股份有限公司于围包括一般经件、督管网络技督管网络技网络技术的技术开发等</p>
                <p style={content}>紧商科技股份有限公司于州市市场监督管督管网络技督管网络技就网络技术的技术开发等</p>
            </div>
        )
    }


}