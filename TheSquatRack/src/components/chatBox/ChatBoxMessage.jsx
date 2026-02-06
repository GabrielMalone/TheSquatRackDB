import './ChatBoxMessage.css';
import { Avatar } from '../profile/Avatar'
import { useContext } from 'react';
import { AuthContext } from '../login/authContext';
import { LayoutContext } from '../../layoutContext';
const BASE_URL = import.meta.env.VITE_API_BASE;

export default function ChatBoxMessage( {msgData, total, num} ){



    const msg = msgData.message;
    const idSender = msgData.idSender;
    const { userData } = useContext(AuthContext);

    const fromMe = (userData.idUser == idSender);
    const lastMsg = (total == num + 1);

    const srcOther = `${BASE_URL}getProfilePic?idUser=${msgData.idSender}`;
    const srcMe = `${BASE_URL}getProfilePic?idUser=${userData.idUser}`;

    const otherClassName  = lastMsg  ? 'otherChatter chatText lastMsg'  : 'otherChatter chatText';
    const selfClassName   = lastMsg  ? 'selfChatter chatText lastMsg'   : 'selfChatter chatText';

    // this will have to be made from a map and via all the users in the converastion
    // for group chat implementation

    return (
        <div className='chatBoxMessageRoot'>
            <div className={otherClassName}>
                {fromMe ? null :  <Avatar src={srcOther} online={true}/>  }
                {fromMe ? null :  msg  } 
            </div>
            <div className='chatTime otherChatter'>{fromMe ? null : msgData.msgDate}</div>
            <div className={selfClassName}>
                { fromMe ?  msg : null }
                { fromMe ? <Avatar src={srcMe} online={true}/> : null  }
            </div>
            <div className='chatTime selfChatter'>{ fromMe ? msgData.msgDate : null}</div>
        </div>
    );
} 