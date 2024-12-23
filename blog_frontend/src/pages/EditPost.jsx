import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Toast } from 'bootstrap';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("1");
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
                const response = await api.get(`/posts/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const { title, content, status, category, tags } = response.data;
                setTitle(title);
                setContent(content);
                setStatus(status);
                setSelectedCategory(category.id.toString());
                setSelectedTags(tags.map((tag) => tag.id.toString()));
            } catch (error) {
                console.error("Error al obtener la publicación:", error);
            }
        };

        const fetchCategoriesAndTags = async () => {
            try {
                const categoriesResponse = await api.get("/categories/");
                const tagsResponse = await api.get("/tags/");
                setCategories(categoriesResponse.data);
                setTags(tagsResponse.data);
            } catch (error) {
                console.error("Error al cargar las categorías y etiquetas", error);
            }
        };


        fetchCategoriesAndTags();
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");

        try {
            await api.put(`/update-post/${id}/`,
                {
                    title,
                    content,
                    status,
                    category_id: selectedCategory,
                    tag_ids: selectedTags
                }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            //navigate("/posts");
            setSuccess("Publicación actualizada con éxito.");
            setError("");
            handleToast();

        } catch (error) {
            console.error("Error al actualizar la publicación:", error);
            setError("Error al actualizar la publicación.");
            setSuccess("");
            handleToastError();
        }
    };

    const handleTagChange = (e) => {
        const value = e.target.value;
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(value)
                ? prevSelectedTags.filter((tag) => tag !== value)
                : [...prevSelectedTags, value]
        );
    };

    const handleToast = () => {
        var myToast = Toast.getOrCreateInstance(document.getElementById('toastSuccess'));
        myToast.show();
    };

    const handleToastError = () => {
        var myToast = Toast.getOrCreateInstance(document.getElementById('toastError'));
        myToast.show();
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Editar Publicación</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div className="toast text-bg-success" role="alert" aria-live="assertive" aria-atomic="true" id="toastSuccess">
                    <div className="toast-header">
                        <strong className="me-auto">Editar Publicación</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        Publicación actualizada con éxito.
                    </div>
                </div>
            </div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div className="toast text-bg-danger" role="alert" aria-live="assertive" aria-atomic="true" id="toastError">
                    <div className="toast-header">
                        <strong className="me-auto">Editar Publicación</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        Error al actualizar la publicación.
                    </div>
                </div>    
            </div>
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
                    <SimpleMDE
                        value={content}
                        onChange={(value) => setContent(value)}>
                    </SimpleMDE>
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Categoría</label>
                    <select
                        className="form-select"
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="tags" className="form-label">Etiquetas</label>
                    <div className="row">
                        {tags.map((tag) => (
                            <div className="col-md-3" key={tag.id}>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value={tag.id.toString()}
                                        id={`tag-${tag.id}`}
                                        checked={selectedTags.includes(tag.id.toString())}
                                        onChange={handleTagChange}
                                    />
                                    <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                                        {tag.name}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
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