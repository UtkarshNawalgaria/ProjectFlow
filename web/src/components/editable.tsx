import { useState } from "react";
import { HiX, HiCheck, HiPencil } from "react-icons/hi";

type EditableElementProps = {
  text: string | undefined;
  allowEditing?: boolean;
  onConfirm: (text: string) => void;
  Element: JSX.Element;
};

const Editable = ({
  text,
  onConfirm,
  allowEditing,
  Element,
}: EditableElementProps) => {
  if (!text) return null;

  const [value, setValue] = useState(text);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="flex gap-4 items-center">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="dark:text-grey-lightest dark:bg-slate-800 rounded-md text-md max-w-full focus:border-primary"
            />
          ) : (
            <>{Element}</>
          )}
        </div>
        {allowEditing ? (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <span
                  onClick={() => {
                    setIsEditing(false);
                    setValue(text);
                  }}
                  className="inline-block p-1 rounded-full cursor-pointer bg-red-100">
                  <HiX className="w-4 h-4 text-red-500" />
                </span>
                <span
                  onClick={() => {
                    if (value === text) {
                      setIsEditing(false);
                      return;
                    }

                    onConfirm(value);
                    setIsEditing(false);
                  }}
                  className="inline-block p-1 rounded-full cursor-pointer bg-green-100">
                  <HiCheck className="w-4 h-4 text-green-500" />
                </span>
              </>
            ) : (
              <span
                onClick={() => setIsEditing(true)}
                className="inline-block p-1 rounded-full cursor-pointer dark:hover:bg-slate-500
                ">
                <HiPencil className="w-5 h-5 cursor-pointer dark:text-grey-lightest" />
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Editable;
