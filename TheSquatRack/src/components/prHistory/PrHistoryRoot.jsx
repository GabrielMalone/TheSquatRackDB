import './PrHistoryRoot.css';
import { get } from '../../hooks/fetcher';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useEffect, useRef } from 'react';
import PrHistoryWindowManager from './prHistoryWindowManager';
import PrHistoryHeader from './prHistoryHeader';
import PrHistoryForExercise from './PrHistoryForExercise';
import AddExercise from '../addExercise/AddExercise';
import { AuthContext } from '../login/authContext';


export default function PrHistoryRoot(){

    const ref = useRef(null); 
    const { userData } = useContext(AuthContext);
    // -------------------------------------------------------------------------
    useEffect(()=>{
        ref.current?.
        scrollIntoView({behavior: "smooth", block: "center" });
    },[]);
    // -------------------------------------------------------------------------
    const idUser = userData.idUser; // hard coded for now
    // -------------------------------------------------------------------------
    const {data : trackedLifts} = useSuspenseQuery({
        queryKey: ["trackedLifts", idUser],
        queryFn: () => get(`getTrackedLifts?idUser=${idUser}`),
    });
    // -------------------------------------------------------------------------
    trackedLifts.sort((a, b) => {
        return new Date(a.dateAdded) - new Date(b.dateAdded);
    });
    // ------------------------------------------------------------------------- 
    const {data : liftData} = useSuspenseQuery({
        queryKey: ["prHistory", idUser, trackedLifts.map(t=>t.idExercise)],
        queryFn: async () => {
            const res = await Promise.all(
                trackedLifts.map(t => get(`getPRDataForLift?idUser=${idUser}&idExercise=${t.idExercise}`))
            );
            return res;
        }
    });
    // -------------------------------------------------------------------------
    const prs = liftData?.map(lifts=>{
        const seenReps = [];
        return lifts.filter(lift=>{
            if (!seenReps.includes(lift.reps)){
                seenReps.push(lift.reps);
                return true;
            }
            return false;
        });
    });

    // -------------------------------------------------------------------------
    return (
        <div 
            className='prHistoryRoot'
            ref={ref}
        >
            <PrHistoryWindowManager />
            <PrHistoryHeader />
            {prs.map((pr, i)=> pr.length ? <PrHistoryForExercise key={i} prData={pr} /> : null)}
            <AddExercise route={'prHistory'}/>
        </div>
    );

}