import React from "react";
import { FaMinus } from "react-icons/fa6";

const Listing = ({
  schemaOptions,
  selectedSchemas,
  setSchemaOptions,
  setSelectedSchemas,
}) => {
  // Function to remove a selected schema and reallocate it back to the options

  const removeSchema = (schemaToRemove) => {
    setSelectedSchemas(
      selectedSchemas.filter((schema) => schema.value !== schemaToRemove.value)
    );
    setSchemaOptions([...schemaOptions, schemaToRemove]);   
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
  );
};

export default Listing;
