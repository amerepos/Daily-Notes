import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBInput,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import { loginUser, registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleJustifyClick = (value) => {
    if (value === justifyActive) return;
    setJustifyActive(value);
    setError(""); // Clear error on tab change
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        username: formData.username,
        password: formData.password,
      });
      console.log("Login successful:", response);
      navigate("/"); // Redirect to MyNotes after login
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });
      console.log("Registration successful:", response);
      navigate("/"); // Redirect to MyNotes after registration
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs
        pills
        justify
        className="mb-3 d-flex flex-row justify-content-between"
      >
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab1")}
            active={justifyActive === "tab1"}
          >
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab2")}
            active={justifyActive === "tab2"}
          >
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        {/* Login Tab */}
        <MDBTabsPane className={justifyActive === "tab1" ? "show active" : ""}>
          <MDBInput
            wrapperClass="mb-4"
            label="Username"
            id="loginUsername"
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="loginPassword"
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
          {error && justifyActive === "tab1" && (
            <p className="text-danger">{error}</p>
          )}
          <MDBBtn className="mb-4 w-100" onClick={handleLogin}>
            Sign in
          </MDBBtn>
        </MDBTabsPane>

        {/* Register Tab */}
        <MDBTabsPane className={justifyActive === "tab2" ? "show active" : ""}>
          <MDBInput
            wrapperClass="mb-4"
            label="Username"
            id="registerUsername"
            type="text"
            name="username"
            onChange={handleChange}
            value={formData.username}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Email"
            id="registerEmail"
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            id="registerPassword"
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
          />
          {error && justifyActive === "tab2" && (
            <p className="text-danger">{error}</p>
          )}
          <MDBBtn className="mb-4 w-100" onClick={handleRegister}>
            Sign up
          </MDBBtn>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default AuthForm;
