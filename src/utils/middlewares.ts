import { type ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";

export const allowedRoles = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction): any => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ message: "Forbidden" });
		}
		next();
	};
};

export const validateBody = (dtoClass: ClassConstructor<object>) => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		const dto = plainToInstance(dtoClass, req.body);
		const errors = await validate(dto, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			return res.status(400).json({
				message: "Body validation failed",
				errors: errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				})),
			});
		}

		next();
	};
};

export function validateQuery(dtoClass: ClassConstructor<object>) {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		const dto = plainToInstance(dtoClass, req.query);
		const errors = await validate(dto, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			return res.status(400).json({
				message: "Query validation failed",
				errors: errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				})),
			});
		}

		next();
	};
}

export function validateParams(dtoClass: ClassConstructor<object>) {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<any> => {
		const dto = plainToInstance(dtoClass, req.params);
		const errors = await validate(dto, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			return res.status(400).json({
				message: "Path parameter validation failed",
				errors: errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				})),
			});
		}

		next();
	};
}
