'use client';
// import { collection, orderBy, query } from "firebase/firestore";
// import { useSession } from "next-auth/react";
// import { useCollection } from "react-firebase-hooks/firestore";
// import { db } from "../firebase/firebase";
import Message from "./Message";
import { useEffect, useState } from "react";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Configuration, OpenAIApi } from "openai";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Chat = () => {
  const [messages, setMessages] = useState([{
    id: 0,
    sender: "bot",
    message: "I am a chat gpt."
  }]);
  const [prePrompt, setPrePrompt] = useState([
    "Give me a summary of ChatGPT. Give me a summary of ChatGPT.",
    "Write poem about ChatGPT",
    "Give me the financial status of hospitals"
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  // const { data: session } = useSession();

  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const configuration = new Configuration({
    apiKey: API_KEY,
  });
  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);

  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition
  // } = useSpeechRecognition();

  const sendMessage = () => {
    sendQuestion(prompt);
    setPrompt("");
  }

  const sendQuestion = async (message: string) => {
    setMessages(prev => [...prev, {
      id: prev[prev.length - 1].id + 1,
      sender: "you",
      message: message
    }])
    setMessages(prev => [...prev, {
      id: prev[prev.length - 1].id + 1,
      sender: "bot",
      message: 'loading...'
    }])
    setPrompt("");
    setLoading(true);

    await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    }, {
      headers: {
        'Authorization': 'Bearer ' + String(API_KEY)
      }
    }).then(response => {
      if (response.data.choices[0].text) {
        console.log(messages);
        const newValue = {
          id: messages[messages.length - 1].id,
          sender: "bot",
          message: response.data.choices[0].text ? response.data.choices[0].text : ""
        };
        setMessages(preArray => [...preArray.slice(0, -1), newValue]);
      }
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
      setMessages(prev => prev.filter(one => one.message !== 'loading...'));
    });
  }

  const deleteMessage = (id: number) => {
    setMessages(prev => prev.filter(message => message.id != id));
  }

  const handleMic = () => {
    // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    //   return <div>Speech recognition is not supported by your browser</div>;
    // }
    // if (isRecording) {
    //   SpeechRecognition.stopListening();
    //   setIsRecording(false);
    // } else {
    //   SpeechRecognition.startListening({ continuous: true });
    //   setIsRecording(true);
    // }
  }

  // useEffect(() => {
  //   if (transcript !== null)
  //     // @ts-ignore
  //     setPrompt(prompt + "" + transcript);
  // }, [transcript]);

  return (
    <>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-0 sm:pt-6">
        {messages.map((message, index) => (
          <Message key={index} message={message} loading={loading} deleteMessage={deleteMessage} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <ul className="px-4 items-center">
          {
            prePrompt.map((one, index) => (
              <li key={index} className="text-sky-400 cursor-pointer border-b border-b-sky-400/10 hover:text-sky-700" onClick={() => sendQuestion(one)}>
                {one}
              </li>
            ))
          }
        </ul>
        <div className="bg-slate-400/10 text-gray-400 rounded-lg text-md">
          <div className="px-4 py-2 space-x-5 flex">
            <input
              className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300 text-white"
              disabled={loading}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              type="text"
              placeholder="Type your message here..."
            />
            <button
              className="bg-transparent hover:opacity-50 text-white font-bold px-0 py-1 rounded disabled:cursor-not-allowed flex justify-center items-center"
              onClick={handleMic}
            >
              {
                isRecording ? (
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></span>
                  </span>
                ) : (
                  <MicrophoneIcon className="h-5 w-5" />
                )
              }
            </button>
            <button
              disabled={!prompt || loading}
              className="bg-transparent hover:opacity-50 text-white font-bold px-0 py-1 rounded disabled:cursor-not-allowed flex justify-center hidden sm:block"
              onClick={sendMessage}
            >
              <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;