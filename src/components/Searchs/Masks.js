import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import { Icon } from "antd"
class Masks extends Component {
    play(songId,songMid){
        this.props.history.push({ pathname: "/play", state: { songid: songId, songmid: songMid } })
    }
    render() {
        var { list } = this.props
        // console.log(list,111)
        return (
            <div className="searchs">
                <ul>
                    {
                        list.map((item, index) => {
                            return <li key={index} onClick={this.play.bind(this,item.id,item.mid)}><Icon type="search" /><p><span className="name">{item.name}</span><span className="singer">{item.singer}</span></p></li>
                        })
                    }
                </ul>
            </div>
        )
    }
}
export default withRouter(Masks)