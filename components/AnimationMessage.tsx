import React, { useState, useEffect, RefObject } from 'react';
import parse from 'html-react-parser';

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
        parse(displayedText.replaceAll(/\n(\d\.\s)/g, '<br />$1 '))
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
