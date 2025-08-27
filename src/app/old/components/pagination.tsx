import { FC } from "react";
import { FaAngleRight, FaAngleLeft, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

type PaginationProps = {
    onPageChange ?: (event) => void;
    total : number;
    count ?: number;
    currentPage ?:number;
}

const Pagination: FC<PaginationProps> = ({onPageChange, total, count = 10, currentPage = 1}) =>{

    const totalPage = Math.ceil(total/count);

    const onSelectCount = (e) =>{
        onPageChange({page:currentPage, count:e.target.value})
    }

    const onSelectPage = (e) =>{
        console.log(Number(e.target.innerText));
        onPageChange({page:Number(e.target.innerText), count:count})
    }

    const onSkipPage = (skip) =>{
        switch (skip) {
            case 'next':
                onPageChange({page:currentPage+1, count:count})
                break;

            case 'prev':
                onPageChange({page:currentPage-1, count:count})
                break;

            case 'start':
                onPageChange({page:1, count:count})
                break;

            case 'end':
                onPageChange({page:totalPage, count:count})
                break;
        
            default:
                break;
        }
    }


    return(
        <section className="w-full flex flex-col md:flex-row p-2 justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <p className="text-sm font-acme text-grey">Page Count</p>
                <select value={count} onChange={onSelectCount} className="w-20">
                    <option>5</option>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                </select>
            </div>

            <div className="flex items-center gap-1">
                <button className="btn-icon-black scale-90" onClick={()=>onSkipPage('start')} disabled={currentPage == 1}><FaAnglesLeft/></button>
                <button className="btn-icon-black scale-90" onClick={()=>onSkipPage('prev')} disabled={currentPage == 1}><FaAngleLeft/></button>

                <button className={`btn-icon ${currentPage == 1 ? 'btn-icon-primary' :''}`} onClick={onSelectPage}>
                    {currentPage == 1 ? '1' : currentPage == totalPage ? currentPage - 2 : currentPage - 1 }
                </button>

                {totalPage > 1 && (
                    <button className={`btn-icon ${currentPage != 1 && currentPage != totalPage ? 'btn-icon-primary' :''}`} onClick={onSelectPage}>
                        {currentPage == 1 ? '2' : currentPage == totalPage ? currentPage - 1 : currentPage}
                    </button>
                )}

                {totalPage > 2 && (
                    <button className={`btn-icon ${currentPage == totalPage ? 'btn-icon-primary' :''}`} onClick={onSelectPage}>
                        {currentPage == 1 ? '3' : currentPage == totalPage ? currentPage : currentPage + 1}
                    </button>
                )}

                <button className="btn-icon-black scale-90" onClick={()=>onSkipPage('next')} disabled={currentPage == totalPage}><FaAngleRight/></button>
                <button className="btn-icon-black scale-90" onClick={()=>onSkipPage('end')} disabled={currentPage == totalPage}><FaAnglesRight/></button>
            </div>

            <p className="font-acme text-grey">
                {(currentPage - 1) * count + 1} - {total > currentPage * count ? currentPage * count : total} &nbsp; of &nbsp; {total}
            </p>
        </section>
    )
}

export default Pagination;