import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");

    const fetchPost = async (title = "", author = "") => {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        try {
            const response = await api.get(`/posts/published/`, {
                params: {
                    page: page,
                    title: title,
                    author: author
                }
            }
        );
            console.log("Posts", response.data);
            const data = response.data || [];
            setPosts((prevPosts) => {
                const existingPosts = new Set(prevPosts.map((post) => post.id));
                const filteredPosts = data.filter((post) => !existingPosts.has(post.id));
                return [...prevPosts, ...filteredPosts];
            });
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar las publicaciones", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [page]);

    const handleNext = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 10
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleNext);
        return () => window.removeEventListener("scroll", handleNext);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPost(searchTitle, searchAuthor);
    };

    const handleLike = async (postId) => {
        try {
            const response = await api.post(`/posts/${postId}/like/`);
            console.log("Like", response.data);
            
            fetchPost();
        } catch (error) {
            console.error("Error al dar like a la publicación", error);
        }
    };

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) {
            return content;
        }
        return content.substring(0, maxLength) + "...";
    };

    const filteredPosts = posts.filter((post) => {
        return (
            post.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
            post.user.username.toLowerCase().includes(searchAuthor.toLowerCase())
        );
    });

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Publicaciones recientes</h1>
            <div className="row">
                <div className="col-md-8">
                    <div className="row">
                        {filteredPosts.map((post) => (
                            <div className="mb-2" key={post.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.title}</h5>
                                        <p className="card-text">{truncateContent(post.content, 100)}</p>
                                        <p className="card-text text-muted">Autor: {post.user.username} | Me gustas: {post.likes_count}</p>
                                        <button className={`btn ${post.liked ? 'btn-success' : 'btn-secondary'} me-2`} onClick={() => handleLike(post.id)}>{post.liked ? 'Te gusta' : 'Me gusta'}</button>
                                        <Link to={`/posts/${post.id}`} className="btn btn-primary ml-2">Leer más</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-4">
                    <h4 className="mb-3">Buscar publicaciones</h4>
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por título"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por autor"
                                value={searchAuthor}
                                onChange={(e) => setSearchAuthor(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Buscar</button>
                    </form>
                </div>
            </div>
            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostList;