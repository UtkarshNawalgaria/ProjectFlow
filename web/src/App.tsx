import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import BooksPage from "./pages/books";
import ProtectedRoute from "./protectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/books" element={<BooksPage />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
