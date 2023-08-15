import { setPokemons } from '../actions/actions';

const initialState = {
  pokemons: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case setPokemons:
      return { ...state, pokemons: action.payload };
    default:
      return state;
  }
}

export default rootReducer;