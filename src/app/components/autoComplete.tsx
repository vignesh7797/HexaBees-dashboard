import { ListGroup, TextInput } from "flowbite-react";
import { FC, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface AutoCompleteProps {
    list : object[] | string[] | number[];
    keyName ?: string;
    onSelect ?: (e)=> void;
    defaultValue ?;
}

const AutoComplete: FC<AutoCompleteProps> = ({list, keyName = '', onSelect, defaultValue}) => {
    const [showList, setShowList] = useState(false);
    const [value, setValue] = useState('');
    const [filteredList, setFilteredList] = useState([]);
    const [width, setWidth] = useState('300px')
    const listRef = useRef(null);

    const onChangeHandle = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setValue(event.target.value)
        setShowList(event.target.value?.length > 0);
        setFilteredList(list.filter(li => (keyName ? li[keyName] : li)?.toLowerCase().includes(event.target.value?.toLowerCase())))
    }

    const handleOpenList = (isOpen?) =>{
        setShowList(isOpen);
        const text = document.getElementById('randomId');
        setWidth(text.clientWidth+'px')
    }

    useEffect(() => {
        setValue(defaultValue || '');
    },[defaultValue])

    useEffect(() =>{
        if(list){
            setFilteredList(list);

            const text = document.getElementById('randomId');
            const option = document.getElementById('randomId'+'_list');
            
            if(text && option){
                option.style.top = text.getClientRects().item(0).bottom +'px';
                option.style.width = text.getClientRects().item(0).width +'px';
            }
        }
    },[list])

    useEffect(() =>{
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    })

    const handleClickOutside = (e) =>{
        if (listRef.current && !listRef.current.contains(e.target)) {
            setShowList(false); 
          }
    }

    const handleSelect = (item) => {
       setValue(keyName ? item[keyName] : item);
       onSelect(item);
       setShowList(false);
    }

    return (
       
        <>
           <div className="w-full">
                <TextInput id={'randomId'} type="name" placeholder="Select" rightIcon={IoIosArrowDown} className="w-full" value={value} onChange={(event) =>{onChangeHandle(event)}} onFocus={()=>handleOpenList(true)} autoCorrect="false"/>
                {showList && (
                    <div ref={listRef} id={'randomId'+'_list'} className="absolute shadow-lg rounded mt-1 z-50 max-h-64 overflow-y-auto" style={{width:width}}>
                        <ListGroup className="w-full" color="warning">
                            {filteredList.length > 0 ? filteredList.map((item, ind) =>{
                                return (
                                    <ListGroup.Item key={ind} className={item || item[keyName] ? '' : 'text-gray-400'}  onClick={() => handleSelect(item)}>{(keyName ? item[keyName] : item) || 'no Data'}</ListGroup.Item>
                                )
                            }) : (
                                <ListGroup.Item className="text-grey" disabled>No Data Found.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                )} 
           </div>

        </>
    )
}

export default AutoComplete;