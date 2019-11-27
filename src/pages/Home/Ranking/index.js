import React, { Component } from 'react'

export default class Ranking extends Component {
    constructor(props) {
        super(props);
        this.state = { toplist: [] }
    }
    componentDidMount() {
        this.$http.get("/toplist").then(res => {
            console.log(res)
            const toplist = res.data.data
            this.setState({ toplist })
        })
    }
    songList(i){
        console.log(this)
        // this.$http.get("/songlist",{params:{id:i}}).then(res=>{
            
        // })
        this.props.history.push("/lists?id="+i)
    }
    render() {
        return (
            <div className="rank">
                {
                    this.state.toplist.map((item, index) => {
                        return <div key={index} className="toplist" onClick={this.songList.bind(this,item.id)}>
                            <div className="imgBox">
                                <img src={item.picUrl} />
                            </div>
                            <div className="titlelist">
                                <p className="title">{item.title}</p>
                                {
                                    item.songList.map((item, index) => {
                                    return <p key={index} className="sub-title"><span>{item.number}</span><span className="songName">{item.songName}</span><span>-{item.singerName}</span></p>
                                    })
                                }
                            </div>
                            <span className="right">></span>
                        </div>
                    })
                }

            </div>
        )
    }
}
