'use client';

import Message from "./Message";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MicrophoneIcon, PaperAirplaneIcon, ShareIcon } from "@heroicons/react/24/solid";
import { Configuration, OpenAIApi } from "openai";
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type PrePrompt = {
  title: string,
  prompt: string
}

type History = {
  id: number,
  user_id: string,
  user_query: string,
  response: string
}

export type MessageType = {
  id: number,
  sender: string,
  message: string,
  closer?: string
}

// type AssistantType = {
//   id: number,
//   assistant_name: string
// }

type Props = {
  chatId: string[];
};

const Chat = ({ chatId }: Props) => {
  const assistant_id = chatId[0];
  const chat_id = chatId[1] ?? "";
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [prePrompt, setPrePrompt] = useState<PrePrompt[]>();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<History[]>([]);
  // const [assistants, setAssistants] = useState<AssistantType[]>();
  // const [selectedAssistant, setSelectedAssistant] = useState('-1');
  // const { data: session } = useSession();

  //Loading environmental variables
  const SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const CLIENT_ENDPOINT = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
  const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const configuration = new Configuration({
    apiKey: API_KEY,
  });
  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const sendMessage = () => {
    setMessages(prev => [...prev, {
      id: prev.length ? prev[prev.length - 1].id + 1 : 1,
      sender: "you",
      message: prompt
    }])
    setMessages(prev => [...prev, {
      id: prev[prev.length - 1].id + 1,
      sender: "bot",
      message: 'loading...'
    }])
    setPrompt("");
    sendQuestion(prompt);
  }

  const sendPrePrompt = (prePrompt: PrePrompt) => {
    setMessages(prev => [...prev, {
      id: prev.length ? prev[prev.length - 1].id + 1 : 1,
      sender: "you",
      message: prePrompt.title
    }])
    setMessages(prev => [...prev, {
      id: prev[prev.length - 1].id + 1,
      sender: "bot",
      message: 'loading...'
    }])
    sendQuestion(prePrompt.prompt)
  }

  const sendQuestion = async (message: string) => {
    resetTranscript();
    setLoading(true);

    await axios.post(`${SERVER_ENDPOINT}/user_query`, {
      chat_id: chat_id,
      assistant_id: assistant_id,
      query: message
    })
      .then(res => {
        if (res.status === 201 && res.data) {
          const newValue = {
            id: res.data.chat_id,
            sender: "bot",
            message: res.data?.response,
            closer: res.data?.closer
          };
          setMessages(preArray => [...preArray.slice(0, -1), newValue]);
          setPrePrompt(res.data?.pre_prompts.map((one: string) => {
            return {
              title: one,
              prompt: one
            }
          }))
          if (chat_id !== res.data.chat_id)
            router.push(`/${assistant_id}/${res.data.chat_id}`);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        setMessages(prev => prev.filter(one => one.message !== 'loading...'));
      })

    // await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `${message}`,
    //   temperature: 0, // Higher values means the model will take more risks.
    //   max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    //   top_p: 1, // alternative to sampling with temperature, called nucleus sampling
    //   frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    //   presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    // }, {
    //   headers: {
    //     'Authorization': 'Bearer ' + String(API_KEY)
    //   }
    // }).then(response => {
    //   if (response.data.choices[0].text) {
    //     console.log(messages);
    //     const newValue = {
    //       id: messages.length+1,
    //       sender: "bot",
    //       message: response.data.choices[0].text ? response.data.choices[0].text : ""
    //     };
    //     setMessages(preArray => [...preArray.slice(0, -1), newValue]);
    //   }
    //   setLoading(false);
    // }).catch(err => {
    //   console.log(err);
    //   setLoading(false);
    //   setMessages(prev => prev.filter(one => one.message !== 'loading...'));
    // });
  }

  const deleteMessage = (id: number) => {
    axios.post(`${SERVER_ENDPOINT}/del_message`, {
      chat_id: id
    }).then(res => {
      if (res.status === 201 && res.data) {
        setMessages(prev => prev.filter(message => message.id != res.data.chat_id));
        setHistory(prev => prev.filter(message => message.id != res.data.chat_id));
      }
    })
      .catch(err => console.log(err))
  }

  const handleMic = () => {
    if (!browserSupportsSpeechRecognition) {
      return <div>Speech recognition is not supported by your browser</div>;
    }
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  }

  // const changeSelectedAssistant = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedAssistant(e.target.value)
  // }

  const handleShare = () => {
    navigator.clipboard.writeText(CLIENT_ENDPOINT + '/' + assistant_id + '/' + chat_id);
    toast.success('Link copied!', {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  useEffect(() => {
    axios.post(`${SERVER_ENDPOINT}/get_chat_history`, {
      user_id: chat_id
    }, {
      headers: {
        'ngrok-skip-browser-warning': "1",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then(res => {
        if (res.status === 201 && res.data) {
          if (res.data.result === 'Server Error!') {
            setMessages([{
              id: 0,
              sender: 'bot',
              message: "Good Day! I'm your HealthCare Concierge, how may I help you?"
            }])
          }
          else
            setHistory(res.data)
        }
        if (res.status === 200 && res.data) {
          setMessages([{
            id: 0,
            sender: 'bot',
            message: "Good Day! I'm your HealthCare Concierge, how may I help you?"
          }])
        }
      })
      .catch(err => console.log(err));

    // axios.get(`${SERVER_ENDPOINT}/get_assistant`, {
    //   headers: {
    //     'ngrok-skip-browser-warning': "1",
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //   }
    // })
    //   .then(res => {
    //     if (res.status === 200 && res.data) {
    //       setAssistants(res.data);
    //       setSelectedAssistant(res.data[0].id);
    //     }
    //   })
    //   .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    axios.get(`${SERVER_ENDPOINT}/get_initial_prompts`, {
      params: {
        assistant_id: assistant_id
      },
      headers: {
        'ngrok-skip-browser-warning': "1",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })
      .then(res => {
        if (res.status === 200 && res.data) {
          setPrePrompt(res.data);
        }
      })
      .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    if (!loading) {
      setPrompt(transcript);
    }
  }, [transcript])

  return (
    <>
      <div className="flex justify-end gap-2">
        {/* <select className="bg-black text-sky-400 rounded-md p-2 text-sm border-none" value={selectedAssistant} onChange={e => changeSelectedAssistant(e)}>
          {
            assistants && assistants.map(assistant => (
              <option key={assistant.id} value={assistant.id}>{assistant.assistant_name}</option>
            ))
          }
        </select> */}
        <button
          aria-label="Share"
          className="bg-black text-sky-400 rounded-full p-2 flex items-center gap-1 hover:text-sky-700 sm:rounded-md"
          onClick={() => handleShare()}
        >
          <ShareIcon className="w-4 h-4" />
          <p className="hidden sm:block text-sm">Share</p>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-0">
        {history.map((message, index) => (
          <div key={index}>
            <Message message={{ id: message.id, sender: 'you', message: message.user_query }} loading={loading} deleteMessage={deleteMessage} scrollRef={listRef} type="history" />
            <Message message={{ id: message.id, sender: 'bot', message: message.response }} loading={loading} deleteMessage={deleteMessage} scrollRef={listRef} type="history" />
          </div>
        ))}
        {messages.map((message, index) => (
          <Message key={index} message={message} loading={loading} deleteMessage={deleteMessage} scrollRef={listRef} type="message" />
        ))}
        <div ref={listRef}></div>
      </div>

      <div className="flex flex-col gap-2">
        {
          !loading && (
            <ul className="px-4 items-center bg-black rounded-md">
              {
                prePrompt && prePrompt.map((one, index) => (
                  <li key={index} className="text-sky-400 cursor-pointer border-b border-b-sky-400/10 hover:text-sky-700" onClick={() => sendPrePrompt(one)}>
                    {one.title}
                  </li>
                ))
              }
            </ul>
          )
        }
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
              aria-label="microphone"
              className="bg-transparent hover:opacity-50 text-white font-bold px-0 py-1 rounded disabled:cursor-not-allowed flex justify-center items-center"
              onClick={handleMic}
            >
              {
                listening ? (
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
              aria-label="send message"
              disabled={!prompt || loading}
              className="bg-transparent hover:opacity-50 text-white font-bold px-0 py-1 rounded disabled:cursor-not-allowed hidden sm:block"
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