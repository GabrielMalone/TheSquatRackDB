import './SidebarHeader.css';
import ListToggle from './ListToggle';
import SidebarSearch from './SidebarSearch';

export default function SideBarHeader(){
    return (
        <div className='sidebarHeader'>
            {/* <SidebarSearch /> */}
            <ListToggle />
            {/* <div className='sidebarHeaderText'>Lifting Partners</div> */}
        </div>
    );
}