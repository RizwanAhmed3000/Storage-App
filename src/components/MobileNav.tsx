"use client"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { avatarPlaceholder, navItems } from "@/constants";
import Image from "next/image"
import { usePathname } from "next/navigation";
import { useState } from "react"
import { Separator } from "./ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
    fullName: string;
    email: string;
    avatar: string;
    $id: string;
    accountId: string;
}

const MobileNav = ({ fullName, email, avatar, $id: ownerId, accountId }: Props) => {

    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="mobile-header justify-end">

            {/* <Image src={`/assets/icons/logo-full-brand.svg`} alt="logo" width={100} height={50} className="h-auto"/> */}

            <h1 className="h2 text-brand">ArcStorage</h1>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger>
                    <Image src={`/assets/icons/menu.svg`} alt="menu" width={30} height={30} />
                </SheetTrigger>
                <SheetContent className="shad-sheet h-screen px-3">
                    <SheetTitle>
                        <div className="header-user">
                            <Image src={avatar || avatarPlaceholder} alt="avatar" width={40} height={40} className="header-user-avatar" />
                            <div className="sm:hidden lg:block">
                                <p className="subtitle-2 capitalize">{fullName}</p>
                                <p className="caption">{email}</p>
                            </div>
                        </div>
                        <Separator className="mb-4 bg-light-200/20" />
                    </SheetTitle>

                    <nav className="mobile-nav">
                        <ul className="mobile-nav-list">
                            {navItems.map(({ url, name, icon }) => {
                                return (
                                    <Link key={name} href={url} className='lg:w-full'>
                                        <li className={cn("mobile-nav-item", (pathname === url) && "shad-active")}>
                                            <Image src={icon} alt='name' width={24} height={24} className={cn("nav-icon", (pathname === url) && "nav-icon-active")} />
                                            <p>{name}</p>
                                        </li>
                                    </Link>
                                )
                            })}
                        </ul>
                    </nav>

                    <Separator className="my-5 bg-light-200/20" />

                    <div className="flex flex-col justify-between gap-5 pb-5">
                        <FileUploader ownerId={ownerId} accountId={accountId} />
                        <Button type='submit' className='mobile-sign-out-button' onClick={async () => await signOutUser()}>
                            <Image src={`/assets/icons/logout.svg`} alt='logo' width={24} height={24} />
                            <p>Logout</p>
                        </Button>
                    </div>

                </SheetContent>
            </Sheet>

        </header>
    )
}

export default MobileNav