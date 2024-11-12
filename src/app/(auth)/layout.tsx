import Image from 'next/image'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen'>
            <section className='bg-brand p-10 hidden w-1/2 lg:flex xl:w-2/5 items-center justify-center'>
                <div className='flex flex-col items-center justify-center space-y-12 max-h-[800px] max-w-[430px]'>
                    <div className='flex w-[100%]'>
                        {/* <Image src={`/assets/icons/logo-brand.svg`} alt='logo' width={80} height={80} className='h-auto' /> */}
                        <h1 className='h1 text-white'>ArcStorage</h1>
                    </div>
                    <div className='space-y-5 text-white'>
                        <h1 className='h1'>
                            Manage your files the best way
                        </h1>
                        <p className='body-1'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum molestiae libero perspiciatis quaerat harum inventore fuga officiis.
                        </p>
                    </div>
                    <Image src={`/assets/images/files.png`} alt='files' width={300} height={300} className='transition-all hover:rotate-2 hover:scale-105' />
                </div>
            </section>
            <section className='flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0'>
                {children}
            </section>
        </div>
    )
}

export default Layout