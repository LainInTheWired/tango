'use client'
import Menubar from "@/components/menubar";
import { useState,useEffect } from "react";
import SwipeableListItem from "@/components/wordCard";
import Link from "next/link";
import { usePathname,useSearchParams } from 'next/navigation'

interface Word {
    id: number
    Folder: number;
    WordEN: string
    WordJP: string
    star: boolean
    createAt: Date
  }

export default function Home() {
  const [words,setWords] = useState<Word[]>([])
  const [isShow,setIsShow] = useState<boolean>(true)
  const searchParams = useSearchParams()
  const path =  usePathname()
  const fid = Number(path.split("/").slice(-1)[0])

  const changeShow = () => {
    setIsShow(!isShow)
  }

  const getFolders = async () => {
    try {
      const response = await fetch('/api/word/get', {
        method: 'POST',
        body: JSON.stringify({ folder:fid}),
      })
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data)
      setWords(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getFolders()
  },[])

  


  return (
  <main >
      <Menubar
          secondButtonClickFuc={changeShow}
          secondButtonName="表示設定"
          menuName="名前"
          firstButtonClickFuc={() => history.back()}
          istwoButton={true}
          firstButtonName="戻る"
      />
      {/* <WordCard rows={Cardstate} onDelete={onDelete}>

      </WordCard> */}
      <div className="pt-16 pb-36	">
        <div className="List">
        {words.map((item) => (
          <SwipeableListItem key={item.id} wid={item.id} wordJP={item.WordJP} wordEN={item.WordEN} isShow={isShow}></SwipeableListItem>
        ))}
      </div>
        <Link href={"/list/"+fid+"/add"}>
            <button className="bg-cyan-300 rounded-full w-24 h-24 fixed bottom-[5%] right-[5%] shadow hover:bg-cyan-500" >新規作成</button>
        </Link>


      </div>
   
  </main>
  );
}
