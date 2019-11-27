import React, { Component } from 'react'
import { Input } from 'antd';
import Masks from '../../../components/Searchs/Masks';
const { Search } = Input;
export default class Searchs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: ["乐队的夏天", "我和我的祖国", "光", "爱的飞行日记", "感谢你曾来过", "山楂树之恋", "我最亲爱的", "芒种"],
            flag:false,
            songItem:[]
        }
    }
    componentDidMount() {

    }
    search(value){
        this.$http.get("/search",{params:{keyword:value}}).then(res=>{
            console.log(res)
            this.setState({songItem:res.data.data.song.itemlist,flag:true})
        })
        
    }
    render() {
        console.log(this.state.songItem)
        return (
            <div>
                <div className="search">
                    <Search
                        placeholder="搜索歌曲、歌单、专辑"
                        onSearch={value => this.search(value)}
                        style={{ width: 280, height: 50 }}
                    />
                    <span className="cancel">取消</span>
                </div>
                <div className="hot-search">
                    <h2>热门搜索</h2>
                    <div className="items">
                        {
                            this.state.itemList.map((item, index) => {
                                return <span key={index} >{item}</span>
                            })
                        }
                    </div>
                </div>
                {
                    this.state.flag ? <Masks list={this.state.songItem}></Masks> : ""
                }
            </div>
        )
    }
}
