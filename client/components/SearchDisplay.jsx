import React, { useState, useEffect, Component } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import axios from "axios";


// import { useNavigate } from "react-router-dom";
// import { fetchPosts } from "../reducers/postSlice";

const App = () => {
  // Define the initial state
  const initialState = {
    origin: "",
    destination: "",
    date: "",
    driver: "",
  };
  // We need 2 hooks, one for origin,destination,date. The other is for checkbox to determine is it driver or passenger
  const [info, setInfo] = useState(initialState);
  const [isChecked, setIsChecked] = useState(false);

  //Useffect will be invoked whenever there is a change in info hook, then will send a post request
  // then receive the response from the backend which is revised journey table
  useEffect(() => {
    console.log(info);
    if (info.origin !== "") {
      axios
        .post("http://localhost:3000/journey", { info })
        .then((res) => {
          let newData = res.data;
        })
        .catch((err) => {
          console.log("POST REQUEST FAILED");
        });
    }
  }, [info]);

  // Handlesubmit will bundle info from the inputs, make it ready to send the post request
  const handleSubmit = () => {
    console.log(document.getElementById("origin").value);
    setInfo({
      origin: document.getElementById("origin").value,
      destination: document.getElementById("destination").value,
      date: document.querySelector('input[id="datee"]').value,
      driver: isChecked,
    });
  };
  //backend will send back a response with all the posts data
  //dispatch fetch posts method to store those posts in the redux store

  // This function is for checkbox, when checkbox clicked, it will reverse its state
  const checkBox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <input
          id="origin"
          type="text"
          placeholder="Where is your origin?"
        ></input>
        <input
          id="destination"
          type="text"
          placeholder="Where is your destination"
        ></input>
        <div>
          <label>Date Selection</label>
          {/* WE SHOUD LIMIT THE DATE PER THE MOST RECENT DATE */}
          <input id="datee" type="date" />
        </div>
        <label className="driver" id="1">
          Driver
          <input
            type="checkbox"
            id="driverOrPassenger"
            value="Driver"
            checked={isChecked}
            onChange={checkBox}
          />
        </label>
        <button onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default searchBar;
