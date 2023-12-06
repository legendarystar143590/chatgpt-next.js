// import { DocumentData } from "firebase/firestore";
import { DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/solid";
import AnimationMessage from "./AnimationMessage";
import BouncingDotsLoader from "./loading";
import { useState } from "react";

type Message = {
  id: number,
  sender: string,
  message: string
}

type Props = {
  message: Message,
  loading: boolean, 
  deleteMessage: (id: number) => void
}

const Message = ({ message, loading, deleteMessage }: Props) => {
  const [isControlOpen, setIsControlOpen] = useState(false);
  
  const handleControl = (action: string) => {
    if(action === 'copy') {
      setIsControlOpen(false);
    }
    else if(action === 'delete') {
      deleteMessage(message.id);
    }
    navigator.clipboard.writeText(message.message);
  }

  return (
    <div className="flex flex-col mt-10 sm:mt-4">
      <div className={`flex flex-col gap-4 ${message.sender === "bot" ? "" : "items-end"}`}>
        <div className="md:max-w-[70%] max-w-[90%] text-slate-400 flex flex-col w-fit relative">
          <div>
            {
              message.sender === 'bot' ? (
                <>
                  <div className="w-14 h-14 absolute -top-11 left-1 rounded-full bg-slate-900"></div>
                  <img src="/avatar.jpg" className="w-12 h-12 rounded-full absolute -top-10 left-2" alt="avatar" />
                  <div
                    className="px-4 py-2 rounded-md text-sky-400 bg-sky-400/10"
                    onMouseEnter={() => setIsControlOpen(true)}
                    onMouseLeave={() => setIsControlOpen(false)}
                  >
                    {
                      message.message === 'loading...' && loading ? (
                        <BouncingDotsLoader />
                      ) : (
                        <AnimationMessage text={message.message} />
                      )
                    }
                  </div>
                </>
              ) : (
                <div>
                  <div
                    className="px-4 py-2 rounded-md text-white bg-slate-400/10"
                    onMouseEnter={() => setIsControlOpen(true)}
                    onMouseLeave={() => setIsControlOpen(false)}
                  >
                    <p className="text-lg">{message.message}</p>
                  </div>
                  <div className="w-14 h-14 absolute -top-11 right-1 rounded-full bg-slate-900"></div>
                  <img src="/avatar1.jpg" className="w-12 h-12 rounded-full absolute -top-10 right-2" alt="avatar" />
                </div>
              )
            }
            {
              message.id!== 0 && isControlOpen && (
                <div
                  className={`text-lg absolute w-[107px] md:top-0 md:mt-0 
                              ${message.sender === "bot" ? "md:-right-24 md:pl-4 mt-1" : "md:-left-24 md:pr-4 right-0 mt-1"}`}
                  onMouseEnter={() => setIsControlOpen(true)}
                  onMouseLeave={() => setIsControlOpen(false)}
                >
                  <div className={`p-2 h-fit rounded-md flex flex-col gap-2 ${message.sender === "bot" ? "bg-sky-400/10 text-sky-400" : "bg-slate-400/10 text-white"}`}>
                    <button className="flex items-center gap-2 hover:text-sky-700" onClick={() => handleControl('copy')}>
                      <DocumentDuplicateIcon width="16px" height="16px" />
                      <p>Copy</p>
                    </button>
                    <button className="flex items-center gap-2 hover:text-sky-700" onClick={() => handleControl('delete')}>
                      <TrashIcon width="16px" height="16px" />
                      <p>Delete</p>
                    </button>
                  </div>
                </div>
              )
            }
          </div>
          <div className={`px-4 ${isControlOpen ? "text-slate-900" : ""}`}>Today, 12:30</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
