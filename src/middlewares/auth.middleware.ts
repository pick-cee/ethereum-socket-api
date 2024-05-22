import express, { NextFunction } from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { User } from '../entity'
dotenv.config()

// This was put into this file due to some issues with my TypeScript Compiler.
declare global {
    namespace Express {
        interface Request {
            user: any
        }
    }
}

// A middleware function to verify and validate the jwt token passed before
// allowing a user perform a request
export async function verifyToken(
    request: express.Request,
    response: express.Response,
    next: NextFunction
) {
    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith("Bearer")
    ) {
        try {
            const token = request.headers.authorization.split(" ")[1]
            jwt.verify(token, `${process.env.JWT_SECRET}`, async (error: any, user: any) => {
                if (error) return response.status(403).json({ message: 'Invalid bearer token' })
                const userExists = await User.find(user.userId)
                if (userExists) {
                    request.user = user
                    next()
                }
                else {
                    return response.status(401).json({ message: 'Please sign up' })
                }
            })
        }
        catch (err: any) {
            console.log(err);
            return response.status(500).json({
                err: err,
            });
        }
    }
    else {
        return response.status(401).json({ message: "You are not authenticated!" })
    }
}