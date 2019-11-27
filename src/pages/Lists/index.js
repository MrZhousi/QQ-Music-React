import React, { Component } from 'react'
import qs from 'querystring'
import { Button, Icon } from "antd"
import BScroll from "better-scroll"
export default class Lists extends Component {
    constructor(props) {
        super(props);
        this.state = { songList: [], listName: '', updateTime: '', el: '', end: 20, pullup: "上拉加载" , id:''}
        this.listRender = this.listRender.bind(this)
    }

    componentDidMount() {
        console.log(this)
        var id = qs.parse(this.props.location.search.slice(1))
        this.setState({
            id:id.id
        })
        console.log(id.id)
        this.$http.get("/songlist", { params: { id: id.id } }).then(res => {
            console.log(res)
            const songList = res.data.data.songList
            const listName = res.data.data.topInfo.listName
            const updateTime = res.data.data.updateTime
            this.setState({ songList, listName, updateTime },()=>{
                this.listRender(0,this.state.end)
            })
        })
        const bs = new BScroll('.lists', {
            probeType: 2,
            click: true
        })
        bs.on('scroll', () => {
            if (bs.y < bs.maxScrollY) {
                this.setState({ pullup: "释放加载" })
            }
            if(this.state.end == 100){
                this.setState({ pullup: "加载完毕" })
            }
        })
        bs.on('scrollEnd', () => {
            if (this.state.pullup == "释放加载") {
                let end = this.state.end
                this.listRender(0, end+20)
            }
            this.setState({pullup:"上拉加载"})
            if(this.state.end == 100){
                this.setState({ pullup: "加载完毕" })
            }
        })

    }
    songPlay(songId, songMid ,i) {
        console.log(1)
        // this.props.history.push(`/play?id=${songId}`)
        this.props.history.push({ pathname: "/play", state: { songid: songId, songmid: songMid ,id:this.state.id ,i } })
    }

    listRender(start, end) {
        console.log(this)
        const el = this.state.songList.slice(start, end).map((item, index) => {
            return (
                <li key={index} onClick={this.songPlay.bind(this, item.songId, item.songMid , index)}>
                    <div className="song-title">
                        <span className="song-num">{index + 1}</span>
                        <p className="song-info">
                            <span>{item.songName}</span>
                            <Icon type="vertical-align-bottom" />
                        </p>
                    </div>
                    <p className="song-name">{
                        item.singer.map((item, index) => {
                            return <span key={index}>{item.singerName}</span>
                        })
                    }</p>
                </li>
            )
        })
        
        this.setState({
            el,
            end,
            pullup: '上拉加载'
        })
        if (end == 100) {
            this.setState({ pullup: "加载完毕" })
        }
    }

    render() {
        return (
            <div className="lists">
                <div className="song">
                    <div className="titleInfo">
                        <h2>{this.state.listName}</h2>
                        <h2>{this.state.listName}第254天</h2>
                        <p>更新时间{this.state.updateTime}</p>
                        <Button type="primary" icon="caret-right" size='large' />
                    </div>
                    <div className="song-item">
                        <p className="title">排行榜共100首</p>
                        <ul>
                            {this.state.el}
                        </ul>
                        <p className="pullup">{this.state.pullup}</p>
                    </div>
                </div>
            </div>
        )
    }
}
