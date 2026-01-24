import { monthsMap } from "./monthsMap";

export default function cleanDate(dateID){
 
    const year  = dateID.slice(0,4);
    const month = parseInt(dateID.slice(5,8),10);
    const day   = dateID.slice(8,11);

    return`${monthsMap[month-1].monthName} ${Number(day)}, ${year}`;

}