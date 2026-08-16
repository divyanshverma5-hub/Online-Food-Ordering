import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "Authentication required"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRETKEY
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token"
        });

    }
}

export function roleMiddleware(requiredRole) {

    return (req, res, next) => {

        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                success: false,
                msg: "Access denied"
            });
        }

        next();
    };
}