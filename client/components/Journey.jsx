import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { joinJourney, unjoinJourney, deleteJourneyDispatch } from "../reducers/journeySlice"
import { selectUserId } from "../reducers/userSlice";
import wanderbud from '../media/wanderbud-logo.png';

// const Journey = ({origin, destination, date, journey_id})=>{
const Journey = ({journey, index}) => {
    const [ toggle, setToggle ] = useState(true);
    const [ error, setError ] = useState(false);
    const dispatch = useDispatch();
    const user_id = useSelector(selectUserId);

    const { origin, destination, date, creator, distance, journey_id, completed, duration, totalCost} = journey;
    const { firstName } = creator;
    

    const joinObj = {
        userID: user_id,
        journeyID: journey_id
    }

    console.log('joinObj', joinObj);
    console.log('JOURNEY STATUS:' ,completed );


    const handleDelete = (e) => {
        e.preventDefault()
        const deleteJourney = async() => { 
            try {
                const deleteData = await axios.delete('http://localhost:3000/journey', {data:{joinObj}});
                console.log('delete response', deleteData)
            }
            catch (err) {
                setError(true);
            }
        }
        deleteJourney();
        console.log("hello")
        dispatch(deleteJourneyDispatch(index));
    }


    const handleClick = e => {
        setToggle(!toggle);
        console.log(toggle);
        e.preventDefault();
        const { userID, journeyID } = joinObj;
        //checks for input fields being defined
        if (!userID || !journeyID){
            setError(true)
            console.log('Journey error')
        //if all fields present, send data to server
        } else if (toggle === true) {

            const join = async () => {
                try {
                    const joinData = await axios.post('http://localhost:3000/journey/join', joinObj);
                    console.log('joinData', joinData.data);
                    //dispatch addUser to send the data payload with generated id to redux store

    
                    /* NEED TO CHANGE !!!!!!!! have backend send status, if user already exists in database, have signup error status be true and do not navigate to posts*/
                    if (joinData.data) {
                        dispatch(joinJourney(joinData.data));
                        console.log('Join Successful')
                    }
                } catch (err) {
                    setError(true);
                    console.log('error', err);
                }
                //send post request to database to register user
                
            }

            join();

        } else if (toggle === false) {
            const unjoin = async () => {
                try {
                    const unjoinData = await axios.delete('http://localhost:3000/journey/join', {data:{joinObj}});
                    console.log('unjoinData', unjoinData.data);
                    //dispatch addUser to send the data payload with generated id to redux store

    
                    dispatch(unjoinJourney(journeyID));
                    // if (unjoinData.data) {
                    //     dispatch(deleteUser(unjoinData.data));
                    console.log('Unjoin Successful')
                    // }

                } catch (err) {
                    setError(true);
                    console.log('error', err);
                }
                //send post request to database to register user
                
            }

            unjoin();
        }
    }

    
    return (
        <div className="journey-component">
            <div className="journey-logo">
                <img className="journey-img" src={wanderbud} />
            </div>
            <div className="mainFrame">
                <div className="topPart">
                    <div className="journey-label">
                        <p className="journey-trait-label">Origin: </p>
                        <p className="journey-trait">{origin}</p>
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label">Destination:</p>
                        <p className="journey-trait">{destination}</p>
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label" >Date:</p>
                        <p className="journey-trait" >{date}</p>
                    </div>
                    {/* NEV: Another conditional added here to check completion status, so there is no join button for the past journeys anymore */}
                    <div className="join-btn">
                        {creator.user_id === user_id? <button className="deleteButton" onClick={handleDelete}>X</button> : completed=== "0" ? <button className="joinButton" onClick={handleClick}>{toggle? "Join" : "Unjoin"}</button> : <p></p> }
                    </div>
                

                </div>

                <div className="bottomPart">
                    <div className="journey-label">
                        <p className="journey-trait-label" >Posted by:</p>
                        <p className="journey-trait" >{firstName}</p>
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label" >Journey Status:</p>
                        {completed === "1" ? <p className="journey-trait" >Completed</p> : <p className="journey-trait" >Upcoming</p> }
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label" >Distance in KM</p>
                        <p className="journey-trait" >{distance}</p>
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label" >Duration in hrs:</p>
                        <p className="journey-trait" >{duration}</p>
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label" >Cost per:</p>
                        <p className="journey-trait" >{totalCost}</p>
                    </div>
                    {/* <div className="journey-label">
                        <p className="journey-trait-label" >Distance:</p>
                        <p className="journey-trait" >{distance}</p>
                    </div>

                    <div className="journey-label">
                        <p className="journey-trait-label" >Cost:</p>
                        <p className="journey-trait" >{cost}</p>  
                    </div>               */}
                </div>
                {error && <p>Operation unsuccessful</p>}
            </div>
        </div>
        
    )

}


export default Journey;
