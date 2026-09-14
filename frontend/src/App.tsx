import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getUserId } from "./utils/userId";

function App() {
  useEffect(() => {
    let test = getUserId();
    console.log(test);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-8 py-4">
        <span className="text-red-600 text-2xl font-bold mr-4">CineLens</span>
        <ul className="flex gap-6">
          <li>
            <Link to="/" className="hover:text-zinc-400 transition-colors">홈</Link>
          </li>
          <li>
            <Link to="/search" className="hover:text-zinc-400 transition-colors">검색</Link>
          </li>
          <li>
            <Link to="/mypage" className="hover:text-zinc-400 transition-colors">마이페이지</Link>
          </li>
          <li>
            <Link to="/recomm" className="hover:text-zinc-400 transition-colors">추천페이지</Link>
          </li>
          <li>
            <Link to="/chat" className="hover:text-zinc-400 transition-colors">Chat</Link>
          </li>
        </ul>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;