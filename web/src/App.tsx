import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import ProtectedRoute from "./components/protectedRoute";
import ProjectsPage from "./pages/projects";
import SingleProjectPage from "./pages/single-project";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="dashboard" element={<ProtectedRoute />}>
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<SingleProjectPage />} />
      </Route>
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default App;
