import React, { useRef, useEffect } from "react";
import './SwipeableList.css'
import Link from "next/link";
import Image from "next/image";

interface Props {
  wordEN: string
  wordJP: string
  wid: Number
  isShow: boolean
}

function SwipeableListItem({ wordEN,wordJP,wid,isShow }:Props) {
  const listElementRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef(null);

  const dragStartXRef = useRef(0);
  const leftRef = useRef(0);
  const draggedRef = useRef(false);

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  });

  function onDragStartMouse(evt:React.MouseEvent<HTMLDivElement>) {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onDragStartTouch(evt:React.TouchEvent<HTMLDivElement>) {
    console.log(evt.targetTouches);
    console.log(evt.targetTouches[0]);
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  }

  function onDragStart(clientX:number) {
    draggedRef.current = true;
    dragStartXRef.current = clientX;
    if(listElementRef.current) {
      listElementRef.current.className = "ListItem";
    }

    requestAnimationFrame(updatePosition);
  }

  function updatePosition() {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }
    if(listElementRef.current) {
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  }

  function onMouseMove(evt:MouseEvent) {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onTouchMove(evt:TouchEvent) {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onDragEndMouse(evt:MouseEvent) {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  }

  function onDragEndTouch(evt:TouchEvent) {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  }

  const deleteWord = async () => {
    try {
      const response = await fetch('/api/word/delete', {
        method: 'POST',
        body: JSON.stringify({ id:wid}),
      })
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function onDragEnd() {
    if (draggedRef.current) {
      draggedRef.current = false;
      const threshold = 0.3;
      if(listElementRef.current) {


        if (leftRef.current < listElementRef.current.offsetWidth * threshold * -1) {
          leftRef.current = -listElementRef.current.offsetWidth * 2;

          if (window.confirm("本当に削除しますか?")) {
            //confirm delete
            if(wrapperRef.current){
              wrapperRef.current.style.maxHeight = "0";
              deleteWord()
            }
          } else {
            leftRef.current = 0;
          }
        } else {
          leftRef.current = 0;
        }
        
        listElementRef.current.className = "BouncingListItem";
        listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
      }
    }
  }

  // const Speech = (event:React.MouseEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   event.stopPropagation();    
  //   const msg = new SpeechSynthesisUtterance(wordEN);
  //   console.log("start speach")
  //   const voices = window.speechSynthesis.getVoices();

  //   msg.lang = 'en-US';
  //   msg.voice = voices[0]; // 7:Google 日本人 ja-JP ※他は英語のみ（次項参照）
  //   speechSynthesis.speak(msg)
  // }
  const Speech = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  
    // 進行中の発話をキャンセル
    window.speechSynthesis.cancel();
  
    // 新しい発話を作成
    const msg = new SpeechSynthesisUtterance(wordEN);
  
    // 利用可能な音声リストから英語の音声を選択
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang === 'en-US');
    if (englishVoices.length > 0) {
      msg.voice = englishVoices[0]; // 英語の音声を選択
    } else {
      console.log("No English voice found");
    }
  
    // 発話を開始
    window.speechSynthesis.speak(msg);
  };
  
 

  return (
    <>
      <div className="mt-3 relative transition-all duration-500 ease-in-out max-h-[1000px] overflow-hidden w-full cursor-pointer text-18" ref={wrapperRef}>
        <div className=" rounded absolute inset-0 z-[-1] bg-red-600 flex justify-end items-center  pr-4" ref={backgroundRef}>
          <span>delete</span>
        </div>
        <div
          className="flex w-full items-center bg-[var(--navy)] text-black transition-transform duration-500 ease-out"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
        >
          <div className=" text-left w-full h-16 shadow">
            <Link href={"https://ejje.weblio.jp/content/" + wordEN}>
              <div className="flex bg-white rounded h-16 justify-between items-center cursor-pointer ">
                <div className="ml-3">
                  <svg className="w-10 h-10 ms-1 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-black block">{wordEN}</p>
                  {isShow &&
                    <p  className="text-black block">{wordJP}</p>
                  }
                </div>
                <div className="mr-3 z-10" onClick={Speech}>
                  <Image src="/speaker.png" width={64} height={64} alt="speaker_img" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SwipeableListItem;
