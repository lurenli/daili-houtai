import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import $ from "jquery";
import {CSS} from "../../../assets/common.css"
let baseName = '/game-web';
let Vcontent={width:"1000px",backgroundColor:"#fff",margin:"0 auto", fontSize:"14px",height:"650px",paddingTop:"75px"}
let style ={height:"50px",marginTop:"25px"}
let paymoney ={marginTop:"25px"}
let content={margin:"0 auto",marginBottom:"10px",width:"500px",height:"22px",textAlign:"center"}
let left ={float:"left",marginRight:"30px",lineHeight:"50px",fontSize:"18px"}
let right = {float:"left",lineHeight:"45px",height:"45px",border:"1px solid #e6e6e6",width:"318px",fontSize:"18px"}
let next = {marginLeft:"80px",marginTop:"50px"}
let button ={outline:"none",marginRight:"10px",background:"#fff",lineHeight:"42px",fontSize:"19px",width:"112px",height:"42px",border:"1px solid #e6e6e6"}
let weixinbutton = {width:"166px",height:"43px",lineHeight:"43px",fontSize:"19px",background:"#fff",border:"1px solid #e6e6e6"}
let main ={textAlign:"center"}
let label ={float:"left",color:"#000",display:"block",width:"200px"}
let input ={float:"left",display:"block",width:"250px",marginLeft:"50px",textIndent:"10px"}
export default class RechargeCenter extends Component {
    constructor(props) {
        super(props);
        this.Button = this.Button.bind(this);
        this.Button4 = this.Button4.bind(this);
        // this.Button5 = this.Button5.bind(this);
        this.NextClick = this.NextClick.bind(this);
        this.AddClick = this.AddClick.bind(this);
        this.state={
            open:false,
            lianjie:"",
            name:"",
            id:"",
            // money:"",
            payway:"",
            proxyCode:"",
            customerId:"",
            amount:"0.00",
            ck:false,
            paylist:[],
            cardnum:"0",
            Code:"",
            key:""
        }
    }
    componentWillMount(){
      document.title="充值中心"
      let proxyCode = localStorage.getItem('proxyCode')
      // location.href = "localhost:8090/game-web/RechargeCenter#proxyCode="+proxyCode; 
      location.href = "http://120.26.215.224/game-web/RechargeCenter#proxyCode="+proxyCode;
    }
    componentDidMount() {
        //获取用户信息
        let url = process.env.HOST_URL + '/rest/common/queryProxy';
        let proxyCode = localStorage.getItem('proxyCode')
        let data = {
            code: proxyCode
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
                let data=response.data;
                self.setState({
                    name:data.user.name
                })         
            } 

        }.bind(this));
        this.PayMoney()      
    }
    PayMoney(){
         //获取充值金额
        let url = process.env.HOST_URL + '/rest/rebate/rule/recharge/list';
        let data = {
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
            let data = response.data.list
            this.setState({paylist:data})
        }.bind(this));
    }
    id(e){
         this.setState({id: e.target.value})
    }
    Code(e){
      this.setState({code:e.target.text})
    }
    Button(item,i){
        this.setState({
          key:i,
          amount:parseInt(item.amount+ ".00"),
          cardnum:item.cardnum
        })
    }
    Button4(e){
       this.setState({
           ck:true,
           payway: e.target.innerText
       })
    }
    // Button5(e){
    //    this.setState({
    //      ck:false,
    //      payway:""
    //    })
    // }
    //下一步按钮
    NextClick(){
        if(!this.state.name){
          alert("请先登录获取用户名")
        }
        else if(!this.state.id){
          alert("用户ID不能为空,请输入用户ID")
        }else if(this.state.amount==0.00){
           alert("用户充值金额不能为空,请选择相应的金额")
        }else if(!this.state.ck){
            alert("请选择相应的支付方式")
        }else{
           this.setState({open: true});
        }
    }
    //确认支付
    AddClick(){
        if(this.state.id){
           let self = this;
           let url = getHost() + "/rest/pay/alipay/toPay";
           let True = confirm("确认充值前往支付窗口?")
           if(True){
            window.open(getHost() + "/rest/pay/alipay/toPay?proxyCode="+this.state.proxyCode+"&customerId="+this.state.id+"&amount="+this.state.amount)
          }
        }
        this.setState({
            open:false,
            proxyCode:"",
            id:"",
            amount:"",
            customerId:""
        })
        window.location.reload()
    }
   render(){
        // let meinv = "/assets/images/meinv.png";
        // let zfb = "/assets/images/zfb.png";
        // let weixin = "/assets/images/weixin.png";
        let key = this.state.key;
        let index = this.state.index;
        let ck = this.state.ck;
        const actions = [
            <FlatButton
                label="返回修改"
                default={true}
                onClick={() => {
                    this.setState({open: false});
                }}
            />,
            <FlatButton
                label="确认提交"
                primary={true}
                onClick={this.AddClick}
            />,
        ];
        return (
            <div className="bj">
              <p style={{fontSize:"20px",color:"#fff",lineHeight:"183px",margin:"0 auto",width:"1000px"}}>
                <img src={require("../../../assets/images/meinv.jpg")} className="meinv"/>
                 充值中心
              </p>    
              <div style={Vcontent}>
                  <div style={{margin:"0 auto",width:"600px",height:"400px",fontSize:"14px"}}>
                    <from>
                        <div style={style}><label style={left}>会员:</label><p style={{fontSize:"18px",lineHeight:"45px"}}>{this.state.name}</p></div>
                        <div style={style}><label style={left}>用户ID:</label><input type="text" onChange={this.id.bind(this)} style={right} /></div>
                        <div style={paymoney}>
                            <label  style={left}>充值金额:</label>
                            {this.state.paylist.map((item, i) =>
                               <a key={i}>
                                <button className = {key=== i ? 'active' : 'button'} onClick={()=> this.Button(item,i)}>{item.amount}元</button>                              
                               </a>
                             )}
                        </div>
                        <div style={style}>
                          <label  style={left}>总计:</label>
                          <div style={{float:"left",lineHeight:"45px",height:"45px",width:"500px",fontSize:"18px"}}>
                             需支付<b style={{color:"#f97b0f",fontSize:"35px",lineHeight:"50px"}}>￥{this.state.amount}</b>元,获得
                             <b style={{color:"#f97b0f",fontSize:"35px",lineHeight:"50px"}}>{this.state.cardnum}</b>房卡
                          </div>
                        </div>
                        <div style={style}>
                           <label  style={left}>充值方式:</label>
                           <button id="zfb" className={ck==true?'zfbckbutton':'zfbbutton'}
                            onMouseDown={this.Button4}
                            >
                             <img src={require("../../../assets/images/zfb.png")} className="zfbimg"/>
                             支付宝扫码
                           </button>
                           {/* <button style={{width:"166px",background:"#fff",lineHeight:"45px",fontSize:"19px",border:"1px solid #e6e6e6"}} onClick={this.Button4}>
                              <img  src="/assets/images/weixin.png"  style={{verticalAlign:"middle",marginLeft:"-30px",marginRight:"8px"}}/>
                              微信支付
                            </button>*/}
                        </div>
                        <div style={next}><button style={{cursor:"pointer",background:"#f97b0f",border:"0px",width:"305px",height:"60px"}} onClick={this.NextClick}>下一步</button></div>
                    </from>
                </div>
                 <Dialog
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                >
                 <div style={main}>                        
                        <h3 >充值信息确认</h3>
                        <from>
                          <div style={content}>
                             <label  style={label}>您的充值方式</label>
                             <span   style={input}>{this.state.payway}</span>
                          </div>
                          {/*<div style={content}> 
                              <label style={label}>您的充值账号</label>
                              <span style={input}>123456789</span>
                           </div>
                           <div style={content}>
                              <label style={label}>您的订单号</label>
                             <span style={input}>75615796</span>
                          </div>*/}
                          <div style={content}>
                              <label style={label}>您的充值金额</label>                                                            
                              <span style={input}>{this.state.amount}元</span>
                          </div>
                          <div style={content}>
                              <label style={label}>您的信息备注</label>
                              <span style={input}>可获得{this.state.cardnum}张房卡</span>
                          </div>               
                        </from>
                    </div>
                </Dialog>
            </div>
            </div>
        )
 }
}