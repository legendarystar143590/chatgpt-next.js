"use client";

// import { collection, orderBy, query } from "firebase/firestore";
// import { useSession } from "next-auth/react";
// import { useCollection } from "react-firebase-hooks/firestore";
// import { db } from "../firebase/firebase";
import Message from "./Message";
import { useEffect, useState } from "react";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Configuration, OpenAIApi } from "openai";
import useSpeechToText from "react-hook-speech-to-text";

const Chat = () => {
  const [messages, setMessages] = useState([{
    id: 0,
    message: "I am a chat gpt. I can't understand human's emtion. I am a chat gpt. I can't understand human"
  }]);
  const [prePrompt, setPrePrompt] = useState([
    "Give me a summary of ChatGPT",
    "Write poem about ChatGPT",
    "more"
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  // const { data: session } = useSession();

  const API_KEY = process.env.OPENAI_API_KEY;
  const configuration = new Configuration({
    apiKey: API_KEY,
  });
  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  const sendMessage = () => {
    setMessages(prev => [...prev, {
      id: prev[prev.length - 1].id + 1,
      message: prompt
    }]);

    sendQuestion(prompt);
    setPrompt("");
  }

  const sendQuestion = async (message: string) => {
    const loadingValue = messages;
    loadingValue.push({
      id: messages[messages.length - 1].id + 1,
      message: message
    });
    loadingValue.push({
      id: messages[messages.length - 1].id + 1,
      message: 'loading...'
    });
    setMessages(loadingValue);
    setPrompt("");
    setLoading(true);

    const response = await openai.createCompletion({
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
    });

    if (response.data.choices[0].text) {
      const newValue = messages.map((value) => {
        if (value.id === messages.length - 1) {
          return {
            id: value.id,
            message: response.data.choices[0].text ? response.data.choices[0].text : ""
          };
        }
        return value;
      });
      setMessages(newValue);
    }
    setLoading(false);
  }

  const handleMic = () => {
    if (error) {
      return <p>Web Speech API is not available in this browser.</p>;
    }
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  }

  useEffect(() => {
    if (results.length !== 0)
      // @ts-ignore
      setPrompt(prompt + "" + results[results.length - 1].transcript);
  }, [results.length]);

  return (
    <>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {messages.map((message) => (
          <Message key={message.id} id={message.id} message={message.message} loading={loading} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 px-4 items-center">
          {
            prePrompt.map((one, index) => (
              <button key={index} className="bg-slate-400/10 text-white rounded-lg p-2 w-fit" onClick={() => sendQuestion(one)}>
                {one}
              </button>
            ))
          }
        </div>
        <div className="bg-slate-400/10 text-gray-400 rounded-lg text-md">
          <div className="px-4 py-2 space-x-5 flex">
            <input
              className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300 text-white"
              disabled={false}
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
              disabled={false || !prompt}
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
