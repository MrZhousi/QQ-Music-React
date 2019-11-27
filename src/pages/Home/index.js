import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Switch , Redirect} from 'react-router-dom'
import Recommend from "./Recommend"
import Ranking from "./Ranking"
import Searchs from './Searchs';
import MapRoute from '../../router/MapRoute';
class Home extends Component {
    render() {
        return (
            <div className="container">
                <div className="header">
                        <NavLink to="/home/recommend">推荐</NavLink>
                        <NavLink to="/home/ranking">排行</NavLink>
                        <NavLink to="/home/searchs">搜索</NavLink>
                </div>
                <div className="main">
                        {/* <Switch>
                            <Route path="/home/recommend" component={Recommend}></Route>
                            <Route path="/home/ranking" component={Ranking}></Route>
                            <Route path="/home/searchs" component={Searchs}></Route>
                            <Redirect to="/home/recommend"></Redirect>
                        </Switch> */}
                        <MapRoute routes={this.props.routes}/>
                </div>
            </div>
        );
    }
}

export default Home;