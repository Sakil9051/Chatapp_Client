import React, { useEffect, useRef, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice';
import whatsapp_notification from "./../assets/whatsapp_notification.mp3";
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAudio, FaFileVideo, FaFileArchive, FaFileAlt, FaFileCode } from 'react-icons/fa';

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const audioRef = useRef(new Audio(whatsapp_notification));
    const [soundEnabled, setSoundEnabled] = useState(false);

    // Toggle function to enable or disable sound
    const toggleSound = () => {

        setSoundEnabled(soundEnabled==true ?false:true);  
    };




    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id);

            socketConnection.on('conversation', (data) => {
                

                const newConversationData = data.map(conversationUser => {
                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return { ...conversationUser, userDetails: conversationUser.sender };
                    } else if (conversationUser?.receiver?._id !== user._id) {
                        return { ...conversationUser, userDetails: conversationUser.receiver };
                    } else {
                        return { ...conversationUser, userDetails: conversationUser.sender };
                    }
                });

                setAllUser(newConversationData);

                // console.log('conversation', data);

                
                // console.log('sound',soundEnabled);
                // // Play notification if conditions are met and sound is enabled
                // if (newConversationData.some(conversation => conversation.unseenMsg && conversation.receiver._id === user._id) && soundEnabled) {
                //     console.log("Play notification");
                //     audioRef.current.play().catch(error => {
                //         console.error('Error playing notification sound:', error);
                //         // Handle or log error - maybe the user hasn't interacted yet
                //     });
                // }
            });

            // Clean up the listener when the component unmounts or dependencies change
            return () => {
                socketConnection.off('conversation');
            };
        }
    }, [socketConnection, user, setAllUser,soundEnabled]);  // No need to include audioRef or soundEnabled as dependencies because useRef doesn’t cause re-renders

    const handleLogout = () => {
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
    }


    function getFileIcon(fileType) {

        const iconMap = {
            'pdf': FaFilePdf,
            'doc': FaFileWord,
            'docx': FaFileWord,
            'xls': FaFileExcel,
            'xlsx': FaFileExcel,
            'txt': FaFileAlt,
            'jpg': FaFileImage,
            'jpeg': FaFileImage,
            'png': FaFileImage,
            'gif': FaFileImage,
            'zip': FaFileArchive,
            'rar': FaFileArchive,
            'mp3': FaFileAudio,
            'mp4': FaFileVideo,
            'ppt': FaFilePowerpoint,
            'pptx': FaFilePowerpoint,
            'html': FaFileCode,
            'css': FaFileCode,
            'js': FaFileCode
        };

        // Default icon if file type is not recognized
        const DefaultIcon = FaFileAlt; // Using a generic file icon as the default

        const IconComponent = iconMap[fileType.toLowerCase()] || DefaultIcon;
        return <IconComponent />;
    }



    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div>
                    <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
                        <IoChatbubbleEllipses
                            size={20}
                        />
                    </NavLink>

                    <div title='add friend' onClick={() => setOpenSearchUser(true)} className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' >
                        <FaUserPlus size={20} />
                    </div>
                </div>

                <div className='flex flex-col items-center'>
                    <button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>
                        <Avatar
                            width={40}
                            height={40}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button title='logout' className='w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded' onClick={handleLogout}>
                        <span className='-ml-2'>
                            <BiLogOut size={20} />
                        </span>
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='h-16 flex items-center'>
                    <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
                </div>
                <div className='bg-slate-200 p-[0.5px]'></div>

                <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {
                        allUser.length === 0 && (
                            <div className='mt-12'>
                                <div className='flex justify-center items-center my-4 text-slate-500'>
                                    <FiArrowUpLeft
                                        size={50}
                                    />
                                </div>
                                <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with.</p>
                            </div>
                        )
                    }

                    {
                        allUser.map((conv, index) => {
                            return (
                                <NavLink to={"/" + conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer'>
                                    <div>
                                        <Avatar
                                            imageUrl={conv?.userDetails?.profile_pic}
                                            name={conv?.userDetails?.name}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div>
                                        <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.userDetails?.name}</h3>
                                        <div className='text-slate-500 text-xs flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                {
                                                    conv?.lastMsg?.imageUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaImage /></span>
                                                            {!conv?.lastMsg?.text && <span>Image</span>}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.videoUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaVideo /></span>
                                                            {!conv?.lastMsg?.text && <span>Video</span>}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.audioUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span><FaFileAudio /></span>
                                                            {!conv?.lastMsg?.text && <span>Audio</span>}
                                                        </div>
                                                    )
                                                }
                                                {
                                                    conv?.lastMsg?.fileUrl && (
                                                        <div className='flex items-center gap-1'>
                                                            <span>{getFileIcon(conv?.lastMsg?.fileType)}</span>
                                                            {!conv?.lastMsg?.text && <span>{conv?.lastMsg?.fileName}</span>}
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <p className='text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>

                                            <div>
                                                <button onClick={toggleSound} className="flex items-center justify-center space-x-2">
                                                    {soundEnabled ? (
                                                        <><IoVolumeHigh className="text-xl" /><span>Disable Sound</span></>
                                                    ) : (
                                                        <><IoVolumeMute className="text-xl" /><span>Enable Sound</span></>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        Boolean(conv?.unseenMsg) && (
                                            <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                        )
                                    }

                                </NavLink>
                            )
                        })
                    }
                </div>
            </div>

            {/**edit user details*/}
            {
                editUserOpen && (
                    <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
                )
            }

            {/**search user */}
            {
                openSearchUser && (
                    <SearchUser onClose={() => setOpenSearchUser(false)} />
                )
            }

        </div>
    )
}

export default Sidebar
