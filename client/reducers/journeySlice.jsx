import { createSlice } from "@reduxjs/toolkit";

//REDUCER FUNCTION
export const journeySlice = createSlice({
  name: "journey",
  //define initial state
  initialState: {
    count: 0,
    journeys: [],
    upcomingJourneys: [],
    completedJourneys: [],
  },

  //reducer functions
  reducers: {
    //GET REQUEST
    fetchJourney: (state, action) => {
      //response is array
      state.journeys = [...action.payload];
      console.log("in dispatcher", state.journeys[0]);
    },

    userJourney: (state, action) => {
      state.upcomingJourneys = [...state.upcomingJourneys, ...action.payload];
      console.log("in UserJourney", state.upcomingJourneys);

    },

    // JOIN POST WILL BE A STRETCH FEATURE
    joinJourney: (state, action) => {
      // state.posts[action.payload.id].buds.push(action.payload.user)
      state.upcomingJourneys.push(action.payload);
    },

    unjoinJourney: (state, action) => {
      // state.posts[action.payload.id].buds.push(action.payload.user)
      const newUpcomingJourneys = state.upcomingJourneys.filter(
        (el) => el.journey_id === action.payload
      );
      state.upcomingJourneys = newUpcomingJourneys;
      console.log("Unjoin a journey");
    },

    deleteJourneyDispatch: (state, action) => {
      console.log("HERE IS THE ACTION",action);
      console.log("HERE IS THE STATE ==>", state);
      const deleteJourneys = state.journeys.filter(
        (el, i) => i != action.payload
      );
      state.journeys = deleteJourneys;
      // console.log("Delete a journey", state.journeys.journeys[0]);
      console.log("Upcoming Journeys", state.journeys.upcomingJourneys);
      console.log("HERE IS DELETE JOURNEY",deleteJourneys);
    },
  },
});

export const {
  fetchJourney,
  userJourney,
  joinJourney,
  unjoinJourney,
  deleteJourneyDispatch,
} = journeySlice.actions;

//SELECTORS TO INCLUDE
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectJourney = (state) => state.journeys.journeys;
export const selectUpcomingJourneys = (state) =>
  state.journeys.upcomingJourneys;

export default journeySlice.reducer;
