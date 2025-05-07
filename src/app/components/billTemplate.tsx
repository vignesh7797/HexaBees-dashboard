import { BiRupee } from 'react-icons/bi';
import { ImLeaf } from 'react-icons/im';
import { FC } from 'react';
import { Bill } from '../common';

interface BillProps{
    order : Bill
}

const BillTemplate:FC<BillProps> = ({order}) => {
    return (
        <div className="print-container nunito-regular text-black pr-5 md:w-full print:w-full">
            <h1 className="text-center font-adlm text-xl">Tibet Momo Cafe.</h1>
            <p className="text-center text-xs w-3/4 mx-auto my-2">6/11, MGR Road,  GEM Hospital opposite, Kandanchanvadi.</p>
            <h6 className="text-center font-semibold text-xs my-1">
                +91 637 924 1773
            </h6>
            <p className="text-center text-xs my-1">Bill Number: #{order?.id}</p>

            <div className="flex justify-between items-center p-2 border-dashed border-b-[2px] border-black">
                <p className="text-xs">Date: {new Date(order?.date || '')?.toDateString()}</p>
                <p className="text-xs">Time:{new Date(order?.date || '').toLocaleTimeString()}</p>
            </div>

            <table className="w-full p-2 border-b-[1px] border-dashed border-black">
                <thead className="border-b-[1px] border-dashed border-black text-xs">
                    <tr className="h-[30px]">
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order?.products.map((menu) => (
                        Number(menu.quantity) > 0 ?
                            (<tr key={menu.id+''+menu.name}>
                                <td className="h-[25px]">
                                    <p className="truncate w-[120px] text-xs pl-2">{menu.name}</p>
                                </td>
                                <td className="text-center text-xs">{menu.price}</td>
                                <td className="text-center text-xs">{menu.quantity}</td>
                                <td className="text-center text-xs">{menu.price * Number(menu.quantity)}</td>
                            </tr>) : ('')
                        )
                    )}
                </tbody>
            </table>

            <div className="flex flex-col items-end px-4 py-2 gap-2 border-b-2 border-dashed border-black">
                <p className="text-xs flex items-center justify-end font-medium">SubTotal : <BiRupee />{order?.sub_total || 0}</p>
                <p className="text-xs flex items-center justify-end font-medium">Discount : {order?.discount}%</p>
            </div>

            <p className="font-bold text-sm flex items-center justify-end p-4">
                Total : <BiRupee /> {order?.total_amount}
            </p>

            <div className="border-y-[1px] border-dashed border-black py-4">
                <div className="flex items-center justify-center gap-2 text-black opacity-75 text-ms font-adlm  h-[50px]">
                    Save Paper!! Save Nature!! <ImLeaf />
                </div>
            </div>
        </div>
    )
}

export default BillTemplate