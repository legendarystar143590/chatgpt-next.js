import React, { useState, useEffect, MutableRefObject } from 'react';

type Props = {
  text: string,
  scrollRef: MutableRefObject<null>
};

export function AnimationMessage({ text, scrollRef }: Props) {
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

  useEffect(() => {
    // @ts-ignore
    scrollRef.current?.scrollIntoView(false);
  }, [displayedText])

  return <span className='text-lg'>{displayedText}</span>;
};

export default AnimationMessage;
