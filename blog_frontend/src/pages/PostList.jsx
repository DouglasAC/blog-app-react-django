import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchTags, setSearchTags] = useState([]);
    const [searchDate, setSearchDate] = useState("");
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [sortBy, setSortBy] = useState("");


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

    useEffect(() => {
        fetchPost();
    }, [page, searchCategory, searchTags]);


    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/posts/published/`, {
                params: {
                    page: page,
                    title: searchTitle,
                    author: searchAuthor,
                    category: searchCategory,
                    tags: searchTags,
                    date: searchDate,
                    sortBy: sortBy
                }
            }
            );
            console.log("Posts", response);
            const data = response.data.results || [];
            setPosts((prevPosts) => {
                const existingPosts = new Set(prevPosts.map((post) => post.id));
                const filteredPosts = data.filter((post) => !existingPosts.has(post.id));
                return [...prevPosts, ...filteredPosts];
            });
            setHasMore(response.data.has_more); // Verifica si hay más páginas
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar las publicaciones", error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setPosts([]);
        fetchPost();
    }


    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };


    const handleLike = async (postId) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("Debes iniciar sesión para dar me gusta a una publicación.");
            return;
        }
        try {
            const response = await api.post(`/posts/${postId}/like/`);
            console.log("Like", response.data);

            // Actualiza el estado de la publicación localmente
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, liked: response.data.liked, likes_count: response.data.likes_count } : post
                )
            );
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
                        {posts.length > 0 ? ( posts.map((post) => (
                            <div className="mb-2" key={"post-" + post.id}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title"><strong>{post.title}</strong></h5>
                                        <p className="card-text">{truncateContent(post.content, 100)}</p>
                                        <p className="card-text text-muted">Autor: {post.user.username} | Me gustas: {post.likes_count}</p>
                                        <p><strong>Categoria: </strong>{post.category ? <span className="badge text-bg-info me-2">{post.category.name}</span> : "Ninguna"}</p>
                                        <p><strong>Etiquetas: </strong>{post.tags.length > 0 ? post.tags.map(tag => <span key={tag.id} className="badge text-bg-secondary me-1">{tag.name}</span>) : "Ninguna"}</p>
                                        <button className={`btn ${post.liked ? 'btn-success' : 'btn-secondary'} me-2`} onClick={() => handleLike(post.id)}>{post.liked ? 'Te gusta' : 'Me gusta'}</button>
                                        <Link to={`/posts/${post.id}`} className="btn btn-primary ml-2">Leer más</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                        ) : (
                            <p className="text-center">No hay publicaciones</p>
                        )}
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
                        <div className="form-group mb-3">
                            <select
                                className="form-select"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <select
                                className="form-select"
                                value={searchTags}
                                onChange={(e) => {
                                    const options = Array.from(e.target.options);
                                    const selected = options.filter(option => option.selected).map(option => option.value);
                                    setSearchTags(selected);
                                    console.log("Selected tags", selected);
                                }}
                                multiple={true}
                            >
                                {tags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="date"
                                className="form-control"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <select
                                className="form-control"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="">Ordenar por</option>
                                <option value="popular">Popularidad</option>
                                <option value="recent">Reciente</option>
                                <option value="oldest">Antiguo</option>
                            </select>
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
            {hasMore && !loading && (
                <div className="d-flex justify-content-center mt-4">
                    <button className="btn btn-primary" onClick={handleLoadMore}>Cargar más</button>
                </div>
            )}

        </div>
    );
};

export default PostList;