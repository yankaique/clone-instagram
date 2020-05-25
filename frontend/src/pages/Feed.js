import React, {Component} from 'react';
import api from '../services/api';
import io from 'socket.io-client'
import './Feed.css'

import more from '../assets/more.png'
import like from '../assets/like.png'
import comment from '../assets/comment.png'
import send from '../assets/send.png'

class Feed extends Component{

    state={
        feed:[],
    };

    async componentDidMount(){
        this.registerToSocket();

        const response = await api.get('posts');

        this.setState({feed:response.data});
    }

    registerToSocket= ()=>{
        const socket = io('http://localhost:3333');

        socket.on('post',newPost=>{
            this.setState({feed: [newPost,...this.state.feed]})
        })

        socket.on('like',likePost=>{
            this.setState({
                feed:this.state.feed.map(post=>
                    post._id === likePost._id ? likePost : post
                    )
            });
        })
    }

    handleLike = id => {
        api.post(`/posts/${id}/Like`)
    }

    render(){
        return(
            <section id="post-list">
               {this.state.feed.map(post=>(
                    <article key={post._id}>
                    <header>
                        <div className="user-info">
                            <span>{post.author}</span>
                            <span className="place">{post.place}</span>
                        </div>

                        <img src={more} alt="Mais"/>
                    </header>
                    <img src={`http://localhost:3333/files/${post.image}`} alt=""/>
                    <footer>
                        <div className="actions">
                            <button type="button" onClick={() => this.handleLike(post._id)}>
                                <img src={like} alt="Curtir"/>
                            </button>
                            <img src={comment} alt="Comentário"/>
                            <img src={send} alt="Enviar"/>
                        </div>
                        <strong>
                            {post.likes} Curtidas
                        </strong>
                        <p>
                            {post.description}
                            <span>#Massa #Aparecity #Top</span>
                        </p>
                    </footer>
                </article>
               ))}  
            </section>
        );
    }
}

export default Feed