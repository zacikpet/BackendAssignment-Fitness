import type { UserModel } from "../db/user";
import { USER_ROLE } from "./enums";

export const serializeUser =
	(requesterRole: USER_ROLE) => (user: UserModel) => {
		const { password, ...userData } = user;

		switch (requesterRole) {
			case USER_ROLE.ADMIN: {
				return userData;
			}
			case USER_ROLE.USER: {
				return {
					id: userData.id,
					nickName: userData.nickName,
				};
			}
			default: {
				throw Error(`Unknown user role ${requesterRole}`);
			}
		}
	};
