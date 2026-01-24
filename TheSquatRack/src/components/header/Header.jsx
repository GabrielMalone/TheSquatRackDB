import                  './Header.css';
import LogoutIcon from   './LogoutIcon';
import ProfileIcon from './ProfileIcon';
import ThemeIcon from   './ThemeIcon';
import PRhistoryIcon from './PRhistoryIcon';
import WorkoutCalendarIcon from './WorkoutCalendarIcon';

export default function Header(){
    return (
        <div className='headerRoot'>
            <div className='logo'>
                The Combo Rack
            </div>
            <nav className='toolbar'>
                <WorkoutCalendarIcon />
                <PRhistoryIcon />
                <LogoutIcon />
                <ProfileIcon />
                <ThemeIcon />
            </nav>
        </div>
    );
}
