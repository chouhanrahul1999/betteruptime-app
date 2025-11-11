import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().trim().nonempty({ message: "Email is required"}).email({ message: "Please enter a valid email address" }).max(254, { message: "Email must be at most 254 characters" }).toLowerCase(),
  username: z
    .string()
    .trim()
    .nonempty({ message: "Username is required" })
    .min(6, { message: "Username must be at least 6 characters" })
    .max(50, { message: "Username must be at most 50 characters" }),
  password: z
    .string()
    .trim()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be at most 128 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
});

export const SigninSchema = z.object({
  username: z.string().trim().nonempty({ message: "Username is required" }),
  password: z.string().trim().nonempty({ message: "Password is required" }),
});

export type Signup = z.infer<typeof SignupSchema>;
export type Signin = z.infer<typeof SigninSchema>;
