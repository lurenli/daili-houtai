import React, {Component} from 'react';
import $ from 'jquery';

let baseName = '/game-web';
export default class Logout extends Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
        let url = process.env.HOST_URL + '/rest/user/logout';
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
            if (response.result === 1) {
                localStorage.removeItem("token");
                location.href = baseName + "/Login";
            }
        }.bind(this));
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
            </div>
        )
    }


}