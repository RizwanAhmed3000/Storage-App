'use server'

import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite";
import { ID, Models, Query, Storage } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
    console.log('error ====>>> ', error)
    console.log('message ====>>> ', message)
    throw error
}

const createQueries = (currentUser: Models.Document) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email]),
        ])
    ]

    // TODO: search, sort, limits...

    return queries;
}


export const uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();
    try {
        const inputFile = InputFile.fromBuffer(file, file.name)
        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile
        )

        // console.log("Input File ===>>>> ", inputFile)
        // console.log("bucketFile File ===>>>> ", bucketFile)

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id
        }

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument
        )
            .catch(async (error: unknown) => {
                await storage.deleteFile(
                    appwriteConfig.bucketId,
                    bucketFile.$id
                )
                handleError(error, "Failed to create file document")
            })
        revalidatePath(path);
        // console.log("newFile ====>>>> ", newFile)
        return parseStringfy(newFile);
    } catch (error) {
        handleError(error, "Failed to upload file")
    }
}

export const getFiles = async () => {
    const { databases } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error("No user found");

        const queries = createQueries(currentUser);

        // console.log("queries ===>>> ", {currentUser, queries})

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        )

        // console.log("files ==>> ", files)

        return parseStringfy(files);

    } catch (error) {
        handleError(error, "Failed to get the files")
    }
}

export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {
    const { databases } = await createAdminClient();
    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName
            }
        );
        revalidatePath(path);
        return parseStringfy(updatedFile);
    } catch (error) {
        handleError(error, "Failed to rename the file")
    }
}

export const updateFileUsers = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
    const { databases } = await createAdminClient();
    try {
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails
            }
        );
        revalidatePath(path);
        return parseStringfy(updatedFile);
    } catch (error) {
        handleError(error, "Failed to add the users")
    }
}

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
    const { databases, storage } = await createAdminClient();
    try {
        const deleteFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId
        );
        if (deleteFile) {
            await storage.deleteFile(
                appwriteConfig.bucketId,
                bucketFileId
            )
        }
        revalidatePath(path);
        return parseStringfy({ status: 'Success' });
    } catch (error) {
        handleError(error, "Failed to delete the file")
    }
}