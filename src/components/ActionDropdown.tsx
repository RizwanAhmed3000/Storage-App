"use client"
import React, { useState } from 'react'
import {
    Dialog
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { Models } from 'node-appwrite';
import { actionsDropdownItems } from '@/constants';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';



const ActionDropdown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [action, setAction] = useState<ActionType | null>(null);
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger className='shad-no-focus'>
                    <Image src={`/assets/icons/dots.svg`} alt='dots' width={30} height={30} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className='max-w-[200px] truncate'>
                        {file.name}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        actionsDropdownItems.map((action) => (
                            <DropdownMenuItem key={action.value} className='shad-dropdown-item'
                                onClick={() => {
                                    setAction(action);
                                    if (['rename', 'share', 'delete', 'details'].includes(action.value)) {
                                        setIsModalOpen(true)
                                    }
                                }}>
                                {
                                    action.value === 'download' ? (
                                        <Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className='flex items-center gap-2'>
                                            <Image src={action.icon} alt={action.label} width={30} height={30} />
                                            {action.label}
                                        </Link>
                                    ) : (
                                        <div className='flex items-center gap-2'>
                                            <Image src={action.icon} alt={action.label} width={30} height={30} />
                                            {action.label}
                                        </div>
                                    )
                                }
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>

    )
}

export default ActionDropdown