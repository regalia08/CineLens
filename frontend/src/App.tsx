import { Link, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { getUserId } from "./utils/userId";
import "./App.css";

function App() {
	useEffect(() => {
		let test = getUserId();
		console.log(test);
	}, []);
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/search">검색</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;