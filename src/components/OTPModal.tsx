"use client";
import React, { useState } from 'react'
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
import Image from 'next/image';
import { Button } from './ui/button';
import { verifyOtp, sendEmailOtp } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

const OTPModal = ({ accountId, email }: { accountId: string, email: string }) => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true)
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const sessionId = await verifyOtp({ accountId, password })
            if (sessionId) router.push(`/`)
        } catch (error) {
            console.log("Failed to verify OTP", error)
        }

        setIsLoading(false);
    }

    const resendHandler = async () => {
        await sendEmailOtp({ email })
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='shad-alert-dialog'>
                <AlertDialogHeader className='relative flex justify-center'>
                    <AlertDialogTitle className='h2 text-center'>
                        Enter your OTP
                        <Image src={`/assets/icons/close-dark.svg`} alt='close' width={20} height={20} className='otp-close-button' onClick={() => setIsOpen(false)} />
                    </AlertDialogTitle>
                    <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
                        We&apos;ve send the OTP on <span className='text-brand pl-1'>{email}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <InputOTP maxLength={6} value={password} onChange={setPassword}>
                    <InputOTPGroup className='shad-otp'>
                        <InputOTPSlot index={0} className='shad-otp-slot' />
                        <InputOTPSlot index={1} className='shad-otp-slot' />
                        <InputOTPSlot index={2} className='shad-otp-slot' />
                        <InputOTPSlot index={3} className='shad-otp-slot' />
                        <InputOTPSlot index={4} className='shad-otp-slot' />
                        <InputOTPSlot index={5} className='shad-otp-slot' />
                    </InputOTPGroup>
                </InputOTP>


                <AlertDialogFooter>
                    <div className='flex w-full flex-col gap-4'>
                        <AlertDialogAction onClick={submitHandler} className='shad-submit-btn h-12' type='button' disabled={isLoading}>
                            Submit
                            {
                                isLoading && <Image src={`/assets/icons/loader.svg`} alt="loader" width={24} height={24} className="animate-spin ml-2" />
                            }
                        </AlertDialogAction>
                        <div className='subtitle-2 mt-2 text-center text-light-100'>
                            Didn&apos;t get the OTP
                            <Button type='button' variant={"link"} className='pl-1 text-brand' onClick={resendHandler}>
                                Click to Resend
                            </Button>
                        </div>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default OTPModal