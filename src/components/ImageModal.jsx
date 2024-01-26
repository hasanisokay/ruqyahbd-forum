'use client'
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import handleDownloadImage from '@/utils/handleDownloadImage';
import { useEffect, useRef, useState } from 'react';
import { Pagination } from 'swiper/modules';
import ArrowLeftIcon from './SVG/ArrowLeftIcon';
import ArrowRightIcon from './SVG/ArrowRightIcon';
import DownloadIcon from './SVG/DownloadIcon';

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
                <div className="modal-box p-0 rounded-none max-h-[90vh] md:min-w-[50vw] sm:min-w-[70vw] min-w-[100vw] sm:min-h-[60vh] min-h-[50vh] md:min-h-[85vh] lg:min-h-[90vh] bg-gray-600">
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
                                    <DownloadIcon handleOnClick={() => handleDownloadImage(url)} />
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
                                <ArrowLeftIcon styles={{ opacity: arrowOpacity }} classes={"duration-1000 mix-blend-difference text-white"}/>
                                </div>
                                <div onMouseLeave={handleArrowLeave} onMouseEnter={handleArrowHover} className={`${(index === photosArray.length - 1 || photosArray?.length === 0) && 'hidden lg:hidden'} cursor-pointer absolute lg:block hidden top-1/2 right-0 `} onClick={() => swiperRef?.current?.swiper.slideNext()}>
                                <ArrowRightIcon styles={{ opacity: arrowOpacity }} classes={"duration-1000 mix-blend-difference text-white"}/>
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