'use server'

import { InputFile } from "node-appwrite/file";
import { createAdminClient } from "../appwrite";
import { ID, Storage } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { constructFileUrl, getFileType, parseStringfy } from "../utils";
import { revalidatePath } from "next/cache";

const handleError = (error: unknown, message: string) => {
    console.log('error ====>>> ', error)
    console.log('message ====>>> ', message)
    throw error
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