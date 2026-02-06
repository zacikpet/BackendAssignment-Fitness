import type { NextFunction, Request, Response } from "express";

const allowedRoles = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): any => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	};
};

export { allowedRoles };
