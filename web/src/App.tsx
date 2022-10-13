import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import ProtectedRoute from "./components/protectedRoute";

import HomePage from "./pages/home";
import ProjectsPage from "./pages/project-list";
import SingleProjectPage from "./pages/single-project";

import "react-toastify/dist/ReactToastify.min.css";
import VerifyEmail from "./pages/verify-email";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="" element={<ProtectedRoute />}>
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<SingleProjectPage />} />
        </Route>
        <Route path="/verify_email/" element={<VerifyEmail />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
      <ToastContainer autoClose={2000} position={toast.POSITION.TOP_RIGHT} />
    </>
  );
}

export default App;
