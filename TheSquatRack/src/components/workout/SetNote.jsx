import './SetNote.css';
import { Icon } from "@iconify/react";
import { post } from '../../hooks/fetcher.jsx';
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { useState } from 'react';

export default function SetNote({note}){
    //-----------------------------------------------------------------
    const [draft, setDraft] = useState(note.note ?? "");
    const [editing, setEditing] = useState(false);
    //-----------------------------------------------------------------
    const queryClient = useQueryClient();

    const updateSetNote = useMutation({
		mutationFn: data => {
			return post("updateSetNote", {
                note: data,
                idSet : note.idSet,
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["workouts"],
                exact: false
            });
        }
	});
    //-----------------------------------------------------------------
    function handleSaveNote(){
        updateSetNote.mutate(draft);
    }
    //-----------------------------------------------------------------
    return(
        <div className='setNoteRoot'>

            <div className='setNoteHeader'>

                <div className='setNoteRef'>
                    {note.weight} x {note.reps}
                </div>

                <button 
                    className='setNoteSave'
                    onClick={handleSaveNote}
                    aria-label="save note"
                >
                    <Icon icon="circum:save-up-2"/>
                </button>

            </div>

            <textarea 
                className='setNoteBody' 
                value={ updateSetNote.isPending
                        ? "Saving note..."
                        : ( editing ? 
                            (draft ? 
                                draft : "") 
                            : 
                            (note.note ? 
                                note.note : "") 
                            ) 
                        }
                onKeyDown={e=>{
                    setEditing(true);
                    if (e.key === 'Enter'){
                        e.preventDefault();
                        handleSaveNote();
                        setEditing(false);
                    }
                }}
                onChange={e=>{
                    setDraft(e.target.value);
                }}
                placeholder='Enter a note...'
                maxLength={256}
                disabled={updateSetNote.isPending}
                onBlur={handleSaveNote}
            />
        </div>
    );
}