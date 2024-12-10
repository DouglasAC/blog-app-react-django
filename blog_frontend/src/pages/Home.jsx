import React from "react";

const Home = () => {
  return (
    <div className = "container mt-5">
      <div className = "text-center">
        <h1>Bienvenido a Mi Blog</h1>
        <p className="lead text-secondary">Explora artículos escritos por nuestros usuarios.  
        </p>
        <a href="/posts" className="btn btn-primary">Ver Publicaciones</a>
      </div> 
    </div>
  );
};

export default Home;