import React, { useState } from "react";
import axios from "axios";
import { FaMinus } from "react-icons/fa6";
import { FaLessThan } from "react-icons/fa";
import Swal from "sweetalert2";
import { initialOptions } from "../Constant/constants";

function Modal({ closeModal }) {
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [schemaOptions, setSchemaOptions] = useState(initialOptions);
  const [currentSchema, setCurrentSchema] = useState("");
  const webhookURL = import.meta.env.VITE_WEBHOOK_URL;

  // Function to add a new schema to the list and filter out new list to be shown in the options
  const addSchema = () => {
    if (currentSchema) {
      const selectedOption = schemaOptions.find(
        (option) => option.value === currentSchema
      );
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      setSchemaOptions(
        schemaOptions.filter((option) => option.value !== currentSchema)
      );
      setCurrentSchema("");
    }
  };

  // Function to remove a selected schema and reallocate it back to the options
  const removeSchema = (schemaToRemove) => {
    setSelectedSchemas(
      selectedSchemas.filter((schema) => schema.value !== schemaToRemove.value)
    );
    setSchemaOptions([...schemaOptions, schemaToRemove]);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (segmentName && selectedSchemas.length > 0) {
      const data = {
        segment_name: segmentName,
        schema: selectedSchemas.map((schema) => {
          return { [schema.value]: schema.label };
        }),
      };

      try {
        await axios.post(webhookURL, data);
        Swal.fire({
          title: "Saved",
          text: "Segment Saved Successfully",
          icon: "success",
        });
        closeModal(); // Close modal after successful submission
      } catch (error) {
        console.error("Error saving segment:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: "webhook url issue",
        });
      }
    } else {
      Swal.fire({
        title: "Not Completed",
        text: "Fill all field !!",
        icon: "error",
      });
    }
  };

  // updating the selectedschema and schemaoptions while editing the saved segment
  const changeSchema = (newSchemaValue, currentSchema) => {
    const newSchemaObj = schemaOptions.find(
      (option) => option.value === newSchemaValue
    );

    const updatedSelectedSchemas = selectedSchemas.map((schema) =>
      schema.value === currentSchema.value ? newSchemaObj : schema
    );

    const updatedSchemaOptions = [
      ...schemaOptions.filter((option) => option.value !== newSchemaValue),
      currentSchema,
    ];

    setSelectedSchemas(updatedSelectedSchemas);
    setSchemaOptions(updatedSchemaOptions);
  };

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 flex items-end justify-end bg-black bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()} // while bubbling up the event the event wouldn't trigger
        className="bg-white h-full rounded-lg w-full max-w-lg shadow-lg"
      >
        <div className="h-full relative">
          <div className="bg-teal-500 px-5 py-10 flex items-center mb-4">
            <button
              onClick={closeModal}
              className="mr-5 text-teal-600 hover:text-teal-800"
            >
              <FaLessThan color="white" />
            </button>
            <h2 className="text-2xl tracking-tight text-white font-semibold">
              Saving Segment
            </h2>
          </div>

          <div className="">
            <div className="p-6 ">
              <label className="text-lg h text-gray-500">
                Enter the Name of the Segment
              </label>
              <input
                type="text"
                placeholder="Name of the Segment"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-slate-300 rounded-sm mt-4 mb-6"
              />

              <p className="mb-10 text-gray-500">
                To save your segment, you need to add the schemas to build the
                query
              </p>
              <div className="flex justify-end space-x-5 mb-2">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
                  - User Traits
                </span>
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>{" "}
                  - Group Traits
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {selectedSchemas.map((schema, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        schema.type === "user" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <select
                      onChange={(e) => changeSchema(e.target.value, schema)}
                      className="w-full p-3 border rounded-md"
                    >
                      <option value="" hidden>
                        {schema.label}
                      </option>
                      {schemaOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <div
                      className="cursor-pointer bg-teal-50 p-1 rounded-lg"
                      onClick={() => removeSchema(schema)}
                    >
                      <FaMinus color="teal" size={32} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-full ">
                {schemaOptions.length !== 0 ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                      <select
                        value={currentSchema}
                        onChange={(e) => setCurrentSchema(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="" hidden>
                          Add schema to segment
                        </option>
                        {schemaOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={addSchema}
                      className="text-teal-400 py-5 ml-4 font-semibold underline outline-none"
                    >
                      + Add new schema
                    </button>
                  </>
                ) : (
                  <h2 className="text-center">All schemas are selected</h2>
                )}
              </div>
            </div>

            <div className="flex justify-between  p-6 absolute bottom-0 w-full">
              <button
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                onClick={handleSubmit}
              >
                Save the Segment
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
