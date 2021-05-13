import { selectionReducer, generalReducer } from "./common";
import { combineReducers } from "redux";
import userReducer from "./user";
import metaReducer from "./metadata";
import componentsReducer from "./components";

const finalReducer = combineReducers({
  selector: selectionReducer,
  general: generalReducer,
  meta: metaReducer,
  user: userReducer,
  components: componentsReducer,
});

export default finalReducer;
