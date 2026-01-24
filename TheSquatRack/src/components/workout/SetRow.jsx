import './SetRow.css';
import { Icon } from "@iconify/react";
import { useState } from 'react';
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient} from "@tanstack/react-query";


export default function SetRow({setData, showNoteMap, setShowNoteMap, idWorkout, idExercise}){

    // -------------------------------------------------------------
    const addIcon   = <Icon icon="sidekickicons:dots-2x2-solid" />;
    const noteIcon  = <Icon icon="ph:note-thin" /> ;
    const videoIcon = <Icon icon="fluent:video-clip-28-regular" /> ;
    const chartIcon = <Icon icon="solar:chart-bold" /> ;
    const trashIcon = <Icon icon="simple-line-icons:trash" />;
    // -------------------------------------------------------------
    const s = setData;          // set object with all the set data 
    const queryClient = useQueryClient();
    // -------------------------------------------------------------
    const [editingWeight, setEditingWeight] = useState(false);
    const [weight, setWeight] = useState(s.weight);
    // -------------------------------------------------------------
    const updateSetWeight = useMutation({
		mutationFn: () => {
			return post("updateSetWeight", {
                weight,
                idSet : s.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["trackedLifts"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["prHistory"],
                exact: false
            });
        },
	});
    // -------------------------------------------------------------
    function handleWeight(){
        updateSetWeight.mutate()
    }
    function handleWeightsKey(e){
        if (e.key === "Enter"){
            updateSetWeight.mutate()
            setEditingWeight(false);
        } 
        if (e.key === "Escape"){
            setEditingWeight(false);
        } 
    }
    // -------------------------------------------------------------
    const [editingReps, setEditingReps] = useState(false);
    const [reps, setReps] = useState(s.reps);

    const updateSetReps = useMutation({
		mutationFn: () => {
			return post("updateSetReps", {
                reps,
                idSet : s.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["prHistory"],
                exact: false
            });
        },
	});

    function handleReps(){
        updateSetReps.mutate()
    }
    function handleRepsKey(e){
        if (e.key === "Enter"){
            updateSetReps.mutate()
            setEditingReps(false);
        } 
        if (e.key === "Escape"){
            setEditingReps(false);
        } 
    }
    // -------------------------------------------------------------
    const [editingRPE, setEditingRPE] = useState(false);
    const [RPE, setRPE] = useState(s.rpe);

    const updateSetRPE = useMutation({
		mutationFn: () => {
			return post("updateSetRPE", {
                rpe: RPE,
                idSet : s.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["prHistory"],
                exact: false
            });
        },
	});

    function handleRPE(){
        updateSetRPE.mutate();
    }
    function handleRPEKey(e){
        if (e.key === "Enter"){
            updateSetRPE.mutate();
            setEditingRPE(false);
        } 
        if (e.key === "Escape"){
            setEditingRPE(false);
        } 
    }
    // -------------------------------------------------------------
    const [unit, setUnit] = useState(s.unit);

    const updateSetUnit = useMutation({
		mutationFn: () => {
			return post("updateSetUnit", {
                unit,
                idSet : s.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["prHistory"],
                exact: false
            });
        },
	});

    function handleUnit(){
        unit === 'lbs' ? setUnit("kg") : setUnit("lbs");
        updateSetUnit.mutate();
    }
    // -------------------------------------------------------------
    function handleNote(){
        if (!showNoteMap.has(s.idSet)) {
            const newMap = new Map(showNoteMap);
            newMap.set(s.idSet, s);
            setShowNoteMap(newMap);
        } else {
            showNoteMap.delete(s.idSet);
            const newMap = new Map(showNoteMap);
            setShowNoteMap(newMap);
        }
    }

    // -------------------------------------------------------------
    const [editingSetNumber, setEditingSetNumber] = useState(false);
    const [setNum, setSetNum] = useState(s.setNumber);

    const updateSetSetNum = useMutation({
		mutationFn: () => {
			return post("updateSetSetNumber", {
                setNum,
                idSet : s.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
        },
	});

    function handleSetNum(){
        updateSetSetNum.mutate();
    }
    function handleSetNumkey(e){
        if (e.key === "Enter"){
            updateSetSetNum.mutate();
            setEditingSetNumber(false);
        } 
        if (e.key === "Escape"){
            setEditingSetNumber(false);
        } 
    }
    // -------------------------------------------------------------
    const removeSet = useMutation({
		mutationFn: () => {
			return post("removeSet", {
                idWorkout : idWorkout,
                idExercise : idExercise,
                idSet : s.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["prHistory"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["trackedLifts"],
                exact: false
            });
        },
	});

    function handleRemoveSet(){
        removeSet.mutate();
    }    
    // -------------------------------------------------------------

    return(
        <div className='set'>

            { editingSetNumber ? 
                <input
                    className='setItem setNum input' 
                    type="number"
                    value={setNum}
                    onChange={e=>{
                        if (e.target.value.length <= 4
                            && e.target.value >= 0) {
                            setSetNum(e.target.value)
                        } 
                    }}
                    onBlur={(e)=>{
                        setSetNum(e.target.value);
                        handleSetNum();
                        setEditingSetNumber(false);
                    }}
                    onKeyDown={handleSetNumkey}
                    autoFocus
                >
                </input> 
                : 
                <button 
                    className='setItem setNum button' 
                    onClick={()=>setEditingSetNumber(true)}
                    aria-label={`set ${setNum}`}
                >
                    {setNum}
                </button> 
            }

            { editingWeight ? 
                <input
                    className='setItem weight input' 
                    type="number"
                    value={weight}
                    onChange={e=>{
                        if (e.target.value <= 9999 &&
                            e.target.value.length <= 6
                            && e.target.value >= 0 ){
                            setWeight(e.target.value)
                        }
                    }}
                    onBlur={(e)=>{
                        setWeight(e.target.value)
                        handleWeight();
                        setEditingWeight(false)
                    }}
                    onKeyDown={handleWeightsKey}
                    autoFocus
                >
                </input> 
                : 
                <button 
                    className='setItem weight button' 
                    onClick={()=>setEditingWeight(true)}
                    aria-label={`set ${setNum} weight ${weight}`}
                >
                    {weight}
                </button> 
            }
           
            <button 
                className='setItem unit'
                onClick={handleUnit}
                aria-label={unit}
            >
                {unit}
            </button>

            { editingReps ? 
                <input
                    className='setItem reps input' 
                    type="number"
                    value={reps}
                    onChange={e=>{
                        if (e.target.value.length <= 4
                            && e.target.value >= 0){ 
                            setReps(e.target.value)
                        }
                    }}
                    onBlur={()=>{
                        handleReps();
                        setEditingReps(false);
                    }}
                    onKeyDown={handleRepsKey}
                    autoFocus
                    maxLength={3}
                >
                </input>              
                : 
                <button 
                    className='setItem reps button'
                    onClick={()=>setEditingReps(true)}
                    aria-label={`${reps} reps`}
                >
                    {reps}
                </button> 
            }

            { editingRPE ?
                <input
                    className='setItem rpe input' 
                    type="number"
                    value={RPE}
                    onChange={e=>{
                        if (e.target.value <= 10
                            && e.target.value.length <= 3 
                            && e.target.value >= 0){
                                setRPE(e.target.value)
                            }
                    }}
                    onBlur={()=>{
                        handleRPE();
                        setEditingRPE(false);
                    }}
                    onKeyDown={handleRPEKey}
                    autoFocus
                >
                </input>             
                :
                <button 
                    className='setItem rpe button'
                    onClick={()=>setEditingRPE(true)}
                    aria-label={`${RPE} RPE`}
                >
                    {RPE}
                </button>
            }
            
            <button 
                className='setItem note icon'
                onClick={handleNote}
                aria-label="set note"
            >
                { s.note ? noteIcon : addIcon }
            </button>

            <div className='setItem video icon'> 
                {s.video ? videoIcon : addIcon}
            </div>

            <div className='setItem history icon'> 
                {chartIcon}
            </div>

            <button 
                className='setItem remove icon'
                onClick={handleRemoveSet}
                aria-label={`remove set ${setNum}`}
            > 
                {trashIcon}
            </button>

        </div>
    );
}