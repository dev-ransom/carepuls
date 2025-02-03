"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";
import AppointmentForm from "./forms/AppointmentForm";

export const AppointmentModal = ({
	patientId,
	userId,
	appointment,
	type,
}: {
	patientId: string;
	userId: string;
	appointment?: Appointment;
	type: "schedule" | "cancel";
	title: string;
	description: string;
}) => {
	const [open, setOpen] = useState(false);

	const isCancelled =
		type === "cancel" && appointment?.status?.toLowerCase() === "cancelled";

 const isScheduled = type === "schedule" && appointment?.status?.toLowerCase() === "scheduled";
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className={`capitalize ${
						type === "schedule" ? "text-green-500" : ""
					} ${isCancelled || isScheduled ? "cursor-not-allowed opacity-50" : ""}`}
					disabled={isCancelled}
				>
					{type}
				</Button>
			</DialogTrigger>
			<DialogContent className="shad-dialog sm:max-w-md overflow-y-auto max-h-[500px] no-scrollbar">
				<DialogHeader className="mb-4 space-y-3">
					<DialogTitle className="capitalize text-white">
						{type} Appointment
					</DialogTitle>
					<DialogDescription className="text-white">
						Please fill in the following details to {type} appointment
					</DialogDescription>
				</DialogHeader>

				<AppointmentForm
					userId={userId}
					patientId={patientId}
					type={type}
					appointment={appointment}
					setOpen={setOpen}
				/>
			</DialogContent>
		</Dialog>
	);
};
