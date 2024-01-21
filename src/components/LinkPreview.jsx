'use client'
import getFirstClickableLink from "@/utils/getFirstClickableLink";
import getMetaData from "@/utils/getMetaData";
import Link from "next/link";
import { useEffect, useState } from "react";

const LinkPreview = ({ text }) => {
    const [previewData, setPreviewData] = useState(null)
    const [link, setLink] = useState('');
    
    const fetchData = async () => {
        const data = await getFirstClickableLink(text);
        if (!data) return
        else {
            setLink(data);
            const metadata = await getMetaData(data)
            if (metadata) {
                setPreviewData(metadata);
            }
            else{
                setPreviewData(null)
            }
        }
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])
    
    if (previewData?.title?.length > 0) return (
        <Link href={link} target="_blank">
            <div className="flex h-max min-h-[100px] max-h-[250px] bg-base-200 before:block before:bg-gray-500 before:content-normal">
                <div className="w-[150px] min-h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: previewData?.image ? `url(${previewData?.image})` : 'none' }}>
                </div>
                <div className="w-full h-full flex flex-col justify-center  py-2 pl-2">
                    <h3 className="font-semibold text-[12px] mb-2">
                        {previewData?.title?.length > 100
                            ? `${previewData?.title?.slice(0, 100)}...`
                            : previewData?.title}
                    </h3>
                    <p className=" text-[10px] font-light">
                        {previewData?.description?.length > 100
                            ? `${previewData?.description?.slice(0, 100)}...`
                            : previewData?.description}
                    </p>
                </div>
            </div>
        </Link>

    );
};

export default LinkPreview;
