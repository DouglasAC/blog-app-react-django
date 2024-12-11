import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try{
                const response = await axios.get(`http://localhost:8000/api/posts/${id}`)
                setPost(response.data);
                console.log("Post", response.data);
            }catch(error){
                console.error("Error al cargar la publicación", error);
            }
        };
        fetchPost();
    }, [id]);

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    {post ? (
                        <>
                            <h1 className="card-title">{post.title}</h1>
                            <p className="card-text text-muted">Publicado por {post.user.username} el {new Date(post.created_at).toLocaleDateString()}</p>
                            <hr />
                            <p className="card-text">{post.content}</p>

                            <Link to="/posts" className="btn btn-secondary mt-3">Volver</Link>
                        </>
                    ) : (
                        <p>Cargando publicación...</p>
                    )}

                </div>

            </div>
        </div>
    );
};

export default PostDetail;