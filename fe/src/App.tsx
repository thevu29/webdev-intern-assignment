import { Outlet } from "react-router";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <>
      <div className="text-center text-3xl font-bold bg-blue-500 pb-2 pt-2 text-white">
        G-Scores
      </div>

      <div className="flex">
        <Navbar />
        <div className="bg-[#f1f3f5] flex-1 px-8 py-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
