import React, {useState} from 'react'
import { Link, NavLink, Navigate, useNavigate } from 'react-router'
import { FaGoogle,FaGithub } from "react-icons/fa6";
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ()=> {
  const navigate = useNavigate()
        const [formData, setFormData] = useState({email: "", password: ""})
        const [message, setMessage] = useState("")
        const [error, setError] = useState("")
    
        const LoginhandleChange = (e)=> {
              setFormData(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
        }
    
 const handleSubmit = async (e) => {
    e.preventDefault();
    setError();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("Logged in:", userCredential.user);

      navigate("/dashboard", { replace: true });

      // redirect or show dashboard
    } catch (err) {
      console.error(err.message);
      setError("Invalid email or password");
    }
  };


  return (
       <div className="login-wrapper">
        <div className="container">
         <div className="signUp-inner">   
      <div className="login-right w-50">
        <img src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D" />
      </div>

      <div className="login-left padding-form w-50">
        <form className="login-form" onSubmit={handleSubmit} >
          <h2>Hello, Weclome Back</h2>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

 

          <div className="input-group-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={LoginhandleChange}
            placeholder='Enter your email...'
            />
          </div>

          <div className="input-group-2">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={LoginhandleChange}
              placeholder='Enter your password...'
            />
          </div>

          <button type="submit" className='btn-register' >Login</button>

          <div className="seprator">
            <h5>or</h5>
          </div>
          <div className="other-links">
            <ul>
              <li><Link to='#'><FaGoogle /></Link></li>

              <li><Link to='#'><FaGithub /></Link></li>
            </ul>
          </div>

          <p className="signup-link">
            Don't have an account? 
            <NavLink to="/sign-up">Sign Up</NavLink>
            

          </p>
        </form>
      </div>

      </div>{/**signUp-inner**/}
      </div>
    </div>
  )
}

export default Login