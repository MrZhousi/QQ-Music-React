import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch , Redirect} from 'react-router-dom'

export default class MapRoute extends Component {
    render() {
        return (
            <Switch>
                {
                    this.props.routes.map((item, index) => {
                        return <Route
                                key={index}
                                path={item.path}
                                render={(props)=>{
                                    return item.path?(
                                        item.auth?(
                                            localStorage.getItem('uname')?(
                                                <item.component {...props} routes = {item.children}/>
                                            ):(
                                                <Redirect to="/login" />
                                            )
                                        ):(
                                            <item.component {...props} routes = {item.children}/>
                                        )
                                    ):(
                                        <Redirect key={item.from} to={item.to} />
                                    )
                                }}
                            />
                    })
                }
            </Switch>
        )
    }
}
