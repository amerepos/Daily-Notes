import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthForm from "./components/AuthForm";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MyNotes from "./components/NoteComponent";
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MyNotes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
