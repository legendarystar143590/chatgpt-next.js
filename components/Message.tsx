// import { DocumentData } from "firebase/firestore";
import AnimationMessage from "./AnimationMessage";
import BouncingDotsLoader from "./loading";

type Props = {
  id: number;
  message: string;
  loading: boolean
};

const Message = ({ id, message, loading }: Props) => {
  // const isChatGPT = message.user.name === "ChatGPT";
  const isChatGPT = true;

  return (
    <div className={`flex flex-col gap-4 ${id % 2 === 0 ? "" : "items-end"}`}>
      <div className="lg:max-w-[70%] max-w-[90%] text-slate-400 flex flex-col w-fit">
        {
          id % 2 === 0 ? (
            <div className="px-4 py-2 rounded-md text-sky-400 bg-sky-400/10">
              {
                message === 'loading...' && loading ? (
                  <BouncingDotsLoader />
                ) : (
                  <AnimationMessage text={message} />
                )
              }
            </div>
          ) : (
            <div className="px-4 py-2 rounded-md text-white bg-slate-400/10">
              <p className="text-lg">{message}</p>
            </div>
          )
        }
        <div className="px-4">{'Today, 12:30'}</div>
      </div>
    </div>
  );
};

export default Message;
