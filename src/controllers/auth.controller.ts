import { Request, Response } from "express";
import { User } from "../entity";
import * as argon from 'argon2'
import jwt from 'jsonwebtoken'


// register a new merchant or user
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const userExists = await User.findOne({ where: { username } })
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' })
        }
        const hashedPassword = await argon.hash(password)

        const newUser = User.create({
            username: username,
            password: hashedPassword
        })
        await newUser.save()
        return res.status(201).json({
            message: 'User registered successfully',
            newUser
        })
    }
    catch (error: any) {
        return res.status(500).json({
            message: error.mesage
        })
    }
}

//login a merchant or user
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        //check if user exists
        const user = await User.findOne({ where: { username } })
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        //check if password is correct
        const isPasswordvalid = await argon.verify(user.password, password)
        if (!isPasswordvalid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            })
        }

        //generate the JWT token on successful verification
        const payload = {
            userId: user.userId,
            username: user.username
        }
        const token = jwt.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: '30m' })

        return res.status(200).json({
            message: 'Log in successful',
            access_token: token
        })
    }
    catch (error: any) {

    }
}