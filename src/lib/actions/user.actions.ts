"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringfy } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholder } from "@/constants";
import { redirect } from "next/navigation";

// Helper function

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('email', [email])]
    );

    // console.log("result for user =====>>>>> ", result)

    return result.total > 0 ? result.documents[0] : null;
}

const handleError = (error: unknown, message: string) => {
    console.log('error ====>>> ', error)
    console.log('message ====>>> ', message)
    throw error
}

export const sendEmailOtp = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);
        // console.log("session ====>>>>", session)
        // console.log("session userId ====>>>>", session.userId)
        return session.userId
    } catch (error) {
        handleError(error, 'Failed to send an email OTP')
    }
}

// main server actions

export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {

    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOtp({ email });

    if (!accountId) throw new Error('Failed to send an OTP');

    if (!existingUser) {
        const { databases } = await createAdminClient();

        const data = {
            fullName,
            email,
            avatar: avatarPlaceholder,
            accountId
        }

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            data
        )
    }

    return parseStringfy({ accountId });
}

export const verifyOtp = async ({ accountId, password }: { accountId: string, password: string }) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: `/`,
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        return parseStringfy({ sessionId: session.$id })

    } catch (error) {
        console.log("Failed to verify OTP", error)
    }
}

export const getCurrentUser = async () => {
    try {
        const { databases, account } = await createSessionClient();
        // console.log(account)
        const result = await account.get();
        // console.log(result)

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", result.$id)]
        )
        // console.log("user ===>>>> ", user);

        if (user.total <= 0) return null;

        return parseStringfy(user.documents[0])
    } catch (error) {
        console.log(error)
    }
}

export const signOutUser = async () => {
    const { account } = await createSessionClient();
    try {
        await account.deleteSession('current');
        (await cookies()).delete("appwrite-session");
        console.log('User logged out successfully');
    } catch (error) {
        handleError(error, "Failed to signOut")
        console.error('Error logging out:', error);
    } finally {
        redirect('/sign-in');
    }
}

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            await sendEmailOtp({ email });
            return parseStringfy({ accountId: existingUser.accountId });
        }

        return parseStringfy({ accountId: null, error: "User Not Found" })

    } catch (error) {
        handleError(error, "Failed to signIn user")
    }
}