import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Login.css";

function Login({ showSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (event) => {
  event.preventDefault();

  try {
    const auth = "Basic " + btoa(`${email}:${password}`);
    const response = await fetch("http://localhost:3000/login",{
        method: "POST",
        headers: {Authorization: auth}
      }
    )
    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem("auth", auth);
      sessionStorage.setItem("user",JSON.stringify(data.user))
      alert("Welcome back")
      navigate("/home");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server.");
  }
};
    return (
        <>
        <div className="login-page">
       <div className="login-container">
        <h1 className="dream">Dream Journal</h1>
        {/* <p>Log In </p> */}
        <form onSubmit={handleLogin} className="login-form">
            <label> Log In </label>
            <input className="inputs" type="email" value={email} name="email" onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
            <input className="inputs" type="password" value={password} name="password" onChange={(event) => setPassword(event.target.value)} Placeholder="Password" />
            <button className="button" type="submit">Login</button>
            <p className="paragraph"> Don't have an account? <span className="span" onClick={showSignup}> Sign Up</span> </p>
        </form>
 </div>
 </div>
    </>
);
}

export default Login