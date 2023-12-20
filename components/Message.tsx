import { RefObject, useEffect } from "react";
// import { DocumentData } from "firebase/firestore";
import { DocumentDuplicateIcon, TrashIcon } from "@heroicons/react/24/solid";
import parse from 'html-react-parser';
import AnimationMessage from "./AnimationMessage";
import BouncingDotsLoader from "./loading";
import { MessageType } from "./Chat";

type Props = {
  message: MessageType,
  loading: boolean,
  deleteMessage: (id: number) => void,
  scrollRef: RefObject<HTMLDivElement>,
  type: string
}

const Message = ({ message, loading, deleteMessage, scrollRef, type }: Props) => {
  useEffect(() => {
    scrollRef.current?.scrollIntoView(false);
  })

  const handleControl = (action: string) => {
    if (action === 'copy') {
      navigator.clipboard.writeText(message.message);
    }
    else if (action === 'delete') {
      deleteMessage(message.id);
    }
  }

  const convertMarkdownLinksToHTML = (text: string) => {
    // Regular expression to match the Markdown link format
    // This regex is more forgiving and can handle some irregularities in the link format
    // const markdownLinkRegex = /\[([^\]]+)\]\(([^)\s]+)\)?/g;
    const markdownLinkRegex = /https:\/\/(\S+(\/\S+)*(\/)?)/g;

    // Replace Markdown links with HTML <a> tags
    return text.replace(markdownLinkRegex, '<a href="https://$1" className="text-white underline underline-offset-2 hover:text-sky-700">Google Map</a>');
  }

  return (
    <div className="flex flex-col mt-10">
      <div className={`flex flex-col gap-4 ${message.sender === "bot" ? "" : "items-end"}`}>
        <div className="md:max-w-[85%] max-w-[90%] text-slate-400 flex flex-col w-fit relative">
          <div>
            {
              message.sender === 'bot' ? (
                <>
                  <div className="w-14 h-14 absolute -top-11 left-1 rounded-full bg-slate-900"></div>
                  <img src="/avatar.jpg" className="w-12 h-12 rounded-full absolute -top-10 left-2" alt="avatar" />
                  <div className="px-4 py-2 rounded-md text-sky-400 bg-sky-400/10 flex flex-col gap-1">
                    {
                      type === "history" ? (
                        <>
                          <p className="text-lg">
                            <span>
                              {parse(convertMarkdownLinksToHTML(message.message).replaceAll(/\n(\d\.\s)/g, '<br />$1 '))}
                              <br />
                            </span>

                          </p>
                          <div className="flex gap-4 mb-2 justify-end">
                            <button className="hover:text-sky-700" onClick={() => handleControl('copy')}>
                              <DocumentDuplicateIcon width="18px" height="18px" />
                            </button>
                            <button className="hover:text-sky-700" onClick={() => handleControl('delete')}>
                              <TrashIcon width="18px" height="18px" />
                            </button>
                          </div>
                        </>
                      ) : (
                        message.message === 'loading...' && loading ? (
                          <BouncingDotsLoader />
                        ) : (
                          <>
                            <AnimationMessage text={convertMarkdownLinksToHTML(message.message)} scrollRef={scrollRef} closer={message.closer} />
                            {
                              message.id !== 0 && (
                                <div className="flex gap-4 mb-2 justify-end">
                                  <button className="hover:text-sky-700" onClick={() => handleControl('copy')}>
                                    <DocumentDuplicateIcon width="18px" height="18px" />
                                  </button>
                                  <button className="hover:text-sky-700" onClick={() => handleControl('delete')}>
                                    <TrashIcon width="18px" height="18px" />
                                  </button>
                                </div>
                              )
                            }
                          </>
                        )
                      )
                    }
                  </div>
                </>
              ) : (
                <div>
                  <div className="px-4 py-2 rounded-md text-white bg-slate-400/10 flex flex-col gap-1">
                    <p className="text-lg">{message.message}</p>
                    <div className="flex gap-4 mb-2 justify-end">
                      <button className="hover:text-sky-700" onClick={() => handleControl('copy')}>
                        <DocumentDuplicateIcon width="18px" height="18px" />
                      </button>
                      <button className="hover:text-sky-700" onClick={() => handleControl('delete')}>
                        <TrashIcon width="18px" height="18px" />
                      </button>
                    </div>
                  </div>
                  <div className="w-14 h-14 absolute -top-11 right-1 rounded-full bg-slate-900"></div>
                  <img src="/avatar1.jpg" className="w-12 h-12 rounded-full absolute -top-10 right-2" alt="avatar" />
                </div>
              )
            }
          </div>
          {/* <div className={`px-4 ${isControlOpen ? "text-slate-900" : ""}`}>Today, 12:30</div> */}
        </div>
      </div>
    </div>
  );
};

export default Message;
