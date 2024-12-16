import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { use } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("0");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("1");
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/create-post/",
                {
                    title,
                    content,
                    status,
                    category_id: selectedCategory,
                    tag_ids: selectedTags
                }
            );
            console.log("Publicación creada:", response.data);
            navigate("/manage-posts"); // Redirigir a la lista de publicaciones
        } catch (error) {
            console.error("Error al crear la publicación:", error);
            setError("Error al crear la publicación.");
        }
    };

    const handleTagChange = (e) => {
        const value = e.target.value;
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(value)
                ? prevSelectedTags.filter((tag) => tag !== value)
                : [...prevSelectedTags, value]
        );
        console.log("Selected tags", selectedTags);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Crear Publicación</h1>
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
                                        value={tag.id}
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
