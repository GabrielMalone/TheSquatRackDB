import './ExerciseList.css';

export default function ExerciseList({ exercises }){
    return (
        <div className='exerciseList'>
            { exercises }
        </div>
    );
}