import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/posts/${id}`)
        .then((response) => {
            setPost(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [id]);

    return (
        <div>
            {post ? (
                <>
                <h1>{post.title}</h1>
                <p>{post.content}</p>
                </>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default PostDetail;