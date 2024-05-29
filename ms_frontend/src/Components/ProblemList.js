import React, { useState} from 'react';
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
            <img src = '/add.png' alt='' onClick={openProblemModal} className='add-button right-to-left-fast'/>
            <h1 className="left-to-right-slow center-screen">Problem List</h1>
            

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
               <ul>
               <li>Problem 1</li>
                <li>Problem 2</li>
                <li>Problem 3</li>
                <li>Problem 4</li>
                </ul>
            </div>
        </div>
    );
}

export default ProblemList;