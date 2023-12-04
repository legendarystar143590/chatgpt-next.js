// import { DocumentData } from "firebase/firestore";

type Props = {
  message: string;
};

const Message = ({ message }: Props) => {
  // const isChatGPT = message.user.name === "ChatGPT";
  const isChatGPT = true;

  return (
    <div className={`py-5 text-white ${isChatGPT && "bg-[#434654]"}`}>
      <div className="flex space-x-5 px-10 max-w-2xl mx-auto">
        {/* <img src={message.user.avatar} alt="pic" className="h-8 w-8" /> */}
        <p className="pt-1 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Message;
