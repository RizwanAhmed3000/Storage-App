import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"
import React from 'react'

export const dynamic = "force-dynamic"

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();

    if (!currentUser) return redirect(`/sign-in`)

    // console.log(currentUser)

    return (
        <main className='flex h-screen'>
            <Sidebar {...currentUser} />
            <section className='flex flex-col flex-1 h-full'>
                <MobileNav {...currentUser} />
                <Header userId={currentUser.$id} accountId={currentUser.accountId} />
                <div className="main-content">
                    {children}
                </div>
            </section>
            <Toaster />
        </main>
    )
}

export default Layout