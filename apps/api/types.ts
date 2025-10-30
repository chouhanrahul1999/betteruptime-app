import { z } from "zod";

export const AuthSchema = z.object({
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

export type Auth = z.infer<typeof AuthSchema>;
