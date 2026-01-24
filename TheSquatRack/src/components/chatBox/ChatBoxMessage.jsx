import './ChatBoxMessage.css';
import { useContext } from 'react';
import { AuthContext } from '../login/authContext';
import { LayoutContext } from '../../layoutContext';
import { Icon } from '@iconify/react';


export default function ChatBoxMessage( {msgData, total, num} ){

    const profPic = <Icon icon="iconamoon:profile-circle-thin"/>;
    const msg = msgData.message;
    const idSender = msgData.idSender;
    const { userData } = useContext(AuthContext);
    const { userInChat } = useContext(LayoutContext);
    const fromMe = (userData.idUser == idSender);
    const lastMsg = (total == num + 1);

    console.log('sender user data:', userInChat);

    const otherClassName = lastMsg ? 'otherChatter chatText lastMsg' : 'otherChatter chatText';
    const selfClassName = lastMsg ? 'selfChatter chatText lastMsg' : 'selfChatter chatText';

    return (
        <div className='chatBoxMessageRoot'>
            <div className='chatMsgProfilePic otherChatter'>{
            !fromMe ?
                (userInChat.profilePic ? userInChat.profilePic : profPic) 
                : null}
            </div>
            <div className={otherClassName}>{fromMe ? null : msg  }</div>
            <div className='chatTime otherChatter'>{fromMe ? null : msgData.msgDate}</div>
            <div className={selfClassName}>{ fromMe ? msg : null }</div>
            <div className='chatTime selfChatter'>{ fromMe ? msgData.msgDate : null}</div>
        </div>
    );
} 