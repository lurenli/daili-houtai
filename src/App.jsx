import React, {Component} from 'react';
import "babel-polyfill";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

window.getHost = function getHost() {
    // if(window.location.hostname.indexOf("localhost") >= 0) {
    return process.env.HOST_URL;
    // }
    // return "http://" + window.location.hostname;
};
export default class App extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount() {

    }

    componentDidMount() {
    }

    render() {
        return (
            <MuiThemeProvider>
                {this.props.children}
            </MuiThemeProvider>
        )
    }


}
