import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await axios.get(`http://localhost:8000/api/posts/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const { title, content, status } = response.data;
                setTitle(title);
                setContent(content);
                setStatus(status);
            } catch (error) {
                console.error("Error al obtener la publicación:", error);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");

        try{
            await axios.put(`http://localhost:8000/api/update-post/${id}/`, 
                { title, content, status }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            //navigate("/posts");
            setSuccess("Publicación actualizada con éxito.");
        } catch (error) {
            console.error("Error al actualizar la publicación:", error);
            setError("Error al actualizar la publicación.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Editar Publicación</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">Contenido</label>
                    <textarea
                        className="form-control"
                        id="content"
                        rows="5"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Estado</label>
                    <select
                        className="form-select"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="0">Borrador</option>
                        <option value="1">Publicado</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Actualizar Publicación</button>
            </form>
        </div>
    );
};

export default EditPost;