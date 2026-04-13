import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { WatchPage } from './pages/WatchPage'
import { ListPage } from './pages/ListPage'
import { SearchPage } from './pages/SearchPage'
import { CategoryPage } from './pages/CategoryPage'
import { CountryPage } from './pages/CountryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phim/:slug" element={<MovieDetailPage />} />
        <Route path="/xem-phim/:slug" element={<WatchPage />} />
        <Route path="/danh-sach/:slug" element={<ListPage />} />
        <Route path="/the-loai/:slug" element={<CategoryPage />} />
        <Route path="/quoc-gia/:slug" element={<CountryPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
