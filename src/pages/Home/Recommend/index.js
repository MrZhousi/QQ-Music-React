import React, { Component } from 'react'
import { Carousel } from 'antd';
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerImg: [],
            listImg: []
        }
    }
    componentDidMount() {
        this.$http.get("/recommend").then(res => {
            console.log(res)
            const bannerImg = res.data.data.slider
            const listImg = res.data.data.radioList
            this.setState({ bannerImg, listImg })
        })
    }

    render() {
        return (
            <div>
                <div className="banner">
                    <Carousel autoplay>
                        {
                            this.state.bannerImg.map((item, index) => {
                                return <div key={index}>
                                    <img src={item} />
                                </div>
                            })
                        }
                    </Carousel>,
                </div>
                <h1>电台</h1>
                <div className="list">
                    {
                        this.state.listImg.map((item, index) => {
                            return <div key={index} className="listItem">
                                <div className="imgbox">
                                    <img src={item.picUrl} />
                                </div>
                                <h3>{item.title}</h3>
                            </div>
                        })
                    }

                </div>
            </div>
        )
    }
}
