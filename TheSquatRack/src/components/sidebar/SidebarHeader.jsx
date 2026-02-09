import './SidebarHeader.css';
import ListToggle from './ListToggle';

export default function SideBarHeader(){
    return (
        <div className='sidebarHeader'>
            <ListToggle />
            {/* <div className='sidebarHeaderText'>Lifting Partners</div> */}
        </div>
    );
}