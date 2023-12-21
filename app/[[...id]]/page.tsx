import Chat from "../../components/Chat";

type Props = {
  params: {
    id: string[];
  };
};

const HomePage = ({ params: { id } }: Props) => {
  return (
    <div className="flex justify-center h-screen bg-gradient-to-r from-slate-700 to-slate-800 p-4">
      <div className="md:w-[70%] lg:w-[50%] h-full lg:p-6 p-3 w-full bg-slate-900 rounded-2xl">
        <div className="flex flex-col h-full overflow-hidden gap-2">
          <Chat chatId={id} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
