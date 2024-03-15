// import Image from "next/image";
// import Link from "next/link";


// export default function Card() {
//     return (
//         <Link href={"/list"}>
//             <div className="flex bg-white mt-5 mx-5  h-16 rounded justify-between items-center" >
//                 <Image src="/folder.svg" width={64} height={64} alt="folder_img" />
//                 <p className="mr-5">jfiejaoifjewioa</p>
//             </div>
//         </Link>
//     );
// }


import React, { useRef, useEffect } from "react";
import './SwipeableList.css'
import Link from "next/link";
import Image from "next/image";

interface Props {
  name: string;
  fid: Number;
}

function SwipeableListItem({ name,fid }: Props) {
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

  const deleteFolder = async () => {
    try {
      const response = await fetch('/api/folder/delete', {
        method: 'POST',
        body: JSON.stringify({ id:fid}),
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
      const threshold = 0.5;
      if(listElementRef.current) {


        if (leftRef.current < listElementRef.current.offsetWidth * threshold * -1) {
          leftRef.current = -listElementRef.current.offsetWidth * 2;

          if (window.confirm("本当に削除しますか?")) {
            //confirm delete
            if(wrapperRef.current){
              wrapperRef.current.style.maxHeight = "0";
              console.log(fid)
              deleteFolder()
              
              
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
            <Link href={"/list/" + fid}>
              <div className="flex bg-white rounded h-16 justify-between items-center cursor-pointer ">
                <div className="ml-3">
                    <Image src="/folder.svg" width={64} height={64} alt="folder_img" />
                </div>
                <div className="mr-10">
                  <p className="text-black block">{name}</p>
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
