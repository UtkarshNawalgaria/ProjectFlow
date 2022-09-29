import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/page-header";
import ProjectService from "../services/projects";

type Project = {
  id: number;
  title: string;
  description?: string;
  created_at: string;
};

const SingleProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    ProjectService.getById(parseInt(projectId as string))
      .then((data) => setProject(data))
      .catch((e) => setError(e));
  }, []);

  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex gap-4">
          <Link to="/projects">
            <span className="p-3 font-bold inline-flex text-gray-700 ring-1 ring-slate-900/10 rounded-lg hover:text-indigo-500 hover:bg-gray-50 hover:ring-indigo-500">
              <HiArrowLeft />
            </span>
          </Link>
          <h1 className="font-bold text-3xl text-gray-700 ml-4">
            {project?.title}
          </h1>
        </div>
        <div className="toolbar">Toolbar</div>
      </PageHeader>
      <section></section>
    </div>
  );
};

export default SingleProjectPage;
