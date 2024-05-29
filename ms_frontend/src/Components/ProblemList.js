import React, { useState } from 'react';
import ProblemForm from './ProblemForm';
import Header from './Header';
import '../index.css'; // import the CSS file

function ProblemList() {
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);

    const openProblemModal = () => {
        setIsProblemModalOpen(true);
    };

    const closeProblemModal = () => {
        setIsProblemModalOpen(false);
    };

    return (
        <div>
            <Header />
            <h1>Problem List</h1>
            <button onClick={openProblemModal}>Add New Problem</button>

            {isProblemModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeProblemModal}>
                            &times;
                        </span>
                        <ProblemForm closeModal={closeProblemModal} />
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