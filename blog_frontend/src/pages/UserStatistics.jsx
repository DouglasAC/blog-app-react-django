import React, { useState, useEffect } from "react";
import api from "../api";

const UserStatistics = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await api.get("/user-statistics/");
                setStatistics(response.data);
                console.log(response.data);
            } catch (error) {
                setError("Error al cargar las estadísticas de usuario.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <p>Cargando estadísticas...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Tus estadísticas</h1>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Resumen de Publicaciones</h4>
                            <p><strong>Total de publicaciones:</strong> {statistics.total_posts}</p>
                            <p><strong>Total de borradores:</strong> {statistics.total_drafts}</p>
                            <p><strong>Total de me gusta recibidos:</strong> {statistics.total_likes}</p>
                            <p><strong>Total de comentarios recibidos:</strong> {statistics.total_comments}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Publicación con más me gusta:</h4>
                            {statistics.most_liked_posts !== null ? (statistics.most_liked_posts.map((post) => (
                                <p key={post.id}>
                                    <strong>{post.title}</strong> - {post.likes_count} me gusta. Total de comentarios: {post.comments_count}
                                </p>
                            ))
                            ) : (
                                <p>No hay publicaciones.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Categorías más utilizadas:</h4>
                            { statistics.top_category !== null ? (

                                statistics.top_category.map((category) => (
                                    <p key={category.category__name}>
                                        <strong>{category.category__name !== null ? category.category__name : "Sin categoria"}</strong> - {category.count} publicaciones
                                    </p>
                                ))

                            ) : (
                                <p>No hay categorías.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h4 className="card-title">Etiquetas más frecuentes:</h4>
                            {statistics.top_tags !== null ? (

                                statistics.top_tags.map((tag) => (
                                    <p key={tag.tags__name}>
                                        <strong>{tag.tags__name !== null ? tag.tags__name : "Sin etiqueta"}</strong> - {tag.count} publicaciones
                                    </p>
                                ))


                            ) : (
                                <p>No hay etiquetas.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );

};

export default UserStatistics;