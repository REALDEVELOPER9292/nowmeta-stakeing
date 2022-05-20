import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { Collection } from 'constants/image-constant';
import './index.css';

const CollectionSwiper = () => {

    const { Collection1 } = Collection;
    const style = {
        marginTop: "0px"
    }

    return (
        <Carousel infiniteLoop width={"500px"} showThumbs={false} style={style} autoPlay interval={3000} labels={false} showStatus={false}>
            <div>
                <img alt='Collection' className='collection-item' src={Collection1} />
            </div>
            <div>
                <img alt='Collection' src={Collection1} />
            </div>
            <div>
                <img alt='Collection' src={Collection1} />
            </div>
        </Carousel>
    );
}

export default CollectionSwiper;