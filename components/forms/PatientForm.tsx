"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormfield, { FormFieldType } from "../CustomFormfield";
import "react-phone-number-input/style.css";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";

const PatientForm = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter()
	// 1. Define your form.
	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit({
		name,
		email,
		phone,
	}: z.infer<typeof UserFormValidation>) {
		setIsLoading(true);

		try {
			const userData = { name, email, phone };
			const user = await createUser(userData)
			if(user) router.push(`/patients/${user.$id}/register`)
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
				<section className="mb-12 space-y-4">
					<h1 className="header">
						Hi there <span className="waving-hand">👋</span>
					</h1>
					<p className="text-dark-700">Get started with appointments.</p>
				</section>
				<CustomFormfield
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="name"
					label="Full name"
					placeholder="Sunday Ransom"
					iconSrc="/assets/icons/user.svg"
					iconAlt="user"
				/>
				<CustomFormfield
					fieldType={FormFieldType.INPUT}
					control={form.control}
					name="email"
					label="Email"
					placeholder="sundayyoung@gmail.com"
					iconSrc="/assets/icons/email.svg"
					iconAlt="email"
				/>
				<CustomFormfield
					fieldType={FormFieldType.PHONE_INPUT}
					control={form.control}
					name="phone"
					label="Phone number"
					placeholder="(555) 123-4567"
				/>
				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default PatientForm;
