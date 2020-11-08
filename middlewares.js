import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Lunch-Mate";
    res.locals.routes = routes;
    next();
}