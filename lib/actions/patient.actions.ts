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
		// Attempt to create a new user
		const newUser = await users.create(
			ID.unique(),
			user.email,
			user.phone,
			undefined,
			user.name
		);
		return parseStringify(newUser);
	} catch (error: unknown) {
		if (error && typeof error === "object" && "code" in error) {
			const errorWithCode = error as { code: number; message: string };
			
			// Handle email conflict (code 409)
			if (errorWithCode.code === 409) {
				console.warn(`Email conflict: ${errorWithCode.message}`);
				
				// Retrieve existing user by email
				const existingUserResponse = await users.list([
					Query.equal("email", [user.email]),
				]);
				
				const existingUser = existingUserResponse.users[0];
				
				// Return existing user details
				return existingUser;
			}
		}
		
		// Log other errors
		console.error("An error occurred while creating a new user:", error);
		throw error; // Optionally rethrow for further handling
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
