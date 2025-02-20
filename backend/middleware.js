import jwt from "jsonwebtoken"

export function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.split(" ")[1];

    if(!authHeader.startsWith("Bearer ")){
        return res.status(403).json({error: "Auth failed"});
    }

    try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET)
        req.email = decoded.user_email;
        next();
    } catch (error) {
        return res.status(403).json({error: "An error occurred"});
    }
}