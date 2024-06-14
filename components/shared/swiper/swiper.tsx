import { ReactNode } from "react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FreeMode, Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/react'

interface SwiperCustomProps {
    children: ReactNode;
}

export default function SwiperCustom({ children }: SwiperCustomProps) {
    return (
        <div className='w-full'>
            <Swiper
                breakpoints={{
                    320: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    700: {
                        slidesPerView: 4,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 15,
                    },
                }}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className="max-w-screen lg:max-w-screen h-full"
            >
                {children}
            </Swiper>
        </div>
    )
}
