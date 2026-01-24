import { useEffect } from "react";

export function useScrollIntoView(ref, condition, block = "start"){
    useEffect(()=>{
        if (condition){
            ref.current?.scrollIntoView({behavior: "smooth", block });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[condition, block]);
}