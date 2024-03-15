import Menubar from "../components/menubar";
import Card from "@/components/card";

export default function Newfolderform() {
  return (
    <form action="">
        <label htmlFor="">
            フォルダ名前
            <input type="text" placeholder="フォルダ名を入力してください"/>
        </label>
    </form>
  );
}
