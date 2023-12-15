import Chat from "../../components/Chat";

type Props = {
  params: {
    id: string[];
  };
};

const HomePage = ({ params: { id } }: Props) => {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-2">
      <Chat chatId={id} />
    </div>
  );
};

export default HomePage;
