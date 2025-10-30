import { prismaClient } from "store/client";
import { AuthSchema } from "../../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { Router } from "express";

const router = Router();

router.post("/signup", async (req, res) => {
  const result = AuthSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten();
    return res.status(400).json({
      message: "Invalid request payload",
      errors,
    });
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10);
  try {
    let user = await prismaClient.user.create({
      data: {
        username: result.data.username,
        password: hashedPassword,
      },
    });
    return res.status(200).json({
      id: user.id,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
});

router.post("/signin", async (req, res) => {
  const result = AuthSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten();
    return res.status(400).json({
      message: "Invalid request payload",
      errors,
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      username: result.data?.username,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid cradentials",
    });
  }

  const decodedPassword = await bcrypt.compare(
    result.data.password,
    user.password
  );

  if (!decodedPassword) {
    return res.status(401).json({
      message: "Incorrect password",
    })
  }

  let token = jwt.sign({
    id: user.id,
  }, process.env.JWT_SECRET!)

  res.status(200).json({
    message: "User signin",
    token
  });
});


export default router;