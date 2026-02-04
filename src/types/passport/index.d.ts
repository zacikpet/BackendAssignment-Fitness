import type { UserModel } from "../../db/user";

declare global {
	namespace Express {
		interface User extends UserModel {}
	}
}
