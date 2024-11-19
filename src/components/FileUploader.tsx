'use client'
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { cn, getFileType } from '@/lib/utils';
import Image from 'next/image';

interface Props {
    className?: string;
    ownerId: string;
    accountId: string
}

const FileUploader = ({ className, ownerId, accountId }: Props) => {
    const [files, setFiles] = useState<File[]>([])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // Do something with the files
        setFiles(acceptedFiles)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} className='cursor-pointer'>
            <input {...getInputProps()} />
            <Button className={cn('uploader-button', className)}>
                <Image src={`/assets/icons/upload.svg`} alt='upload' width={24} height={24} />
                <p>Upload</p>
            </Button>
            {
                files.length > 0 && (
                    <ul className='uploader-preview-list'>
                        <h4 className='h4 text-light-100'>Uploading</h4>
                        {
                            files.map((file, index) => {
                                const { type, extension } = getFileType(file.name)

                                return (
                                    <li className='uploader-preview-item' key={`${file.name}-${index}`}>
                                        test
                                    </li>
                                )
                            })
                        }
                    </ul>
                )
            }
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default FileUploader