import { createSlice } from '@reduxjs/toolkit';

//REDUCER FUNCTION
export const userSlice = createSlice({
  name: 'user',
  //define initial state
  initialState: {
    users: {}, //should be array or object?
    id: null,
    age:'',
    email:'',
    firstName: '',
    lastName: ''
    //{id1 : {user info}, id2: {user info}}
  },
  
  //reducer functions
  reducers: {
    // populateUsers: (state, action) => {
    //   state.users = action.payload;

    // },
    // fetchUsers: (state, action) => {
    //   action.payload.map((el)=> state.users[el.id] = el);
      
    // },

    //SIGNUP USER REDUCER FUNCTION - 1st thing to be done!

    addUser: (state, action) => {
      const { age, email, id, firstName, lastName} = action.payload;
      state.age = age;
      state.email = email;
      state.id = id;
      state.firstName = firstName;
      state.lastName = lastName;
      console.log('in addUser reducer state', state.firstName)
    },

    //MODIFY THE USER INFO BASED ON USER KEY AND ADD JOURNEY TO USER, ADD USER TO JOURNEY
    joinUser: (state, action) => {
      //add journey to user's journey list

    },

    //STRETCH FEATURE
    deleteUser: (state, action) => {

      delete state.users[action.payload.id];

    }

  },

})


export const { addUser, joinUser, deleteUser } = userSlice.actions


//SELECTORS TO INCLUDE
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectUserId = (state) => state.users.id
export const selectFirstname = (state) => state.users.firstName
export const selectLoggedInUser = (state) => {
  const { id, age, email,firstName, lastName} = state.users;
  return { id, age, email,firstName, lastName}
}

export default userSlice.reducer