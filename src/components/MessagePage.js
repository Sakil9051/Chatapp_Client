import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoMdSend } from "react-icons/io";
import { MdDownload } from 'react-icons/md';
import { FaFile } from 'react-icons/fa';
import { IoPlay, IoPause } from 'react-icons/io5';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileImage, FaFileAudio, FaFileVideo, FaFileArchive, FaFileAlt, FaFileCode } from 'react-icons/fa';
import moment from 'moment'

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: "",
    fileType: "",
    fileName: ""
  })
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url
      }
    })
  }
  const handleClearUploadImage = () => {
    setMessage(preve => {
      return {
        ...preve,
        imageUrl: ""
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url
      }
    })
  }
  const handleClearUploadVideo = () => {
    setMessage(preve => {
      return {
        ...preve,
        videoUrl: ""
      }
    })
  }

  const handleUploadAudio = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return {
        ...preve,
        audioUrl: uploadPhoto.url,
        fileType: file.name.split('.').pop(), // Sets MIME type or file extension if type is not available
        fileName: file.name
      }
    })
  }
  const handleClearUploadAudio = () => {
    setMessage(preve => {
      return {
        ...preve,
        audioUrl: ""
      }
    })
  }



  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Ensure a file was selected

    setLoading(true);
    const uploadResponse = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    console.log(file);

    setMessage(prev => {
      return {
        ...prev,
        fileUrl: uploadResponse.url,
        fileType: file.name.split('.').pop(), // Sets MIME type or file extension if type is not available
        fileName: file.name
      }
    });
  }

  const handleClearUploadFile = () => {
    setMessage(preve => {
      return {
        ...preve,
        fileUrl: ""
      }
    })
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)

      socketConnection.emit('seen', params.userId)

      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        console.log('message data', data)
        setAllMessage(data)
      })


    }
  }, [socketConnection, params?.userId, user])

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setMessage(preve => {
      return {
        ...preve,
        text: value
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (message.text || message.imageUrl || message.videoUrl || message.audioUrl || message.fileType || message.fileName || message.fileUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          audioUrl: message.audioUrl,
          fileUrl: message.fileUrl,
          fileType: message.fileType,
          fileName: message.fileName,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
          audioUrl: "",
          fileUrl: "",
          fileType: "",
          fileName: ""
        })
      }
    }
  }


  const handleDownload = (url) => {
    // Create an anchor element to initiate the download
    const link = document.createElement('a');
    document.body.appendChild(link);  // Append the link to the document body
    link.href = url;  // Set the href to the URL for downloading the file

    // Set the target to '_blank' to open in a new tab
    link.target = '_blank';
    link.rel = 'noopener noreferrer';  // This is important for security in using target='_blank'

    // Programmatically trigger the click on the link to open in new tab
    link.click();

    // Clean up by removing the link from the DOM
    document.body.removeChild(link);
  };



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



  const AudioPlayer = ({ msg }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef(null);
  
    const togglePlayPause = () => {
      if (audioRef.current) {
        const { current } = audioRef;
        if (current.paused) {
          current.play();
          setIsPlaying(true);
        } else {
          current.pause();
          setIsPlaying(false);
        }
      }
    };
  
    // Effect to handle audio ended event to reset play state
    useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
        const handleAudioEnd = () => setIsPlaying(false);
        audio.addEventListener('ended', handleAudioEnd);
  
        return () => {
          audio.removeEventListener('ended', handleAudioEnd);
        };
      }
    }, []);
  
    return (
      msg?.audioUrl && (
        <div className='relative flex flex-col items-center p-2 bg-white rounded shadow-md w-full min-w-[70vw] sm:min-w-[300px]'>
          {/* Display the audio name if available */}
          <div className='text-sm text-gray-800 w-full pt-6 pb-1'>
            {msg.fileName || 'Unknown Audio'}
          </div>
          <div className='flex-grow w-full' style={{ paddingRight: '40px' }}>
            <audio ref={audioRef} src={msg.audioUrl} className='w-full'></audio>
            <div className="controls flex gap-2 mt-2">
              {isPlaying ? (
                <button 
                  onClick={togglePlayPause}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <IoPause className="text-xl" />
                </button>
              ) : (
                <button 
                  onClick={togglePlayPause}
                  className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out transform hover:scale-110"
                >
                  <IoPlay className="text-xl" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => handleDownload(msg.audioUrl)}
            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded transition duration-300 ease-in-out hover:bg-opacity-70">
            <MdDownload />
          </button>
        </div>
      )
    );
  };


  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {
                dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>

        <div >
          <button className='cursor-pointer hover:text-primary'>
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/***show all message */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>


        {/**all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>

          {
            allMessage.map((msg, index) => {
              return (
                <div key={index} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className='w-full relative'>
                    {msg?.imageUrl && (
                      <div className='md:w-[20vw] max-sm:w-[70vw]'>
                        <img
                          src={msg?.imageUrl}
                          className='w-full h-full object-scale-down'
                        />
                        <button
                          onClick={() => handleDownload(msg.imageUrl)}
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded">
                          <MdDownload />
                        </button>
                      </div>
                    )}
                    {msg?.videoUrl && (
                      <div className='md:w-[20vw] max-sm:w-[70vw]'>
                        <video
                          src={msg.videoUrl}
                          className='w-full h-full object-scale-down'
                          controls
                        />
                        <button
                          onClick={() => handleDownload(msg.videoUrl)}
                          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-1 rounded">
                          <MdDownload />
                        </button>
                      </div>
                    )}

                    {msg?.audioUrl && (
                      <AudioPlayer msg={msg}/>
                    )}





                    {msg?.fileUrl && (
                      <div className='relative flex items-center space-x-3 p-2 bg-white rounded shadow-md w-full max-w-md md:max-w-lg'>
                        <div className='flex-shrink-0'>
                          {getFileIcon(msg.fileType)}
                        </div>
                        <div className='flex-grow overflow-hidden'>
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate block"
                          >
                            {msg.fileName || 'Download File'}
                          </a>
                        </div>
                        <button
                          onClick={() => handleDownload(msg.fileUrl)}
                          className="ml-3 text-white bg-black bg-opacity-50 p-1 rounded">
                          <MdDownload />
                        </button>
                      </div>
                    )}




                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('DD/MM/YYYY, hh:mm A')}</p>
                </div>
              )
            })
          }

        </div>


        {/**upload Image display */}
        {
          message.imageUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <img
                  src={message.imageUrl}
                  alt='uploadImage'
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                />
              </div>
            </div>
          )
        }

        {/**upload video display */}
        {
          message.videoUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3'>
                <video
                  src={message.videoUrl}
                  className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }


        {/** Upload audio display */}
        {
          message.audioUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center'>
              <div className='relative bg-white rounded p-3 shadow flex justify-center items-center max-w-2xl w-full'>
                <audio
                  src={message.audioUrl}
                  controls
                  autoPlay
                  className='w-full'
                />
              </div>
            </div>
          )
        }



        {/** Upload file display */}
        {
          message.fileUrl && (
            <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
              <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadFile}>
                <IoClose size={30} />
              </div>
              <div className='bg-white p-3 flex items-center'>
                <div className='m-2'>
                  {getFileIcon(message.fileType)}
                </div>
                <div className='text-sm text-gray-700'>
                  {message.fileName || 'Unnamed File'}
                </div>
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
              <Loading />
            </div>
          )
        }
      </section>

      {/**send message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative '>
          <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20} />
          </button>

          {/**video and image */}
          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-purple-500'>
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>
                  <label htmlFor='uploadAudio' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-green-500'>
                      <FaFileAudio size={18} />
                    </div>
                    <p>Audio</p>
                  </label>
                  <label htmlFor='uploadFile' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-blue-500'>
                      <FaFile size={18} />
                    </div>
                    <p>File</p>
                  </label>

                  <input
                    type='file'
                    id='uploadImage'
                    onChange={handleUploadImage}
                    className='hidden'
                    accept='image/*'
                  />
                  <input
                    type='file'
                    id='uploadVideo'
                    onChange={handleUploadVideo}
                    className='hidden'
                    accept='video/*'
                  />
                  <input
                    type='file'
                    id='uploadAudio'
                    onChange={handleUploadAudio}
                    className='hidden'
                    accept='audio/*'
                  />
                  <input
                    type='file'
                    id='uploadFile'
                    onChange={handleUploadFile}
                    className='hidden'
                  />
                </form>
              </div>
            )
          }


        </div>

        {/**input box */}
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-primary hover:text-secondary'>
            <IoMdSend size={28} />
          </button>
        </form>

      </section>



    </div>
  )
}

export default MessagePage
