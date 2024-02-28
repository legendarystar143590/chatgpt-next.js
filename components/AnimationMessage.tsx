import React, { useState, useEffect, RefObject } from 'react';
import parse from 'html-react-parser';

type Props = {
  text: string,
  image: string,
  closer?: string
  scrollRef: RefObject<HTMLDivElement>
};

export function AnimationMessage({ text, image, scrollRef, closer }: Props) {
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
        parse(displayedText)
      }
      {
        closer && showCloser && (
          <>
            <br />
            <p>{closer}</p>
          </>
        )
      }
      {image && (
        <img className="rounded-xl py-2" src={image} alt="Image" />
      )}
    </span>
  )
};

export default AnimationMessage;
