import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("0");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/create-post/",
                { title, content, status },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("Publicación creada:", response.data);
            navigate("/manage-posts"); // Redirigir a la lista de publicaciones
        } catch (error) {
            console.error("Error al crear la publicación:", error);
            setError("Error al crear la publicación.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary">Crear Publicación</h1>
            {error && <div className="alert alert-danger">{error}</div>}
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
                    >
                        <option value="0">Borrador</option>
                        <option value="1">Publicado</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>
        </div>
    );
};

export default CreatePost;
