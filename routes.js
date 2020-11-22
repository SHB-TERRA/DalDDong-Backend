const HOME = "/";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const USER_PROMISES = "/:id/promises";
const LOGOUT_SESSIONS = "/:id/logout-sessions";
const AUTH = "/auth";

// Promises
const PROMISES = "/promises";
const PROMISE_DETAIL = "/:id";

// Calendar
const CALENDAR = "/calendar";

const routes = {
    home: HOME,
    users: USERS,
    userDetail: id => {
        if(id){
            return `/users/${id}`;
        } else {
            return USER_DETAIL;
        }
    },
    userPromises: USER_PROMISES,
    logoutSessions: LOGOUT_SESSIONS,
    promises: PROMISES,
    promiseDetail: id => {
        if (id) {
            return `/promises/${id}`;
        } else {
            return PROMISE_DETAIL;
        }
    },
    calendar: CALENDAR,
    auth: AUTH
}

export default routes;