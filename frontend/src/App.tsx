import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { WatchPage } from './pages/WatchPage'
import { ListPage } from './pages/ListPage'
import { SearchPage } from './pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phim/:slug" element={<MovieDetailPage />} />
        <Route path="/xem-phim/:slug" element={<WatchPage />} />
        <Route path="/danh-sach/:slug" element={<ListPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
