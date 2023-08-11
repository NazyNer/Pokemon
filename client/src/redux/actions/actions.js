import { SET_POKEMONS } from '../actions/types';

export function setPokemons(pokemons) {
  return {
    type: SET_POKEMONS,
    payload: pokemons,
  };
}