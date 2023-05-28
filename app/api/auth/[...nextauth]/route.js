import User from '@models/user';
import connectedToDB from '@utils/database';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),
  ],
  async session({ session }) {
    const sessionUser = await User.findOne({
      email: session.user.email,
    });

    session.user.id = sessionUser._id.toString();

    return session;
  },
  async signIn({ profile }) {
    try {
      await connectedToDB();

      // check if a user already exists
      const user = await User.findOne({
        email: profile.email,
      });

      // if not, create a new user
      if (!user) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(/ /g, '').toLowerCase(),
          image: profile.picture,
        });
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

export { handler as GET, handler as POST };
