import React, { useState } from "react";
import Modal from "./Modal";

const MainApp = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Function to toggle modal
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="">
      <div className="w-full  text-white bg-teal-500 p-10">
        <h1 className="text-2xl">View Audience</h1>
      </div>
      <div className="m-10">
        <button
          className="px-4 py-2  text-black rounded-md hover:bg-teal-500 border-2 border-black"
          onClick={toggleModal}
        >
          Save Segment
        </button>
      </div>

      {isModalOpen && <Modal closeModal={toggleModal} />}
    </div>
  );
};

export default MainApp;
