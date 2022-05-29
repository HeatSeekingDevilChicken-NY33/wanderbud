import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../reducers/userSlice';
import axios from 'axios';



const SignupForm = () => {
    //useDispatch hook to dispatch addUser action (fetch user data)
    const dispatch = useDispatch();
    //useNavigate hook to redirect page
    const navigate = useNavigate();

    //set values for the signup form 
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        password:'' 
    })

    //check for errors in signup fields
    const [error, setError] = useState('');
    const [signedUp, setSignedUp] = useState(false);


    //onchange handler for signup form
    const onSignup = e => {
        //Deconstruct the input fields and their values from e.target
        const { name, value } = e.target
        //values will be updated with their input values
        setValues({
            ...values,
            [ name ]: value
        })
    }

    //onsubmit handler for signup form
    const handleSubmit = e => {
        const { firstName, lastName, age, email, password } = values;
        e.preventDefault();

        //checks for input fields being defined
        if (!firstName || !lastName || !age || !email || !password){
            setError(true);
        //if all fields present, send data to server
        } else {
            
                const signup = async () => {
                    //send post request to database to register user
                    const sendData = await axios.post('http://localhost:3000/signup', values);
    
                    //dispatch addUser to send the data payload with generated id to redux store
                    dispatch(addUser(sendData.data));
    
                    /* NEED TO CHANGE !!!!!!!! have backend send status, if user already exists in database, have signup error status be true and do not navigate to posts*/
                    if (sendData.data) setSignedUp(true);
                    if (sendData.data) navigate("/posts");
                }
    
                signup();
    
                //set input fields back to blank fields
                setValues({
                    firstName: '',
                    lastName: '',
                    age: '',
                    email: '',
                    password:'' 
                 })
            }

            //if signedUp successfully, 
            // if (signedUp) navigate("posts");
    
        
    }


    return (

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
                        type="text" 
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

export default SignupForm;