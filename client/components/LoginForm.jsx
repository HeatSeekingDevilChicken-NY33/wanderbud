import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../reducers/userSlice';
import { userJourney } from '../reducers/journeySlice';
import axios from 'axios';



const loginForm = () => {
    //useDispatch hook to dispatch addUser action (fetch user data)
    const dispatch = useDispatch();
    //useNavigate hook to redirect page
    const navigate = useNavigate();

    //set values for the login form 
    const [values, setValues] = useState({
        email: '',
        password:'' 
    })

    //check for errors
    const [error, setError] = useState(false);

    //onchange handler for login form
    const onLogin = e => {
        //Deconstruct the input fields and their values from e.target
        const { name, value } = e.target
        //values will be updated with their input values
        setValues({
            ...values,
            [ name ]: value
        })
        setError(false);
    }

    //onsubmit handler for login form
    const handleSubmit = e => {
        const { email, password } = values;
        e.preventDefault();

        if (!email || !password){
            setError(true);
            setValues({
                email: '',
                password:'' 
            })
        } else {
            const login = async () => {
                //send post request to database to register user
                try {
                    const sendData = await axios.post('http://localhost:3000/login', values);

                    /* NEED TO CHANGE !!!!!!!! have backend send status, if user already exists in database, have signup error status be true and do not navigate to posts*/
                    console.log('login response', sendData.data)

                    if(sendData.data) {
                        dispatch(addUser(sendData.data.userData));
                        const { journeyData } = sendData.data;
                        journeyData.map((obj) => obj.date = obj.date.toString().slice(0,10))
                        dispatch(userJourney(journeyData));
                        navigate("/journey"); 
                    }

                } catch (err) {
                    setError(true);
                    console.log('error', err);
                }
                
            }

            login();

            //set input fields back to blank fields
            setValues({
                email: '',
                password:'' 
             })
        }
    }



    return (

        <div className="login">
            {/* LOGIN FORM */}
            <form className="login-form" onSubmit={handleSubmit}>
                <h1> Welcome back </h1>
                <div className="login-inputs">
                    <label htmlFor="email" className="login-label">Email </label>
                    <input 
                        id="email"
                        type="text" 
                        name="email" 
                        className="login-input" 
                        placeholder="Enter your email"                        
                        value={values.email}
                        onChange={onLogin}
                    />
                </div>
                {/* password */}
                <div className="login-inputs">
                    <label htmlFor="password" className="login-label">Password </label>
                    <input 
                        id="password"
                        type="password" 
                        name="password" 
                        className="login-input" 
                        placeholder="Choose a password"
                        value={values.password}
                        onChange={onLogin}
                    />
                </div>
                <div className="form-input-btn">
                    <button className="login-form-btn" type="submit">Login</button>
                </div>
                {/* If field is missing, then display error message */}
                {error && <p style={{color:"#FF3D2E"}}>Invalid email or password. Try Again</p>}
            </form>
    
        </div>
    );

};

export default loginForm;