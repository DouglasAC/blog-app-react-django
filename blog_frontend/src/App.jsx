import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Loging";
import Navbar from "./components/NavBarr";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ManagePost from "./pages/ManagePost";

const App = () => {
  return (
    
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/manage-posts" element={<ManagePost />} />
      </Routes>
    </Router>
  );
};

export default App;