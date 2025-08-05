import { f, getLiftersIfollow, setFollowIcon } from "./lifterSidebar.js";
import { loggedinLifter } from "./login.js";
import { currLifter } from "./lifterSidebar.js";
import { endpoint as c  } from "./config.js";
import { setCoachIcon } from "./coach.js";

//------------------------------------------------------------------------------
// method to have one user follow another user 
//------------------------------------------------------------------------------
export function followLifterEvent(){
    // need follower id and followee id 
    // follower will be currentlogged in lifter
    // followee (followed) is the currLifter.id
    f.post(c.FOLLOW_LIFTER, 
        { "follower" : loggedinLifter.id, 
          "followee" : currLifter.id })
        .then(res=>{
            setFollowIcon();
            getLiftersIfollow();
            setCoachIcon();
        })
        .catch(err=>console.error(err));
}
//------------------------------------------------------------------------------
// method to have one user unfollow another user 
//------------------------------------------------------------------------------
export function unfollowLifterEvent(){
    f.delete(c.UNFOLLOW_LIFTER,  
        { "follower" : loggedinLifter.id, 
          "followee" : currLifter.id })
        .then(res=>{
            setFollowIcon();
            setCoachIcon();
            getLiftersIfollow();
        })
        .catch(err=>console.error(err));
}
//------------------------------------------------------------------------------
// method to check if a user follows another user
//------------------------------------------------------------------------------
export async function Ifollow(){
    const res = await f.post( c.DO_I_FOLLOW, {"followerID" : loggedinLifter.id, "followeeID" : currLifter.id} );
    if (res) return true;
    return false;
}