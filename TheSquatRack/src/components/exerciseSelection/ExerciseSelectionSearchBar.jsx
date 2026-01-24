import './ExerciseSelectionSearchBar.css';
import { useState, useMemo, useContext } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { get } from '../../hooks/fetcher';
import { ExerciseSearchContext } from './ExerciseSearchContext';


export default function ExerciseSelectionHeader() {

    const {setSearchResults} = useContext(ExerciseSearchContext);

    // -------------------------------------------------------------
    const [searchQuery, setSearchQuery] = useState("");

    // get all the exercises
    const {data : allExercises} = useSuspenseQuery({
                queryKey: ["allExercises"],
                queryFn: () => get('getAllExercises'),
    });
    // -------------------------------------------------------------
    // map them for search and memoize 
    const liftMap = useMemo(() => {
        const map = new Map();
        for (const category of allExercises){
            for (const lift of category.lifts_in_category){
                map.set(lift.exerciseName, lift);
            }
        }
        return map;
    }, [allExercises]);
    // -------------------------------------------------------------
    const liftMap2 = useMemo(() => {
        const map = new Map();
        for (const category of allExercises){
            for (const lift of category.lifts_in_category){
                map.set(lift.abbreviation, lift);
            }
        }
        return map;
    }, [allExercises]);
    // -------------------------------------------------------------
    const liftMap3 = useMemo(() => {
        const map = new Map();
        for (const category of allExercises){
            for (const lift of category.lifts_in_category){
                map.set(lift.Description, lift);
            }
        }
        return map;
    }, [allExercises]);
    // -------------------------------------------------------------
    function handleSearchLifts(q) {

        q = q.toLowerCase();

        if (q.length < 1) {
             setSearchResults([]);
             return;
        }

        const resultsMap = new Map();
        const results = [];

        for (const [key, lift] of liftMap.entries()) {
            if (key.toLowerCase().includes(q)) {
                resultsMap.set(lift.exerciseID, lift);
            }
        }

        for (const [key, lift] of liftMap2.entries()) {
            if (key.toLowerCase().includes(q)) {
                resultsMap.set(lift.exerciseID, lift);
            }
        }
        
        for (const [key, lift] of liftMap3.entries()) {
            if (key.toLowerCase().includes(q)) {
                resultsMap.set(lift.exerciseID, lift);
            }
        }

        // eslint-disable-next-line no-unused-vars
        for (const [key, lift] of resultsMap.entries()) {
            results.push(lift);
        }
        
        results.sort((a, b) =>{
            return a.exerciseID - b.exerciseID;
        });

        setSearchResults(results);
    }
    // -------------------------------------------------------------
    return (
            <div className='exerciseSelectionHeader'>
                <input
                    className='exerciseSearchField'
                    type='text'
                    placeholder='search exercises'
                    onChange={(e)=>{
                        setSearchQuery(e.target.value);
                        handleSearchLifts(e.target.value);
                    }}
                    value={searchQuery}
                    autoFocus='true'
                >
                </input>
            </div>
    );
    // -------------------------------------------------------------
}