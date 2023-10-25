import { ChangeEvent, useState } from "react";
import Aside from ".";
import { TaskKeys, taskKeys } from "../../services/tasks";
import { capitalize } from "../../utils";
import useUser, { TUserContext } from "../../context/UserProvider";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Button from "../button";
import { toast } from "react-toastify";
import ProjectService from "../../services/projects";

type ExportColumns = {
  field: TaskKeys;
  selected: boolean;
};

export default function CSVExport({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId: number;
}) {
  const [columns, setColumns] = useState<ExportColumns[]>(
    taskKeys.map((key) => ({
      field: key,
      selected: key === "title" ? true : false,
    }))
  );
  const [exportSubtasks, setExportSubtasks] = useState(false);
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const { user } = useUser() as TUserContext;

  function updateSelectedColumns(e: ChangeEvent<HTMLInputElement>) {
    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column.field !== e.target.name) return column;
        return {
          ...column,
          selected: column.field === "title" ? true : !column.selected,
        };
      });
    });
  }

  function exportTasks() {
    if (!columns.some((column) => column.selected === true)) {
      toast.error("Select atleast 1 column to be exported");
      return;
    }

    ProjectService.exportTasks(
      projectId,
      JSON.stringify({
        fields: columns
          .filter((column) => column.selected === true)
          .map((column) => column.field)
          .join(","),
        export_subtasks: exportSubtasks,
        format: format,
      })
    ).then(() =>
      toast.info("Your file is being exported. It will be sent to your email.")
    );
  }

  return (
    <Aside open={open} close={onClose} title={"Export Tasks"} width="720px">
      <div className="text-grey-lightest">
        <div className="mb-8">
          <label
            htmlFor="format"
            className="block text-md font-medium text-grey-dark dark:text-grey-lightest mb-1">
            Format
          </label>
          <select
            className="rounded-md border focus:border-primary focus:ring-1 focus:ring-primary w-1/2 dark:text-grey-lightest dark:bg-slate-800"
            name="format"
            id="format"
            onChange={(e) => setFormat(e.target.value as "csv" | "xlsx")}>
            <option selected value="csv">
              CSV
            </option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        <div className="mb-8">
          <div className="mb-2">Select Columns</div>
          <div className="w-1/2 border rounded-md p-2 flex flex-col gap-2 mb-4">
            {columns.map((column, index) => (
              <div key={index}>
                <label
                  htmlFor={column.field}
                  className="cursor-pointer flex justify-between items-center dark:hover:bg-slate-700 px-2 rounded-sm">
                  <span>{capitalize(column.field.split("_").join("  "))}</span>
                  <input
                    type="checkbox"
                    name={column.field}
                    id={column.field}
                    checked={column.selected}
                    className="rounded-sm cursor-pointer accent-pink-500"
                    onChange={updateSelectedColumns}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <label
              htmlFor="export_subtasks"
              className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                name="export_subtasks"
                id="export_subtasks"
                className="rounded-sm cursor-pointer"
                checked={exportSubtasks}
                onChange={() => setExportSubtasks((prev) => !prev)}
              />
              <span>Export Subtasks ?</span>
            </label>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <span>
              <AiOutlineInfoCircle />
            </span>
            <span className="text-sm">
              The csv/excel file will be sent to {user?.email}
            </span>
          </div>
          <Button
            as="button"
            text="Export"
            type="CONFIRM"
            onClick={exportTasks}
          />
        </div>
      </div>
    </Aside>
  );
}
