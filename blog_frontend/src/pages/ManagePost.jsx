import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManagePost = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await axios.get("http://localhost:8000/api/user-posts/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPosts(response.data);
            } catch (error) {
                console.error("Error al obtener las publicaciones:", error);
            }
        };

        fetchUserPosts();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Mis Publicaciones</h1>
            <div className="row">
                { posts.length > 0 ? (
                    posts.map((post) => (
                        <div className="col-md-6 mb-4" key={post.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    <p className="card-text text-muted">
                                        {post.status === 0 ? "Borrador" : "Publicado"}
                                    </p>
                                    <Link to={`/edit-post/${post.id}`} className="btn btn-warning me-2"> Editar</Link>
                                    <button className="btn btn-danger">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    )) 
                ) : (
                    <p className="text-center">No tienes publicaciones</p>
                )}
            </div>
        </div>
    );
};

export default ManagePost;