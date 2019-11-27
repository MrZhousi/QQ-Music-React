import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Play from './pages/Play';
import MapRoute from "./router/MapRoute"
import routes from "./router/routes"
import "../node_modules/antd/dist/antd.css";
import "./index.less"


import Axios from 'axios';

Component.prototype.$http = Axios
ReactDOM.render((
    <Router>
        {/* <Switch>
            <Route path="/lists" component={Lists}></Route>
            <Route path="/play" component={Play}></Route>
            <Route path="/" component={Home}></Route>
        </Switch> */}
        <MapRoute routes={routes}/>
    </Router>
), document.getElementById('root'));
