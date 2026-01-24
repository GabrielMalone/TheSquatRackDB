import './LogoutIcon.css';
import { Icon } from "@iconify/react";
import { AuthContext } from '../login/authContext';
import { useContext } from 'react';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { post } from "../../hooks/fetcher";


export default function LogoutIcon() {

    const navigate = useNavigate();

    const { userData } = useContext(AuthContext);

    const logout = useMutation({
        mutationFn: () => {
            return post("logout", {
                idUser : userData.idUser
            })
        },
        onSuccess: (res) => {
            if (res){
                navigate("/");
            }
        },
    });

    function handleOnClick(){
        logout.mutate();
        return;
    }

    return (
        <button 
            className='loginIcon' 
            onClick={handleOnClick}
            aria-label="login icon"
        >
            <Icon icon="circum:login"/>
        </button>
    );
}