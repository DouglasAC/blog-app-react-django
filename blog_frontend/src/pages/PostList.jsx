import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loaging, setLoading] = useState(false);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/posts/?page=${page}`);
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

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary mb-4">Publicaciones recientes</h1>
            <div className="row">
                {posts.map((post) => (
                    <div className="mb-2" key={post.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.content}</p>
                                <p className="card-text text-muted">Autor: {post.user.username}</p>
                                <Link to={`/posts/${post.id}`} className="btn btn-primary">Leer más</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {loaging && (
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