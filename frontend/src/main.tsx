import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import Home from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import Search from "./pages/SearchPage";
import MovieDetail from "./pages/MovieDetailPage";
import Recommend from "./pages/RecommendationPage";
import Chat from "./pages/ChatPage";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />}>
					<Route index element={<Home />} />
					<Route path="search" element={<Search />} />
					<Route path="mypage" element={<MyPage />} />
					<Route path="movie/:id" element={<MovieDetail />} />
					<Route path="recomm" element={<Recommend />} />
					<Route path="chat" element={<Chat />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)
