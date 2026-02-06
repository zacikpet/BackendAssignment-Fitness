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
				message: res.__("body_validation_failed"),
				errors: errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				})),
			});
		}

		next();
	};
};

export const validateQuery = (dtoClass: ClassConstructor<object>) => {
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
				message: res.__("query_validation_failed"),
				errors: errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				})),
			});
		}

		next();
	};
};

export const validateParams = (dtoClass: ClassConstructor<object>) => {
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
				message: res.__("params_validation_failed"),
				errors: errors.map((e) => ({
					property: e.property,
					constraints: e.constraints,
				})),
			});
		}

		next();
	};
};

export const internalErrorHandler = async (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): Promise<any> => {
	console.error(err.stack);
	res.status(500).json({ message: res.__("something_went_wrong") });
};
