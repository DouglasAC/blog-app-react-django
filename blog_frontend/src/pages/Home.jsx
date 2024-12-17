import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const Home = () => {
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const response = await api.get("/posts/published/",
          {
            params: {
              page: 1,
              sortBy: "popular",
              limit: 3,
            },
          }
        );
        setTopPosts(response.data.results);
        console.log("Publicaciones populares:", response.data.results);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };

    fetchTopPosts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1>Bienvenido a Mi Blog</h1>
        <p className="lead text-secondary">Explora artículos escritos por nuestros usuarios.
        </p>
        <a href="/posts" className="btn btn-primary">Ver Publicaciones</a>
      </div>
      <div className="row mt-5">
        <h2 className="text-center">Publicaciones Populares</h2>
        {topPosts.map((post) => (
          <div className="col-md-4 mb-4" key={post.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text-muted">
                  Publicado por {post.user.username} el {new Date(post.created_at).toLocaleDateString()} | Me gustas: {post.likes_count}
                </p>
                <p><strong>Categoria: </strong>{post.category ? <span className="badge text-bg-info me-2">{post.category.name}</span> : "Ninguna"}</p>
                <p><strong>Etiquetas: </strong>{post.tags.length > 0 ? post.tags.map(tag => <span key={tag.id} className="badge text-bg-secondary me-1">{tag.name}</span>) : "Ninguna"}</p>

                <Link to={`/posts/${post.id}`} className="btn btn-primary">Leer más</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;