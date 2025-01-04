"use server";

import { ID, Query } from "node-appwrite";

import {
	BUCKET_ID,
	DATABASE_ID,
	ENDPOINT,
	PATIENT_COLLECTION_ID,
	PROJECT_ID,
	databases,
	storage,
	users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
	try {
		// Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
		const newuser = await users.create(
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);
		return parseStringify(newuser);
	} catch (error: unknown) {
		// Type guard to check if error has a 'code' property
		if (error && typeof error === "object" && "code" in error) {
			const errorWithCode = error as { code: number }; // Narrow down the type
			if (errorWithCode.code === 409) {
				const existingUser = await users.list([
					Query.equal("email", [user.email]),
				]);
				return existingUser.users[0];
			}
		}
		console.error("An error occurred while creating a new user:", error);
	}
};

// GET USER
export const getUser = async (userId: string) => {
	try {
		const user = await users.get(userId);

		return parseStringify(user);
	} catch (error) {
		console.error(
			"An error occurred while retrieving the user details:",
			error
		);
	}
};

// REGISTER PATIENT
export const registerPatient = async ({
	identificationDocument,
	...patient
}: RegisterUserParams) => {
	try {
		// Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
		let file;
		if (identificationDocument) {
			const blobFile = identificationDocument?.get("blobFile") as Blob;
			const fileName = identificationDocument?.get("fileName") as string;
		
			// Use the standard File object
			const inputFile = new File([blobFile], fileName);
		
			// Upload the file using Appwrite's storage API
			file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
		}
		
	
		// Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
		const newPatient = await databases.createDocument(
			DATABASE_ID!,
			PATIENT_COLLECTION_ID!,
			ID.unique(),
			{
				identificationDocumentId: file?.$id ? file.$id : null,
				identificationDocumentUrl: file?.$id
					? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
					: null,
				...patient,
			}
		);

		return parseStringify(newPatient);
	} catch (error) {
		console.error("An error occurred while creating a new patient:", error);
	}
};

// GET PATIENT
export const getPatient = async (userId: string) => {
	try {
		const patients = await databases.listDocuments(
			DATABASE_ID!,
			PATIENT_COLLECTION_ID!,
			[Query.equal("userId", [userId])]
		);

		return parseStringify(patients.documents[0]);
	} catch (error) {
		console.error(
			"An error occurred while retrieving the patient details:",
			error
		);
	}
};
