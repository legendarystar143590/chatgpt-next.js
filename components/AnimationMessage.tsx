import React, { useState, useEffect, RefObject } from 'react';

type Props = {
  text: string,
  closer?: string
  scrollRef: RefObject<HTMLDivElement>
};

export function AnimationMessage({ text, scrollRef, closer }: Props) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCloser, setShowCloser] = useState(false);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, index));

      index++;
      if (index > text.length) {
        clearInterval(intervalId);
        setShowCloser(true);
      }
    }, 5); // Adjust the interval to control the typing speed
    return () => clearInterval(intervalId);
  }, [text]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView(false);
  }, [displayedText])

  return (
    <span className='text-lg'>
      {
        displayedText.replaceAll(/^\w{2}\b(\d+)\.\s/g, '<br>$1. ').split('<br>').map(
          (one, index) => (
            <span key={index}>
              {one}
              <br />
            </span>
          )
        )
      }
      {
        closer && showCloser && (
          <>
            <br />
            <p>{closer}</p>
          </>
        )
      }
    </span>
  )
};

export default AnimationMessage;
