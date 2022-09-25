import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ProjectService.getById(parseInt(projectId))
      .then((data) => setProject(data))
      .catch((e) => setError(e));
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(project)}</pre>
    </div>
  );
};

export default SingleProjectPage;
