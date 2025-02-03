"use client";
import React, { useEffect, useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

const PassKeyModal = () => {
	const router = useRouter();
	const [open, setOpen] = useState(true);
	const path = usePathname();
	const [passkey, setPasskey] = useState("");
	const [error, setError] = useState("");

	const encryptedKey =
		typeof window !== "undefined"
			? window.localStorage.getItem("accessKey")
			: null;

	useEffect(() => {
		const accessKey = encryptedKey && decryptKey(encryptedKey);

		if (path)
			if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
				setOpen(false);
				router.push("/admin");
			} else {
				setOpen(true);
			}
	}, [encryptedKey]);

	const closeModal = () => {
		setOpen(false);
		router.push("/");
	};

	const validatePasskey = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
			const encryptedKey = encryptKey(passkey);

			localStorage.setItem("accessKey", encryptedKey);

			setOpen(false);
		} else {
			setError("Invalid passkey. Please try again");
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent className="shad-alert-dialog">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-white flex items-start justify-between">
						Admin Access Verification
						<Image
							src="/assets/icons/close.svg"
							alt="close"
							width={20}
							height={20}
							onClick={() => closeModal()}
							className="cursor-pointer"
						/>
					</AlertDialogTitle>
					<AlertDialogDescription className="text-white">
						To access the admin page, please enter the passkey.....
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="text-white">
					<InputOTP
						maxLength={6}
						value={passkey}
						onChange={(value) => setPasskey(value)}
					>
						<InputOTPGroup className="shad-otp">
							<InputOTPSlot index={0} className="shad-otp-slot" />
							<InputOTPSlot index={1} className="shad-otp-slot" />
							<InputOTPSlot index={2} className="shad-otp-slot" />
							<InputOTPSlot index={3} className="shad-otp-slot" />
							<InputOTPSlot index={4} className="shad-otp-slot" />
							<InputOTPSlot index={5} className="shad-otp-slot" />
						</InputOTPGroup>
					</InputOTP>
					{error && (
						<p className="shad-error flex justify-center text-14-regular mt-4">
							{error}
						</p>
					)}
				</div>
				<AlertDialogFooter>
					<AlertDialogAction
						className="text-white shad-primary-btn w-full"
						onClick={(e) => validatePasskey(e)}
					>
						Enter admin passkey
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PassKeyModal;
