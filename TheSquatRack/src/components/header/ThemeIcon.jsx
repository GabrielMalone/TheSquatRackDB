import './ThemeIcon.css';
import { Icon } from "@iconify/react";
import { useContext, useEffect } from 'react';
import { get } from '../../hooks/fetcher';
import { post } from '../../hooks/fetcher.jsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { AuthContext } from '../login/authContext.jsx';

export default function ThemeIcon() {

    const lightIcon = "iconamoon:mode-light-light";
    const darkIcon = "iconamoon:mode-dark-light"

    // -------------------------------------------------------------------------
    const queryClient = useQueryClient();
    // -------------------------------------------------------------------------
    const { userData } = useContext(AuthContext);
    const idUser = userData.idUser;
    // -------------------------------------------------------------------------
    const {data : res} = useSuspenseQuery({
        queryKey: ["mode", idUser],
        queryFn: () => get(`getMode?idUser=${idUser}`),
    });
    // -------------------------------------------------------------------------
    useEffect(() => {
        document.documentElement.classList.toggle("light", res.mode);
    }, [res.mode]);
    // -------------------------------------------------------------------------
    const updateTheme = useMutation({
		mutationFn: (m) => {
			return post("setMode", {
                idUser,
                mode : m
            })
		},
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["mode"],
                exact: false
            });
        },
	});
    // -------------------------------------------------------------------------
    function handleOnClick() {
        updateTheme.mutate(!res.mode);
    }
    // -------------------------------------------------------------------------
    return (
        <button 
            className='themeIcon' 
            onClick={handleOnClick}
            aria-label = {res.mode ?  "select dark theme"  : "select lightTheme"}
        >
            <Icon icon = {res.mode ?  darkIcon : lightIcon}/>
        </button>
    );
}