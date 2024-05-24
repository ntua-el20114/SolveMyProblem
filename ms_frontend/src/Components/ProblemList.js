// ProblemList.js
import React, { useState } from 'react';
import ProblemForm from './ProblemForm';
import Header from './Header';
import '../index.css'; // import the CSS file

function ProblemList() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header />
            <h1>Problem List</h1>
            <button onClick={openModal}>Add New Problem</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <ProblemForm closeModal={closeModal} />
                    </div>
                </div>
            )}

            <div className='problem-list'>
               <p>List of Problems HERE</p>
            </div>
        </div>
    );
}

export default ProblemList;