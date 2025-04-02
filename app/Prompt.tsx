import React, { useState } from "react";

const Prompt = (props: {
  id: string;
  promptName: string;
  promptText: string;
  createdAt: string;
  modifiedAt: string;
  onDelete: () => void;
  onUpdate: (newText: string) => void;
}) => {
  const { promptName, promptText, createdAt, modifiedAt, onDelete, onUpdate } =
    props;

  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(promptText);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onUpdate(newText);
  };

  // Convert timestamps to readable format
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString(); // Converts to local time format
  };

  return (
    <div className="bg-blue-500 text-white p-4 rounded-md shadow-md mb-4">
      <h3>Name: {promptName}</h3>

      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="p-2 border rounded-md text-black"
        />
      ) : (
        <p>{newText}</p>
      )}
      <small>Created At: {formatDate(createdAt)}</small>
      <br />
      <small>Last Modified: {formatDate(modifiedAt)}</small>
      <br />

      {isEditing ? (
        <button
          className="bg-green-500 text-white p-2 rounded-md shadow-md"
          onClick={handleSaveClick}
        >
          Save
        </button>
      ) : (
        <button
          className="bg-yellow-500 text-white p-2 rounded-md shadow-md mr-2"
          onClick={handleEditClick}
        >
          Edit
        </button>
      )}

      <button
        className="bg-red-500 text-white p-2 rounded-md shadow-md"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default Prompt;
