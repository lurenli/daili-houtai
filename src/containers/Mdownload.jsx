import React, {Component} from 'react';
// import {CSS} from "../../assets/common.css"
let baseName = '/game-web';
let MoveDownload = {width: "100%", height: "100%", background: "#000"}
let top = {
    height: "11.74vw",
    width: "100%",
    color: "#fff",
    textAlign: "center",
    lineHeight: "11.74vw",
    fontSize: "4.26vw"
}
let main = {
    width: "53.4vw",
    height: "auto",
    position: "relative",
    background: "#000",
    margin: "0 auto",
    textAlign: "center"
}
let img = {width: "41.07vw", height: "41.06vw", marginTop: "18.67vw"}
let title = {fontSize: "5.33vw", color: "#fff"}
let Ios = {
    width: "53.4vw",
    height: "12vw",
    fontSize: "5.33vw",
    color: "#fff",
    marginTop: "17.06vw",
    background: "#FA5637",
    border: "0px"
}
let Android = {
    width: "53.4vw",
    height: "12vw",
    fontSize: "5.33vw",
    color: "#fff",
    marginTop: "4.26vw",
    background: "#1FA92B",
    border: "0px"
}
let Iosstduy = {
    width: "53.4vw",
    height: "12vw",
    fontSize: "5.33vw",
    color: "#fff",
    marginTop: "4.26vw",
    background: "#FA5637",
    border: "0px"
}
// let jcimg={width:"72vw",height:"128vw",position:"absolute",top:"2vw",left:"-8vw"}
export default class Mdownload extends Component {
    constructor(props) {
        super(props);
        this.HandClick = this.HandClick.bind(this);
        this.state = {
            displayname: 'none', //此状态机为display的取值  
        }

    }

    componentWillUmount() {

    }

    componentDidMount() {

    }

    HandClick() {
        let self = this
        if (this.state.displayname == 'none') {
            // let a = setInterval(function(){
            self.setState({
                displayname: 'block',
            })
            // },1000)
        }
        setTimeout(function () {
            self.setState({
                displayname: 'none',
            })
        }, 14000)
        // }else if (this.state.displayname == 'block') {  
        //     this.setState({  
        //         displayname: 'none',  
        //     })  

        // }  
    }

    render() {

        return (
            <div style={MoveDownload}>
                <div style={top}><span style={{float: "left", marginLeft: "2vw", fontSize: "6vw"}}>&lt;</span>下载</div>
                <div style={main}>
                    <img src={require("../../assets/images/move.png")} style={img}/>
                    <p style={title}>佰乐棋牌</p>
                    <button style={Ios}>IOS版下载</button>
                    <button style={Android}>Android下载</button>
                    <button style={Iosstduy} onClick={this.HandClick}>IOS操作教程</button>
                    <img style={{
                        display: this.state.displayname,
                        width: "72vw",
                        height: "128vw",
                        position: "absolute",
                        top: "2vw",
                        left: "-8vw"
                    }} ref="jc" src={require("../../assets/images/cc.gif")}/>
                </div>
            </div>
        )
    }
}