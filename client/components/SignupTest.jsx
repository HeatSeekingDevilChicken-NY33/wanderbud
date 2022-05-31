import React, { useEffect, useState } from 'react';
import { useSignup } from '../utils/useSignup';
import { addUser } from '../reducers/userSlice';
import axios from 'axios';



const SignupTest = () => {
    const { values, onSignup, error, handleSubmit } = useSignup();

    return (
        // <form className="login-form">
        //     <input type="text" name="email" value={userEmail} onChange={setUserEmail}/><br/>
        //     {/* <input type="password" name="password" value={userPassword} onChange={setUserPassword}/><br/>
        //     <button className="login-btn" onClick={handleLogin}>Login</button> */}
        // </form>
        <div className="signup">
            {/* SIGNUP FORM */}
            <form className="signup-form" onSubmit={handleSubmit}>
                <h1> Get started </h1>
                {/* first name input */}
                <div className="signup-inputs">
                    <label htmlFor="firstName" className="signup-label">First Name</label>
                    <input 
                        id="firstName"
                        type="text" 
                        name="firstName" 
                        className="signup-input" 
                        placeholder="Enter your first name"
                        value={values.firstName}
                        onChange={onSignup}
                    />
                </div>
                {/* last name input */}
                <div className="signup-inputs">
                    <label htmlFor="lastName" className="signup-label">Last Name </label>
                    <input 
                        id="lastName"
                        type="text" 
                        name="lastName" 
                        className="signup-input" 
                        placeholder="Enter your last name"
                        value={values.lastName}
                        onChange={onSignup}
                    />
                </div>
                {/* age input*/}
                <div className="signup-inputs">
                    <label htmlFor="age" className="signup-label">Age </label>
                    <input 
                        id="age"
                        type="text" 
                        name="age" 
                        className="signup-input" 
                        placeholder="Enter your age"
                        value={values.age}
                        onChange={onSignup}
                    />
                </div>
                {/* email */}
                <div className="signup-inputs">
                    <label htmlFor="email" className="signup-label">Email </label>
                    <input 
                        id="email"
                        type="text" 
                        name="email" 
                        className="signup-input" 
                        placeholder="Enter your email"                        
                        value={values.email}
                        onChange={onSignup}
                    />
                </div>
                {/* password */}
                <div className="signup-inputs">
                    <label htmlFor="password" className="signup-label">Password </label>
                    <input 
                        id="password"
                        type="password" 
                        name="password" 
                        className="signup-input" 
                        placeholder="Choose a password"
                        value={values.password}
                        onChange={onSignup}
                    />
                </div>
                <button className="form-input-btn" type="submit">Sign up</button>
                {/* If field is missing, then display error message */}
                {error && <p> Please input required fields </p>}
            </form>
    
        </div>
    );

};

export default SignupTest;