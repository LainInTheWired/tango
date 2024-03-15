import Link from "next/link";

export default function Header() {
    return (
       <header className="flex bg-cyan-600 min-h-16 items-center ">
            <Link className="text-white text-xl ml-5" href={"/"}>
                タン伍長
            </Link>
       </header>
    );
}
