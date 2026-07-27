import { useState } from "react";
import "../styling/Signup.css"; 

function Signup ({showLogin}){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async (event) =>{
        event.preventDefault();
        try{
            const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({name,email,password,confirmPassword,}),
    });
    const data = await response.json()
    if(response.ok){
        alert("Account created successfully!");
        setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); showLogin();
    }else{
        alert(data.message)
    }}catch(error){
       console.error(error);
       alert("Unable to connect to the server.");
    }
}
 return(
    <>
    <div className="signup-page">
        <div className="signup-container">
            <div className="signup-content">
    <h1>create your account</h1>

    <form onSubmit={handleSignup} className="signup-form">
      <input type="text" value={name} name="name" onChange={(event)=>setName(event.target.value)} placeholder="Name"/>
      <input type="email" value={email} name="email" onChange={(event)=>setEmail(event.target.value)} placeholder="Email"/>
      <input type="password" value={password} name="password" onChange={(event)=>setPassword(event.target.value)} placeholder="Password"/>
      <input type="password" value={confirmPassword} name="confirm" onChange={(event)=>setConfirmPassword(event.target.value)} placeholder="Confirm Password"/>
      
      <button type="submit"> Sign Up </button>
      <p> Already have an account? <span onClick={showLogin}> Login </span> </p>
    </form>
    </div>
    </div>
    </div>
    </>
 );
}

export default Signup