import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post("http://localhost:8000/api/register/", formData);
            setMessage("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        } catch (error) {
            setMessage("Error al registrar el usuario.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg p-4">
                        <h2 className="text-center mb-4">Registro de Usuario</h2>
                        {message && <div className={`alert ${message.includes("éxito") ? "alert-success" : "alert-danger"}`}>{message}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="username">Nombre de usuario</label>
                                <input type="text" className="form-control" name="username" placeholder="Nombre de usuario" onChange={handleChange} />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Correo Electrónico</label>
                                <input type="email" className="form-control" name="email" placeholder="Correo electrónico" onChange={handleChange} />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" className="form-control" name="password" placeholder="Contraseña" onChange={handleChange} />
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;