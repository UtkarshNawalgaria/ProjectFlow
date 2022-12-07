import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import ProtectedRoute from "./components/protectedRoute";
import AnonymousLayout from "./components/layouts/anonymous";
import { TasksProvider } from "./context/TasksProvider";

import HomePage from "./pages/home";
import Dashboard from "./pages/dashboard";
import VerifyEmail from "./pages/verify-email";
import Invitation from "./pages/invitation";
import ErrorPage from "./pages/404";

import SingleProjectPage from "./pages/project/single-project";
import ProjectsPage from "./pages/project/project-list";

import OrganizationSettings from "./pages/organization/settings";
import OrganizationMembers from "./pages/organization/members";

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<AnonymousLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="verify/:code" element={<VerifyEmail />} />
          <Route path="accept-invite/:code" element={<Invitation />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route
            path="projects/:projectId"
            element={
              <TasksProvider>
                <SingleProjectPage />
              </TasksProvider>
            }
          />
        </Route>
        <Route path="organization/:orgId" element={<ProtectedRoute />}>
          <Route path="settings" element={<OrganizationSettings />} />
          <Route path="members" element={<OrganizationMembers />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={2000} position={toast.POSITION.TOP_RIGHT} />
    </>
  );
}

export default App;
