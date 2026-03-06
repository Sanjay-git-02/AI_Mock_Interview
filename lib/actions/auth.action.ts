"use server"

import {db, auth} from "@/firebase/server"
import {cookies} from "next/headers"

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const {uid, name, email} = params;

    try {
        const userRecord = await db.collection("users").doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists"
            }
        }

        await db.collection("users").doc(uid).set({
            name,
            email
        })

        return {
            success: true,
            message: "Account created successfully. Please sign in."
        }

    } catch (e: any) {
        console.log(e.message);

        return {
            success: false,
            message: "Failed to register account"
        }
    }
}


export async function signIn(params: SignInParams) {
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: "User does not exist. Create an account instead."
            }
        }

        await setSessionCookie(idToken);
        return {
            success: true,
            message: "Signed in successfully"
        }

    } catch (e: any) {
        console.error(e);

        return {
            success: false,
            message: "Failed to sign in into an account"
        }
    }
}


export async function setSessionCookie(idToken: string) {

    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax"
    });
}

export async function getCurrentUser(): Promise<User | null> {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userDoc = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();

        if (!userDoc.exists) return null;

        return {
            id: userDoc.id,
            ...userDoc.data(),
        } as User;

    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}