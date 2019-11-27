import React, { Component } from 'react'
import qs from "querystring"
import { Button, Icon, Slider } from "antd"
import { parse } from 'url';
export default class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lyric: '',
            songUrl: '',
            songitem: '',
            items: [],
            i: '',
            p: 1,
            t: 0,
            duration: '',
            dura: '',
            currentTime: '',
            left: "",
            ct: "",
            flag: false,
            songId: '',
            songMid: '',
            ind: '',
            songList: [],
            cishu: 1
        }
        this.renderList = this.renderList.bind(this)
        // this.interval = this.interval.bind(this)
        this.timeupdate = this.timeupdate.bind(this)
        this.getSongInfo = this.getSongInfo.bind(this)
        this.autoPlay = this.autoPlay.bind(this)
    }
    componentDidMount() {
        // console.log(this.props.location.state, 33333333333333)
        var ind = this.props.location.state.i
        this.setState({ ind })
        this.getSongInfo()
        this.autoPlay()
        var aud = this.refs.aud
        // console.log(aud)
        var slidebox = this.refs.slidebox;
        var circle = this.refs.circle;
        var truth = this.refs.truth
        aud.oncanplaythrough = () => {
            // console.log(aud.duration)
            this.setState({
                duration: this.timeformat(aud.duration),
            }, () => {
                // console.log(this.state.duration)
            })
        }
        // aud.ontimeupdate = () => {
        //     // console.log(aud.currentTime)
        //     console.log(aud.currentTime, 1111)
        //     var currentTime = aud.currentTime
        //     this.setState({
        //         currentTime: this.timeformat(currentTime),
        //         curtim: currentTime
        //     })
        //     var scale = currentTime / aud.duration
        //     var boxWidth = slidebox.clientWidth
        //     truth.style.width = scale * boxWidth + 'px'
        //     circle.style.left = scale * boxWidth - 3 + 'px'
        // }

    }
    autoPlay() {
        var aud = this.refs.aud
        aud.onended = () => {
            var ind = this.state.ind
            ind++
            this.setState({
                ind,
                cishu: this.state.cishu + 1,

            }, () => {
                this.setState({ p: 2 })
                this.refs.aud.currentTime = 0
                // this.autoPlay()
                this.getSongInfo()
                this.renderList()
            })
        };
    }
    async getSongInfo() {

        await this.$http.get("/songlist", { params: { id: this.props.location.state.id } }).then(res => {
            console.log(this.state.ind)
            // console.log(res.data.data.songList[this.state.ind])
            var songList = res.data.data.songList
            this.setState({ songList })

            var itemObj = res.data.data.songList[this.state.ind]

            // console.log(itemObj.songId)
            // console.log(itemObj.songMid)
            this.setState({
                songId: itemObj.songId,
                songMid: itemObj.songMid
            }, () => {
                this.$http.get("/lyric", { params: { songid: this.state.songId } }).then(res => {
                    console.log(res)
                    const lyric = res.data.data.lyric
                    this.setState({ lyric }, () => {
                        this.renderList()
                    })
                })
                this.$http.get("/songUrl", { params: { mid: this.state.songMid } }).then(res => {
                    console.log(res)
                    const songUrl = res.data;
                    this.timeupdate()
                    this.setState({ songUrl }, () => {
                        if (this.state.cishu != 1) {

                            this.refs.aud.play()
                        }
                    })

                })
            })
        })
    }
    timeformat(time) {
        var mins = Math.floor(time / 60) < 10 ? "0" + Math.floor(time / 60) : Math.floor(time / 60)
        var send = parseInt(time % 60) < 10 ? "0" + parseInt(time % 60) : parseInt(time % 60)
        return mins + ':' + send
    }
    move(e) {
        this.refs.aud.pause()
        // console.log(e.touches[0])
        var left = e.touches[0].pageX - 50
        // console.log(left)
        if (left < 0) {
            left = 0
        }
        if (left > this.refs.slidebox.clientWidth) {
            left = this.refs.slidebox.clientWidth
        }
        // console.log(parseInt(left),111)
        this.refs.circle.style.left = parseInt(left) - 3 + 'px'
        this.refs.truth.style.width = parseInt(left) + 'px'
        // console.log(this.refs.circle.left, 221212121212)
        this.setState({
            left,
            p: 1
        })
    }
    end() {
        var scale = this.state.left / this.refs.slidebox.clientWidth
        var currentTime = this.refs.aud.duration * scale
        this.refs.aud.currentTime = currentTime
        // console.log(currentTime)
        this.setState({
            currentTime: this.timeformat(currentTime)
        })
        let i = this.state.items.findIndex((item) => {
            return item.songTime > currentTime
        })
        if (i == -1) {
            i = this.state.items.length - 1
        }
        // console.log(i)
        this.setState({ t: this.state.items[i].songTime, i, p: 2 }, () => {
            // console.log(this.refs.aud)
            this.refs.aud.play()
            var box = this.refs.box
            box.style.top = -i * 35 + 150 + 'px'
            clearInterval(this.timer)
            this.timer = null
            this.renderList()
            // this.interval()
        })
    }

    renderList() {

        var lyricArr = this.state.lyric.split("[换行]")
        var lyricItem = lyricArr.map((item, index) => {
            return <p key={index}>{item}</p>
        })
        lyricItem = lyricItem.slice(5)
        var items = []

        var songitem = lyricItem.map((item, index) => {

            var time = item.props.children.split("]")[0].slice(1, 6)

            var times = time.split(":")[0] * 60 + parseInt(time.split(":")[1])

            var obj = {
                lyricitem: item.props.children.split("]")[1],
                songTime: times
            }
            items.push(obj)
            // console.log(items)
            this.setState({ items }, () => {
            })
            return <p className={["songitem", this.state.i == index ? "active" : ""].join(" ")} key={index} style={{ textAlign: "center" }}>{obj.lyricitem}</p>
        })
        this.setState({ songitem })
    }
    timeupdate() {
        let truth = this.refs.truth;
        let circle = this.refs.circle;
        let slidebox = this.refs.slidebox
        let aud = this.refs.aud
        aud.ontimeupdate = () => {
            this.setState({
                ct: aud.currentTime,
                currentTime: this.timeformat(aud.currentTime)
            }, () => {
                var currentTime = aud.currentTime
                if (this.state.ct == aud.duration) {
                    this.setState({ p: 1 }, () => {
                        if (this.state.flag) {
                            this.setState({ p: 2 }, () => {
                                this.plays()
                            })
                        }
                    })
                    clearInterval(this.timer)
                    this.timer = null
                }
                // this.setState({
                //     currentTime: this.timeformat(currentTime),
                //     curtim: currentTime
                // })
                var scale = currentTime / aud.duration
                var boxWidth = slidebox.clientWidth
                truth.style.width = scale * boxWidth + 'px'
                circle.style.left = scale * boxWidth - 3 + 'px'
                this.timer = setInterval(() => {
                    this.state.items.forEach((item, index) => {
                        if (item.songTime == parseInt(this.state.ct)) {
                            this.setState({ i: index }, () => {
                                var box = this.refs.box
                                box.style.top = -index * 35 + 150 + 'px'
                                this.renderList()
                            })
                        }
                    })
                }, 1000);
            })
        }
    }
    // interval() {
    //     var aud = this.refs.aud
    //     // aud.ontimeupdate = () => {
    //     var t = parseInt(this.state.ct)
    //     // console.log(t)
    //     this.setState({ t, currentTime: this.timeformat(t) }, () => {
    //         this.timer = setInterval(() => {
    //             this.state.items.forEach((item, index) => {
    //                 if (item.songTime == this.state.t) {
    //                     this.setState({ i: index }, () => {
    //                         var box = this.refs.box
    //                         box.style.top = -index * 35 + 150 + 'px'
    //                         this.renderList()
    //                     })
    //                 }
    //             })
    //         }, 1000);
    //     })
    //     // console.log(this.state.t)
    //     // }
    // }
    plays() {
        var aud = this.refs.aud
        var play = this.refs.play
        this.setState({ dura: aud.duration })
        if (aud.paused) {
            aud.play()
            this.setState({ p: 2 })
            // this.interval()

        } else {
            aud.pause()
            this.setState({ p: 1 })
            clearInterval(this.timer)
            this.timer = null

        }
        // console.log(this.state.ct)

    }
    componentWillUnmount() {
        this.refs.aud.pause()
        clearInterval(this.timer)
        this.timer = null
        this.setState = () => {
            return
        }
    }
    loop() {
        var flag = this.state.flag
        this.setState({ flag: !flag })
    }
    goBack() {
        var ind = this.state.ind
        this.setState({
            cishu: this.state.cishu + 1
        })
        if (ind <= 0) {
            ind = this.state.songList.length
        }
        ind--
        this.setState({ ind, p: 2 }, () => {
            console.log(this.state.ind)

            this.refs.aud.currentTime = 0
            this.autoPlay()
            this.getSongInfo()
            this.renderList()
        })
    }
    nextOne() {
        // console.log(this.state.songList.length-1)
        var ind = this.state.ind
        this.setState({
            cishu: this.state.cishu + 1
        })
        if (ind >= this.state.songList.length - 1) {
            ind = -1
        }
        ind++
        this.setState({ ind, p: 2 }, () => {
            console.log(this.state.ind)
            this.refs.aud.currentTime = 0
            this.autoPlay()
            this.getSongInfo()
            this.renderList()
        })
    }
    render() {
        return (
            <div className="lyric">
                <div className="songs">
                    <div className="lyricItem" ref="box">
                        {this.state.songitem}
                    </div>
                </div>
                <div className="audio">
                    <div className="slider">
                        <span ref="time">{this.state.currentTime}</span>
                        <div className="slide-block" ref="slidebox">
                            <div className="progress-box" ref="truth"></div>
                            <div className="progress-bar" ref="circle" onTouchMove={this.move.bind(this)} onTouchEnd={this.end.bind(this)}></div>
                        </div>
                        <span>{this.state.duration}</span>
                    </div>
                    <div className="btns">
                        <span className="little">MV</span>
                        <span>
                            <Icon type="fast-backward" onClick={this.goBack.bind(this)} />
                        </span>
                        <span onClick={this.plays.bind(this)} ref="play">
                            {
                                this.state.p == 1 ? <Icon type="caret-right" theme="filled" /> : <Icon type="pause" />
                            }
                        </span>
                        <span>
                            <Icon type="fast-forward" onClick={this.nextOne.bind(this)} />
                        </span>
                        <span className="little">
                            <Icon type="retweet" onClick={this.loop.bind(this)} className={[this.state.flag ? "active" : ""]} />
                        </span>
                    </div>
                    <Button type="primary" shape="round" icon="caret-right">
                    </Button>
                    <audio ref="audio" src={this.state.songUrl} ref="aud"></audio>
                </div>
            </div>
        )
    }
}
