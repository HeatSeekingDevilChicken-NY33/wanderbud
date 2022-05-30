import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchJourney } from '../reducers/journeySlice';
import axios from 'axios';

const SearchTest = () => {
    //select userID 
    const dispatch = useDispatch();
    const [values, setValues] = useState({
        origin: '',
        destination: '',
        date: '',
        driver: false,
        select: 'create'
    })

    const [option, selectOption] = useState('');

    const [error, setError] = useState('');

    const onSearch = e => {
        const {name, value, checked} = e.target;
        //  console.log('onSearch', e.target.checked)

        setValues({
            ...values,
            [ name ]: value,
            driver: !checked
        })
     console.log(values);
    }

    //don't fully understand why select needs to be separated but
    //this is the only thing that works
    const onSelect = e => {
        const selected = e.target.value;
        setValues({
            ...values,
            select: selected
        })
        console.log('select me', selected);
        console.log('inside select', values)
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { origin, destination, date, driver, select } = values;

        if (!origin || !destination || !date || !select){
            setError(true);
        } else {
            const search = async () => {
                (console.log('please submit', select))
                try {
                    if (select === "find"){
                        (console.log('inside find', {origin, destination, date}))
                        const findJourney = await axios.post('http://localhost:3000/journey/find', {origin, destination, date})
                        console.log(findJourney.data);

                        if(findJourney.data){
                            dispatch(fetchJourney(findJourney.data));
                        }
                    } else if (select === "create"){
                        const createJourney = await axios.post('http://localhost:3000/journey/create', values);
                        console.log('post journey', createJourney.data);

                        if(createJourney.data){
                            dispatch(fetchJourney(createJourney.data))
                        }
                    }

                } catch (err) {
                    setError(true)
                    console.log(err);
                }
            }

            search();

            setValues({
                origin: '',
                destination: '',
                date: '',
                driver: false,
                select: 'create'
            })
        }
  }



  return (
    <div className="searchTest">
        <form className="search-posts" onSubmit={handleSubmit}>
        <div className="search-inputs">
                <label htmlFor="origin" className="search-label">Origin</label>
                <input
                  id="origin"
                  type="text"
                  name="origin"
                  className="search-input"
                  placeholder="Enter your origin"
                  value={values.origin}
                  onChange={onSearch}
                />
            </div>
            <div className="search-inputs">
                <label htmlFor="destination" className="search-label">Destination</label>
                <input
                  id="destination"
                  type="text"
                  name="destination"
                  className="search-input"
                  placeholder="Enter your destination"
                  value={values.destination}
                  onChange={onSearch}
                />
            </div>
            <div className="search-inputs">
                <label htmlFor="date" className="search-label">Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  className="search-input"
                  value={values.date}
                  onChange={onSearch}
                />
            </div>
            <div className="search-inputs">
                <label htmlFor="driver" className="search-label">Driver</label>
                <input
                  id="driver"
                  type="checkbox"
                  name="driver"
                  className="search-input"
                  value={values.driver}
                  onChange={onSearch}
                />
            </div>
            <div className="search-inputs">
                <select 
                    className="select"
                    value={values.select} 
                    onChange={onSelect}
                >
                    <option value="create">Create a journey</option>
                    <option value="find">Find a journey</option>
                    {/* {options.map(option => (
                        <option value={option.value}>
                            {option.label}
                        </option>
                    ))} */}
                </select>
            </div>
            <div className="search-submit">
                <button className="search-btn" type="submit">Submit</button>
            </div>
            {error && <p style={{color:"#FF3D2E"}}> Please input required fields </p>}

        </form>
            
    </div>
  )
}

export default SearchTest;