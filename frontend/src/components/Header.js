import React, { useEffect } from 'react';
import image1 from '../images/left.jpg';
import image2 from '../images/right.png';

const Header = () => {
  useEffect(() => {
    getElements();
  }, []);
  let handle;
  let leftLayer;
  const getElements = () => {
    handle = document.querySelector('.handle');
    leftLayer = document.querySelector('.left');
  };
  // let handle = document.querySelector('.handle');
  // let leftLayer = document.querySelector('.left');
  let delta = 0;
  let skew = 1000;

  const mouseMove = (e) => {
    delta = (e.clientX - window.innerWidth / 2) * 0.5;
    if (leftLayer) {
      handle.style.left = e.clientX + delta + 'px';
      leftLayer.style.width = e.clientX + skew + delta + 'px';
    }
  };
  return (
    <div className='header-container skewed' onMouseMove={mouseMove}>
      <div className='layer left'>
        <div className='content-wrap'>
          <img src={image1} alt='' />
        </div>
      </div>
      <div className='layer right'>
        <div className='content-wrap'>
          <img src={image2} alt='' />
        </div>
      </div>

      <div className='title'>
        Colorize pictures with AI, turn black and white photos to color in
        seconds.
      </div>

      <div className='handle'></div>
    </div>
  );
};

export default Header;
