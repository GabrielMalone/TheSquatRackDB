import './SetHeader.css';

export default function SetHeader(){
    return (
        <div className='setHeader'>
            <div className='setHeaderItem'>Set</div>
            <div className='setHeaderItem'>Weight</div>
            <div className='setHeaderItem'>Unit</div>
            <div className='setHeaderItem'>Reps</div>
            <div className='setHeaderItem'>RPE</div>
            <div className='setHeaderItem meta'>Note</div>
            <div className='setHeaderItem meta'>Video</div>
            <div className='setHeaderItem meta'>History</div>
        </div>
    );
}