import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import reducerOne from "./reducers/reducers";

const store = createStore(reducerOne, composeWithDevTools(applyMiddleware(thunk)));

export default store;