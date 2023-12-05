import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import Chat from "../components/Chat";

const HomePage = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Chat />
    </div>
  );
};

export default HomePage;
