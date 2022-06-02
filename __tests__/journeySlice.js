import store from '../client/store';
import * as journeyReducer from '../client/reducers/journeySlice';

describe('Journey Slice Reducer tests', () => {

    describe('Tests initial state of Journey Slice', () => {
        it('Should initialize state', () => {
            const currentState = store.getState().journeys;
            const defaultState = {
                count: 0,
                journeys: [],
                upcomingJourneys: [],
                completedJourneys: [],
            };
            expect(currentState).toEqual(defaultState);
        });
    });

    describe('Tests fetchJourney reducer', () => {
        it('Should return the journey we requested for', async () => {
            const journeysToFind = [{
                origin: "New York",
                destination: "Los Angeles",
                date: "2022-07-22"
            }];
            await store.dispatch(journeyReducer.fetchJourney(journeysToFind));
            const { journeys } = store.getState().journeys;
            expect(journeysToFind).toEqual(journeys);
        });
    });

    describe('Tests userJourney reducer', () => {
        it('Should add a journey for a given user', async () => {
            // state.upcomingJourneys = [...state.upcomingJourneys, ...action.payload];
            const payload = [{
                origin: "Paris",
                destination: "London",
                date: "2023-11-30"
            }];

            const expectedOutput = [...store.getState().journeys.upcomingJourneys, ...payload];
            
            await store.dispatch(journeyReducer.userJourney(payload));
            const { upcomingJourneys } = store.getState().journeys;
            expect(expectedOutput).toEqual(upcomingJourneys);
        });
    });
    
    describe('Tests joinJourney reducer', () => {
        it('Should join current user to a requested journey', async () => {
            const journeyToJoin = {
                origin: "New York",
                destination: "Morocco",
                date: "2022-09-10"
            };
            const expectedOutput = [...store.getState().journeys.upcomingJourneys, journeyToJoin];
            await store.dispatch(journeyReducer.joinJourney(journeyToJoin));
            const { upcomingJourneys } = store.getState().journeys;
            expect(expectedOutput).toEqual(upcomingJourneys);
        });
    });

    describe('Test unjoinJourney reducer ', () => {
        it('Should let current user unjoin a joinedJourney', async () => {
            //const newUpcomingJourneys = state.upcomingJourneys.filter(
            // (el) => el.journey_id === action.payload
            // );
            // state.upcomingJourneys = newUpcomingJourneys;
            const journeyToUnjoin = {
                origin: "New York",
                destination: "Morocco",
                date: "2022-09-10"
            };
            await store.dispatch(journeyReducer.unjoinJourney(journeyToUnjoin));
            const { upcomingJourneys } = store.getState().journeys;
            expect([]).toEqual(upcomingJourneys);
        });
    });

    describe('Test deleteJourneyDispatch reducer', () => {
        it('Should delete an entire journey', async () => {
            const journeyToDelete = {
                origin: "Paris",
                destination: "London",
                date: "2023-11-30"
            };

            await store.dispatch(journeyReducer.deleteJourneyDispatch(journeyToDelete));
            const { journeys } = store.getState().journeys;
            expect(journeys).not.toContain(journeyToDelete);
        }); 
    });
});
