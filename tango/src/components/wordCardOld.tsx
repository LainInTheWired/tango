import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
type Props = {
    rows : {
        id: number;
        title: string;
    }[],
    onDelete : (id:number) => void
}

export default function WordCard(props:Props) {
    return (
        <div className="w-[80%] border-2 overflow-hidden">
                {
                    props.rows.map((row:{id: number;title: string;}) => {
                        return (
                            // <Item key={row.id}>
                            //     <p className="flex flex-grow flex-shrink-0 w-full">{row.title}</p>
                            //     <button className=" flex bg-red-500 text-left min-w-10 " onClick={() => {props.onDelete(row.id); console.log("deleted")} }>削除</button>
                            // </Item>
                            <Item key={row.id}>
                                <Link href={"/list"}>
                                       <div className="flex bg-white mt-5 mx-5 h-16 rounded justify-between items-center" >
                                             <Image src="/folder.svg" width={64} height={64} alt="folder_img" />
                                         <p className="mr-5">jfiejaoifjewioa</p>
                                     </div>
                                </Link>
                            </Item>
                        )
                    })
                }
        </div>
        // <Link href={"/list"}>
        //     <div className="flex bg-white mt-5 mx-5 h-16 rounded justify-between items-center" >
        //         <Image src="/folder.svg" width={64} height={64} alt="folder_img" />
        //         <p className="mr-5">jfiejaoifjewioa</p>
        //     </div>
        // </Link>
    );
}
const Item = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const ref = useRef<HTMLDivElement>(null)

    let downX:number

    const onPointerMove = (e : PointerEvent) => {
        const newX =  e.clientX;

        if (ref.current) {
            console.log("onPointerMove")
            console.log(newX)

            if (newX - downX < -30){
                    console.log("pointerMove" + (newX - downX))
                    ref.current.style.transform = 'translateX(-55px)';
            }else {
                ref.current.style.transform = 'translateX(0px)';
            }
        } 
    }

    const onPointerDown = (e :any) => {
        downX  = e.clientX;
        ref.current?.addEventListener('pointermove',onPointerMove)
        console.log("onPointerDown")
    }
    const onPointerUp = () => ref.current?.removeEventListener('pointermove',onPointerMove)

    return (
        <div onPointerDown={onPointerDown} onPointerUp={onPointerUp} ref={ref} className="flex  mx-1 transition duration-700">
            {children}
        </div>
    )
}
