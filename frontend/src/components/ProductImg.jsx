import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images }) => {
    const [mainImg, setMainImg] = useState(images[0].url)
    return (
        <div className="flex items-center flex-col-reverse lg:flex-row gap-5">

            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
                {images.map((img) => (
                    <img
                        key={img.url}
                        src={img.url}
                        alt=""
                        onClick={() => setMainImg(img.url)}
                        className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 object-contain border rounded-md shadow-sm"
                    />
                ))}
            </div>

            <Zoom>
                <img
                    src={mainImg}
                    alt=""
                    className="w-full max-w-sm sm:max-w-md lg:max-w-lg border rounded-md shadow-lg object-contain"
                />
            </Zoom>
        </div>
    );

}

export default ProductImg