import React, { useState, useEffect } from 'react';

type Props = {
  text: string;
};

export function AnimationMessage({ text }: Props) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(intervalId);
      }
    }, 5); // Adjust the interval to control the typing speed
    return () => clearInterval(intervalId);
  }, [text]);

  return <span className='text-lg'>{displayedText}</span>;
};

export default AnimationMessage;
