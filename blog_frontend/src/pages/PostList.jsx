import React, {useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/posts/")
        .then((response) => {
            setPosts(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <div>
            <h1>Publicaciones</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;