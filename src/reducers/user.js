const userInitialState = {
  isLogged: false,
  email: "...",
  username: "...",
  firstName: "",
  lastName: "",
  confirmed: 0, //0: email not confirmed / user not logged in, 1: email confirmed
  diagrams: [],
  diagramsOwned: 0,
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case "STORE_USER_DATA":
      return {
        ...state,
        isLogged: true,
        email: action.payload.email,
        username: action.payload.username,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        confirmed: action.payload.confirmed,
        diagrams: action.payload.diagrams,
        diagramsOwned: action.payload.diagramsOwned,
      };
    case "REMOVE_USER_DATA":
      return userInitialState;
    default:
      return state;
  }
};

export default userReducer;
