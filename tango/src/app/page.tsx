'use client'
import { useEffect, useState } from "react";
import Menubar from "../components/menubar";
import Card from "@/components/card";

interface Folder {
  
  id: number;
  name: string;
  userId: number;
  createAt: Date
}

export default function Home() {
  const [folders,setFolders] = useState<Folder[]>([])
 const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }
  const onSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/folder/add', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
    })
    const data = await response.json()
    console.log(data)
    getFolders()
    setIsOpen(false)
  }
  const getFolders = async () => {
    try {
      const response = await fetch('/api/folder/get', {
        method: 'POST',
        body: JSON.stringify({ id:1234}),
      })
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data)
      setFolders(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    getFolders()
  },[])
  
  return (
    <main>
      <Menubar
        secondButtonClickFuc={toggleModal}
        secondButtonName="新規作成"
        menuName="フォルダ"
        firstButtonClickFuc={toggleModal}
        istwoButton={false}
        firstButtonName=""
      />
      <div className="pt-16">
      {folders.map((folder) => (
         // ここでreturnを使用
          <Card key={folder.id} fid={folder.id} name={folder.name}></Card>
        ))}
      {isOpen && (
        <div className="w-screen h-screen fixed flex flex-col items-center justify-center  z-10	overflow-hidden bg-gray-500/50 transition-all	absolute inset-0"
        onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <form action="" onSubmit={onSubmit} className="w-10/12	 shadow bg-white relative h-40 rounded flex " >
            <div className="w-10/12 text-black relative	block m-auto mt-auto">
              <label htmlFor="" className="mb-12 block">
                新規フォルダ名
                <input name="name" type="text" id="last_name" className=" bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
              </label>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded absolute right-0 top-20" >
                  作成
                </button>
              </div>
          </form>
        </div>
  
      )}
        
      </div>
      
    </main>
  );
}
