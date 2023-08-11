import { SET_POKEMONS } from '../actions/actions';

const initialState = {
  pokemons: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_POKEMONS:
      return { ...state, pokemons: action.payload };
    default:
      return state;
  }
}

export default rootReducer;