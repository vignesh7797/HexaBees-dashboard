import { ListGroup, TextInput } from "flowbite-react";
import { FC, useState } from "react";
import { Menu } from "../context/menuContext";

interface AutoCompleteProps {
    list:Menu[];
}

const AutoComplete: FC<AutoCompleteProps> = ({list}) => {
    const [showList, setShowList] = useState(false);
    const [value, setValue] = useState('');
    const [filteredList, setFilteredList] = useState<Menu[]>([]);

    const onChangeHandle = (event:React.ChangeEvent<HTMLInputElement>) =>{
        console.log(event.target.value);
        setValue(event.target.value)
        setShowList(event.target.value?.length > 1);
        setFilteredList(list.filter(li => li.name?.toLowerCase().startsWith(event.target.value?.toLowerCase())))
    }

    return (
       
        <>
           <div className="relative w-fit">
                <TextInput id="name" sizing="sm" type="name" placeholder="Recipe Name" className="w-[200px]" value={value} onChange={(event) =>{onChangeHandle(event)}} />
                {showList && (
                    <div className="absolute shadow-lg bg-white rounded w-full mt-1 border-[1px] border-slate-300">
                         <ListGroup className="w-full">
                            {filteredList.map((item:Menu) =>{
                                return (
                                    <ListGroup.Item>{item.name}</ListGroup.Item>
                                )
                            })}
                            
                        </ListGroup>
                    </div>
                )}

           </div>

        </>
    )
}

export default AutoComplete;