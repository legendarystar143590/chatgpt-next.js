// import { DocumentData } from "firebase/firestore";
import { DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/solid";
import AnimationMessage from "./AnimationMessage";
import BouncingDotsLoader from "./loading";
import { useState } from "react";

type Props = {
  id: number;
  message: string;
  loading: boolean
};

const Message = ({ id, message, loading }: Props) => {
  const [isControlOpen, setIsControlOpen] = useState(false);
  // const isChatGPT = message.user.name === "ChatGPT";
  console.log(isControlOpen);

  return (
    <div className="flex flex-col pt-10">
      <div className={`flex flex-col gap-4 ${id % 2 === 0 ? "" : "items-end"}`}>
        <div className="lg:max-w-[70%] max-w-[90%] text-slate-400 flex flex-col w-fit relative">
          <div>
            {
              id % 2 === 0 ? (
                <>
                  <div className="w-14 h-14 absolute -top-11 left-1 rounded-full bg-slate-900"></div>
                  <img src="/avatar.jpg" className="w-12 h-12 rounded-full absolute -top-10 left-2" alt="avatar" />
                  <div
                    className="px-4 py-2 rounded-md text-sky-400 bg-sky-400/10"
                    onMouseEnter={() => setIsControlOpen(true)}
                    onMouseLeave={() => setIsControlOpen(false)}
                  >
                    {
                      message === 'loading...' && loading ? (
                        <BouncingDotsLoader />
                      ) : (
                        <AnimationMessage text={message} />
                      )
                    }
                  </div>
                </>
              ) : (
                <div>
                  <div className="px-4 py-2 rounded-md text-white bg-slate-400/10">
                    <p className="text-lg">{message}</p>
                  </div>
                  <div className="w-14 h-14 absolute -top-11 right-1 rounded-full bg-slate-900"></div>
                  <img src="/avatar1.jpg" className="w-12 h-12 rounded-full absolute -top-10 right-2" alt="avatar" />
                </div>
              )
            }
            {
              isControlOpen && (
                <div
                  className={`absolute top-0 ${id % 2 ? "-left-24 pr-4" : "-right-24 pl-4"}`}
                  onMouseEnter={() => setIsControlOpen(true)}
                  onMouseLeave={() => setIsControlOpen(false)}
                >
                  <div className={`py-1 px-2 h-fit rounded-md flex flex-col gap-1 ${id % 2 ? "bg-slate-400/10 text-white" : "bg-sky-400/10 text-sky-400"}`}>
                    <button className="flex items-center gap-2 hover:text-sky-700">
                      <DocumentDuplicateIcon width="16px" height="16px" />
                      <p>copy</p>
                    </button>
                    <button className="flex items-center gap-2 hover:text-sky-700">
                      <TrashIcon width="16px" height="16px" />
                      <p>delete</p>
                    </button>
                  </div>
                </div>
              )
            }
          </div>
          <div className="px-4">{'Today, 12:30'}</div>
        </div>
      </div>
    </div>
  );
};

export default Message;
