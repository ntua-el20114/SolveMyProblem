import React, { useState, useEffect} from 'react';
import ProblemForm from './ProblemForm';
import Header from './Header';
import '../index.css'; // import the CSS file
import axios from 'axios';

function ProblemList() {
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
    const [problems, setProblems] = useState([]); // State to store the list of problems
    const [reloadCounter, setReloadCounter] = useState(0); // State to trigger reload
    //const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete confirmation modal
    const [selectedProblem, setSelectedProblem] = useState(null); // State to store the selected problem for editing
    

    const openProblemModal = () => {
        setIsProblemModalOpen(true);
    };

    const closeProblemModal = () => {
        setIsProblemModalOpen(false);
        setReloadCounter(prevCount => prevCount + 1); // Increment to trigger reload
    };

    const openDeleteModal = (problem) => {
        if (!(problem.status === 'solved')) {
            alert('Only solved problems can be deleted');
            return;
        }
        setSelectedProblem(problem);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => { // Close delete confirmation modal
        setIsDeleteModalOpen(false);
    };

    // Function to fetch problems
    const fetchProblems = async () => {
        try {
            const response = await fetch('http://localhost:3003/problems');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProblems(data); // Update the state with the fetched problems
        } catch (error) {
            console.error('Error fetching problems:', error);
        }
    };

    const handleDelete = async () => {
        try {
            // Execute all requests in parallel
            await Promise.all([
                axios.post('http://localhost:3003/delete-problem', { id: selectedProblem.id }), //send to problem list
                axios.post('http://localhost:3006/delete-problem', { id: selectedProblem.id }), //send to analytics
                axios.post('http://localhost:3005/delete-problem', { id: selectedProblem.id })  //send to results
            ]);
            console.log('Deleting', selectedProblem ? selectedProblem.id : '');
            setReloadCounter(prevCount => prevCount + 1); // Increment to trigger reload
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting problem:', error);
            // Handle error (e.g., show error message to the user)
        }
    };

    // useEffect to fetch problems on mount and on modal close
    useEffect(() => {
        fetchProblems();
    }, [reloadCounter]); // Depend on reloadCounter to trigger effect

    /*
    const openEditModal = (problem) => {
        setSelectedProblem(problem);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setReloadCounter(prevCount => prevCount + 1); // Increment to trigger reload
    };

    {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content" style={{width: '30%'}}>
                        <span className="close" onClick={closeEditModal}>&times;</span>
                        <h2 style={{textAlign: 'center'}}>Edit Problem</h2>
                        <input className="rename" type="text" defaultValue={selectedProblem ? selectedProblem.name : ''} />
                        <button onClick={() => console.log('Renaming', selectedProblem ? selectedProblem.id : '')}>Rename</button>
                    </div>
                </div>
            )}

            <img src='/edit.png' alt='Edit' onClick={() => openEditModal(problem)} style={{cursor: 'pointer', maxWidth:'20px', marginRight: '10px'}}/>

    */

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

            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content" style={{width: '30%'}}>
                        <span className="close" onClick={closeDeleteModal}>&times;</span>
                        <h2>Are you sure you want to delete this problem?</h2>
                        <button className="delete-problem" onClick={handleDelete}>Yes, Delete</button>
                        <button onClick={closeDeleteModal}>Cancel</button>
                    </div>
                </div>
            )}

            <div className='problem-list'>
                <div className="scrollbox">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>User Name</th>
                            <th>Time Submitted</th>
                            <th>Solver</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem) => (
                            <tr key={problem.id}>
                                <td><b>{problem.name}</b></td>
                                <td>{problem.userName}</td>
                                <td>{new Date(problem.timeSubmitted).toLocaleString()}</td>
                                <td>{problem.solver}</td>
                                <td>{problem.status}</td>
                                <td style={{verticalAlign:' middle', textAlign: 'center', padding: '0px'}}>
                                    <img src='/delete-hover.png' alt='Delete' onClick={() => openDeleteModal(problem)} style={{cursor: 'pointer', maxWidth:'20px'}}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

export default ProblemList;