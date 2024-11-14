"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringfy } from "../utils";

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

const sendEmailOtp = async ({ email }: { email: string }) => {
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
            avatar: 'https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=',
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