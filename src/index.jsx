import React from 'react';
import {render} from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import routes from '../config/routes';
import createHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useStandardScroll' //跳转之后调整scroll position到顶部.

const history = useRouterHistory(useScroll(createHistory))();
render(
    <Router history={history} routes={routes}/>,
    document.getElementById('content')
);