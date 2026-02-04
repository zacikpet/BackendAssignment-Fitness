import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { models } from "../db";

const { User } = models;

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

passport.use(
	new JwtStrategy(options, async (jwtPayload, done) => {
		try {
			const user = await User.findByPk(jwtPayload.id);
			if (user) {
				return done(null, user);
			}
			return done(null, false);
		} catch (error) {
			return done(error, false);
		}
	}),
);

export default passport;
