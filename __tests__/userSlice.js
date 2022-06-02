import store from '../client/store';
import * as usersReducer from '../client/reducers/userSlice';

describe('Journey Slice Reducer tests', () => {

    describe('Tests initial state of Journey Slice', () => {
        it('Should initialize state', () => {
            const currentState = store.getState().users;
            const defaultState = {
                users: {}, //should be array or object?
                id: null,
                age:'',
                email:'',
                firstName: '',
                lastName: ''
            };
            expect(currentState).toEqual(defaultState);
        });
    });

    describe('Tests addUser reducer', () => {
        it('adds a user to state', async () => {
            // const { age, email, id, firstName, lastName} = action.payload;
            const payload = {
                age: 100, 
                email: 'bobsmith@gmail.com',
                id: 1,
                firstName: 'bob',
                lastName: 'smith'
            };
            await store.dispatch(usersReducer.addUser(payload));
            const { age } = store.getState().users;
            expect(age).toEqual(payload.age);
        });
    });
});