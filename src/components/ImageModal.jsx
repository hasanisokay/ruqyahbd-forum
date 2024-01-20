'use client'
import Image from 'next/image';
import 'swiper/css';
import "swiper/css/effect-fade";
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { IoMdDownload } from "react-icons/io";
import handleDownloadImage from '@/utils/handleDownloadImage';
import { useEffect, useRef, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';

const ImageModal = ({ activeIndex, photosArray, setterFunction, alt }) => {
    const swiperRef = useRef(null);
    const [arrowOpacity, setArrowOpacity] = useState(1);
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'Escape':
                    setterFunction(false);
                    break;
                case 'ArrowUp':
                    swiperRef.current?.swiper.slidePrev();
                    break;
                case 'ArrowLeft':
                    swiperRef.current?.swiper.slidePrev();
                    break;
                case 'ArrowDown':
                    swiperRef.current?.swiper.slideNext();
                    break;
                case 'ArrowRight':
                    swiperRef.current?.swiper.slideNext();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setterFunction]);

    const handleSlideChange = () => {
        setTimeout(() => {
            setArrowOpacity(0);
        }, 2000);
    };

    const handleArrowHover = () => {
        setArrowOpacity(1);
    };

    const handleArrowLeave = () => {
        setTimeout(() => {
            setArrowOpacity(0);
        }, 3000);
    };

    return (
        <div>
            <dialog id="imageModal" className="modal">
                <div className="modal-box p-0 scrollforchat rounded-none max-h-[90vh] md:min-w-[50vw] sm:min-w-[70vw] min-w-[100vw] sm:min-h-[60vh] min-h-[50vh] md:min-h-[85vh] lg:min-h-[90vh] bg-gray-600">
                    <Swiper ref={swiperRef} initialSlide={activeIndex}
                        keyboard
                        pagination={{
                            type: 'fraction',
                        }}
                        onSlideChange={handleSlideChange}
                        onAfterInit={handleSlideChange}
                        modules={[Pagination]}

                    >
                        {photosArray?.map((url, index) => <SwiperSlide
                            key={index} >
                            <div className='relative max-h-[90vh]  md:min-w-[50vw] sm:min-w-[70vw] min-w-[100vw] min-h-[50vh] sm:min-h-[60vh] md:min-h-[85vh] lg:min-h-[90vh]'>
                                <div className='z-10 absolute top-2 right-2 bg-black bg-opacity-40 hover:bg-opacity-100' title='click to download this image'>
                                    <IoMdDownload onClick={() => handleDownloadImage(url)} className='w-4 h-6 cursor-pointer text-white hover:text-[#22C55E]'  />
                                    {/* <button  className="box-border  h-14  text-white relative group"><span className="">Download</span><span className="bg-sky-900 absolute right-0 top-0  h-full flex items-center justify-center px-1 group-hover:duration-300 group-hover:w-full w-10 duration-300"><svg viewBox="0 0 24 24" fill="none" className="inline mx-auto" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 3V16M12 16L16 11.625M12 16L8 11.625" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg></span></button> */}
                                </div>
                                <Image
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, (max-width: 1200px) 100vw, 33vw"
                                    fill
                                    className='w-full h-full'
                                    priority={true}
                                    quality={100}
                                    src={url}
                                    alt={alt || `Image ${index + 1}`}
                                />
                                <div onMouseLeave={handleArrowLeave} onMouseEnter={handleArrowHover} className={`${index === 0 && 'hidden lg:hidden'} absolute lg:block hidden top-1/2 left-0  cursor-pointer`} onClick={() => swiperRef.current?.swiper.slidePrev()}>
                                    <FaArrowLeft style={{ opacity: arrowOpacity }} className='duration-1000 mix-blend-difference text-white w-6 h-6' />
                                </div>
                                <div onMouseLeave={handleArrowLeave} onMouseEnter={handleArrowHover} className={`${(index === photosArray.length - 1 || photosArray?.length === 0) && 'hidden lg:hidden'} cursor-pointer absolute lg:block hidden top-1/2 right-0 `} onClick={() => swiperRef?.current?.swiper.slideNext()}>
                                    <FaArrowRight style={{ opacity: arrowOpacity }} className='duration-1000 mix-blend-difference text-white w-6 h-6' />
                                </div>
                            </div>
                        </SwiperSlide>)}
                    </Swiper>
                </div>
                <form method="dialog" className="modal-backdrop cursor-default">
                    <button className='cursor-default' onClick={() => setterFunction(false)}></button>
                </form>
            </dialog>
        </div>
    );
};

export default ImageModal;