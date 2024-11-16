import Header from '@/components/Header'
import MobileNav from '@/components/MobileNav'
import Sidebar from '@/components/Sidebar'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className='flex h-screen'>
            <Sidebar />
            <section className='flex flex-col flex-1 h-full'>
                <MobileNav />
                <Header />
                <div className="main-content">
                    {children}
                </div>
            </section>
        </main>
    )
}

export default Layout