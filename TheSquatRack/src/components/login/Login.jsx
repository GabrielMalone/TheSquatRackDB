import "./Login.css";
import { AuthContext } from "./authContext";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { post } from "../../hooks/fetcher";


export default function Login(){

    const navigate = useNavigate();

    const { setUserData } = useContext(AuthContext);

    const login = useMutation({
            mutationFn: ({userName, pwd}) => {
                return post("login", {
                    userName,
                    pwd
                })
            },
            onSuccess: (res) => {
                if (res){
                    setUserData({ 
                        idUser:     res.idUser, 
                        userName:   res.userName,
                        profilePic: res.profilePic,
                        allUserData:res 
                    });
                    navigate("/home");
                }
            },
        });

    function handleLogin(e){
        e.preventDefault();
        const userName = e.target.username.value;
        const pwd = e.target.pwd.value;
        login.mutate({userName, pwd});
    }

    return(
        <div className='loginRoot'>
            <div className="loginBox">
                <div className="loginBoxHeader">The Combo Rack</div>

                <form 
                    onSubmit={handleLogin}
                    className="loginForm"
                >
                    <input
                        id="loginUserName"
                        type="text"
                        name="username"
                        required
                        placeholder="user name"
                    />
                    <input
                        id="loginPassword"
                        type="password"
                        name="pwd"
                        required
                        placeholder="password"
                    />
                    <button 
                        type="submit"
                        className="loginSubmit"
                    >
                        login
                    </button>
                </form>

            </div>
        </div>
    )
}