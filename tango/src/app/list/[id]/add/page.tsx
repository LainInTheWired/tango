'use client'
import Menubar from "@/components/menubar";
import WordCard from "@/components/wordCard";
import { error } from "console";
import  React, { useState,useEffect,useRef} from "react";
import { usePathname,useSearchParams } from 'next/navigation'


interface SendMessage {
    en: string;
}
interface ReceivedMessage {
    jp: string
}
export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [receivedMessage, setReceivedMessage] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const searchParams = useSearchParams()
    const path =  usePathname()
    const fid = Number(path.split("/").slice(-2)[0]);

    
    const connectWebSocket = () => {
        // const url: string = "wss://www.laininthewired.site:3335";
        const url: string = "ws://192.168.11.7:5001";

        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
            console.log("WebSocket Connected");
        }
        ws.current.onmessage = (event:MessageEvent) => {
            const data: ReceivedMessage = JSON.parse(event.data);
            console.log("WebSocket Received:",data);
            setReceivedMessage(data.jp);        
        }
        ws.current.onerror = (event) => {
            console.error("WebSocket Error:", event);
        }
        ws.current.onclose = (event) => {
            console.log("WebSocket Closed:", event);
            
        }
    }

    useEffect(() => {
        // const url: string = 'ws://localhost:5001';
        // ws.current = new WebSocket(url);

        // ws.current.onopen = () => {
        //     console.log("WebSocket Connected");
        // };
        
        // ws.current.onmessage = (event: MessageEvent) => {
        //     const data: ReceivedMessage = JSON.parse(event.data);
        //     console.log("WebSocket Received:",data);

        //     setReceivedMessage(data.jp);
        // };
        
        // ws.current.onerror = (event) => {
        //     console.error("WebSocket Error:", event);
        // };
        connectWebSocket()
        
        return () => {
            if (ws.current) {
                ws.current.close();
                console.log("WebSocket Closed");
            }
        };
    }, []);

    const SendMessage = (value:String) => {
        if(ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log("WebSocket Send:", value);
            ws.current.send(JSON.stringify({en: value}))
        }else {
            console.log("WebSocket is not connected.");
            connectWebSocket()
        }
    }

    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setMessage(value);

        if (debounceTimer.current){
            clearTimeout(debounceTimer.current)
        }
        debounceTimer.current = setTimeout(() => SendMessage(value),500)
    };

    const toggleModal = () => setIsOpen(!isOpen);

    const onSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const formDataObject = Object.fromEntries(formData);
        const dataToSend = { ...formDataObject, folder: fid };


        const response = await fetch('/api/word/add', {
          method: 'POST',
          body: JSON.stringify(dataToSend),
        })
        const data = await response.json()
        console.log(data)
        setIsOpen(false)
        // ここで判別したい
        setMessage('')
        setReceivedMessage('')
        if(buttonClicked){
            history.back()
        }
    }
    const handleReceivedMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReceivedMessage(event.target.value);
    };



    return (
        <main >
            <Menubar
                secondButtonClickFuc={toggleModal}
                secondButtonName="カメラ"
                menuName="名前"
                firstButtonClickFuc={() => history.back()}
                istwoButton={true}
                firstButtonName="戻る"
            />
            <form action="" onSubmit={onSubmit}>
                <div className="w-11/12 mx-auto mt-10">
                    <label htmlFor="message" className="block  text-sm font-medium text-gray-900 dark:text-white">英語</label>
                    <textarea name="wordEN" id="message" value={message} onChange={handleMessageChange} className="block p-2.5 w-full text-base text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="apple"></textarea>
                </div>
                <div className="w-11/12 mx-auto mt-10 ">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white">日本語</label>
                    <textarea name="wordJP" value={receivedMessage} id="message" onChange={handleReceivedMessageChange} className="block p-2.5 w-full text-base text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="りんご"></textarea>
                </div>
                <div className="w-11/12 mx-auto mt-[20svh]">
                    <button name="save" className="w-full bg-cyan-300 rounded mx-auto h-16" onClick={() => setButtonClicked(true)}>保存</button>
                    <button name="another" className="w-full bg-yellow-300 rounded mx-auto h-16 mt-5" onClick={() => setButtonClicked(false)}>保存して次の単語を新規作成</button>
                </div>
            </form>
        </main>
    );
    }
