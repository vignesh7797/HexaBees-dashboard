import { Spinner } from "flowbite-react";
import { FC } from "react";

interface LoadingProps {
    show : boolean
}

const Loading : FC<LoadingProps> = ({show}) =>{
    return (
        <div className={`${show ? 'flex' : 'hidden'} w-screen h-screen absolute top-0 left-0 z-50 bg-black bg-opacity-35 items-center justify-center `}>
            <Spinner color="failure" aria-label="Failure spinner example" size="xl" />
        </div>
    )
}

export default Loading