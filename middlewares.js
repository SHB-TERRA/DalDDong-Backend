import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Lunch-Mate";
    res.locals.routes = routes;
    res.locals.user = req.user || null;
    console.log(req.user);
    next();
}

// 로그인되어 세션에 유저정보가 있다면 req.isAuthenticated() 결과값 true
export const isLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(403).json({message: '로그인이 필요합니다.'});
    }
}

export const isLogOut = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    } else{
        return res.status(403).json({ message: '이미 로그인된 상태입니다.'});
    }
}