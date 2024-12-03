import FileCard from '@/components/FileCard';
import Sort from '@/components/Sort';
import { getFiles, totalSpaceUsed } from '@/lib/actions/file.actions';
import { convertFileSize, getFileTypesParams, getUsageSummary } from '@/lib/utils';
import { Models } from 'node-appwrite';
import React from 'react'

const page = async ({ searchParams, params }: SearchParamProps) => {
    const type = ((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";

    const types = getFileTypesParams(type) as FileType[];
    // console.log(types)
    // console.log("type ==>> ", type)

    const [files, totalSpace] = await Promise.all([
        getFiles({ types, searchText, sort }),
        totalSpaceUsed(),
    ]);
    // console.log(totalSpace)
    const usageSummary = getUsageSummary(totalSpace);
    // console.log(usageSummary)
    const typeSize = usageSummary.filter((item) => {
        const title = item.title.toLowerCase();
        return type === title
    })

    return (
        <div className='page-container'>
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>
                <div className="total-size-section">
                    <p className='body-1'>
                        Total: <span className='h5'>{convertFileSize(typeSize[0].size)}</span>
                    </p>
                    <div className="sort-container">
                        <p className="body-1 hidden sm:block text-light-200">
                            Sort by:
                        </p>
                        <Sort />
                    </div>
                </div>
            </section>

            {/* Render the files */}

            {files.total > 0 ? (
                <section className='file-list'>
                    {
                        files.documents.map((file: Models.Document) => (
                            <FileCard key={file.$id} file={file} />
                        ))
                    }
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    )
}

export default page