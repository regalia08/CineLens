import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getUserId } from "./utils/userId";

function App() {
  const location = useLocation();

  useEffect(() => {
    let test = getUserId();
    console.log(test);
  }, []);

  const linkClass = (path: string) =>
    `px-3 py-1.5 rounded-full transition-colors ${location.pathname === path
      ? 'bg-zinc-800 text-white'
      : 'text-zinc-400 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-8 py-4">
        <Link to="/" className="text-red-600 text-2xl font-bold mr-4">CineLens</Link>
        <ul className="flex flex-wrap gap-2">
          <li><Link to="/" className={linkClass('/')}>홈</Link></li>
          <li><Link to="/search" className={linkClass('/search')}>검색</Link></li>
          <li><Link to="/mypage" className={linkClass('/mypage')}>마이페이지</Link></li>
          <li><Link to="/recomm" className={linkClass('/recomm')}>추천페이지</Link></li>
          <li><Link to="/chat" className={linkClass('/chat')}>AI 채팅</Link></li>
        </ul>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;