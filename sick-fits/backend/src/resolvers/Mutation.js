const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    return item;
  },

  updateItem(parent, args, ctx, info) {
    const updates = { ...args };
    delete updates.id;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    const item = await ctx.db.query.item({ where }, `{id title}`);

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    email = email.toLowerCase();

    const user = await ctx.db.query.user({
      where: { email }
    });

    if (!user) throw new Error(`No user found for email ${email}`);

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");

    return { message: "Signed out" };
  },

  async requestReset(parent, { email }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) throw new Error(`No user found for email ${email}`);

    const randomBytesPromise = await promisify(randomBytes)(20);
    const resetToken = randomBytesPromise.toString("hex");
    const resetTokenExpiry = Date.now() + 3600000;

    await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });

    return { message: "Password reset email sent" };
  },

  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args;

    if (password !== confirmPassword) throw new Error("Passwords do not match");

    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    });

    if (!user) throw new Error("This token is either invalid or expired");

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await ctx.db.mutation.updateUser(
      {
        where: { email: user.email },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      },
      info
    );

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return updatedUser;
  }
};

module.exports = Mutation;
