type Props = {
    firstButtonClickFuc: (event: React.MouseEvent<HTMLButtonElement>) => void;
    firstButtonName :string
    secondButtonClickFuc: (event: React.MouseEvent<HTMLButtonElement>) => void;
    secondButtonName :string
    istwoButton :boolean
    menuName :string
}

export default function Menubar({firstButtonClickFuc,firstButtonName,secondButtonClickFuc,secondButtonName,istwoButton,menuName}: Props) {
    return (
        <div className="flex bg-white min-h-16 items-center justify-between	">
            <div className="w-1/3">
                {istwoButton &&
                <button className="bg-cyan-300 rounded w-20 h-8 ml-4" onClick={firstButtonClickFuc} >{firstButtonName}</button>
                }
            </div>
            <div className="w-1/3 text-center">
                <p className="inline-block ">{menuName}</p>
            </div>
            <div className="w-1/3 text-right	">
                <button className="bg-cyan-300 rounded w-20 h-8 mr-4" onClick={secondButtonClickFuc}>{secondButtonName}</button>
            </div>
        </div>
    );
}
