import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try{
                const response = await api.get(`/posts/${id}`)
                setPost(response.data);
                console.log("Post", response.data);
            }catch(error){
                console.error("Error al cargar la publicación", error);
            }
        };
        fetchPost();
    }, [id]);

    const handleLike = async (postId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("Debes iniciar sesión para dar me gusta a una publicación.");
            return;
        }
        try {
            const response = await api.post(`/posts/${postId}/like/`);
            console.log("Like", response.data);

            
            setPost((prevPost) => ({
                ...prevPost,
                liked: response.data.liked,
                likes_count: response.data.likes_count
            }));
        } catch (error) {
            console.error("Error al dar like a la publicación", error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    {post ? (
                        <>
                            <h1 className="card-title">{post.title}</h1>
                            <p className="card-text text-muted">Publicado por {post.user.username} el {new Date(post.created_at).toLocaleDateString()} | Me gustas: {post.likes_count}</p>
                            <hr />
                            <p className="card-text">{post.content}</p>
                            <button className={`btn ${post.liked ? 'btn-success' : 'btn-secondary'} me-2`} onClick={() => handleLike(post.id)}>{post.liked ? 'Te gusta' : 'Me gusta'}</button>
                            <Link to="/posts" className="btn btn-primary ">Volver</Link>
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