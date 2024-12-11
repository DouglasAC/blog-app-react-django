import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    // Verifica si el usuario está autenticado mediante el token en localStorage
    const isAuthenticated = !!localStorage.getItem("accessToken");

    // Manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    BlogApp
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/posts">
                                Publicaciones
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/create-post">
                                    Crear Publicación
                                </Link>
                            </li>
                        )}
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-link nav-link"
                                        onClick={handleLogout}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Iniciar Sesión
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
