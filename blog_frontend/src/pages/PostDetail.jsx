import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${id}`)
                setPost(response.data);
                console.log("Post", response.data);
            } catch (error) {
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

    const fetchComments = async () => {
        try {
            const response = await api.get(`/posts/${id}/comments/`);
            console.log("Comments", response.data);
            return response.data;
        } catch (error) {
            console.error("Error al cargar los comentarios", error);
            return [];
        }
    };

    useEffect(() => {
        const loadComments = async () => {
            const data = await fetchComments();
            setComments(data);
        };
        loadComments();
    }, [id]);

    const addComment = async (content) => {
        try {
            console.log("Content", content);
            const response = await api.post(`/posts/${id}/comments/`, { content });
            return response.data;
        } catch (error) {
            console.error("Error al agregar el comentario", error);
            return null;
        }

    };

    const CommentForm = ({ onCommentAdded }) => {
        const [content, setContent] = useState("");

        const handleSubmit = async (e) => {
            e.preventDefault();
            const newComment = await addComment(content);
            if (newComment) {
                onCommentAdded(newComment);
                setContent(""); // Limpia el formulario
            }
        };

        return (
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group">
                    <label htmlFor="commentContent">Agregar un comentario</label>
                    <textarea
                        id="commentContent"
                        className="form-control"
                        rows="3"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-info mt-2">Agregar</button>
            </form>
        );
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
            <div>
                <h2 className="mt-4">Comentarios</h2>
                <CommentForm onCommentAdded={(newComment) => setComments((prev) => [newComment, ...prev])} />
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div className="card mt-2" key={comment.id}>
                            <div className="card-body">
                                <h5 className="card-title" >{comment.user.username}: </h5>
                                <p className="card-text">{comment.content}</p>
                                <p className="card-text text-muted">Comentado el {new Date(comment.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios</p>
                )}
            </div>
        </div>
    );
};

export default PostDetail;