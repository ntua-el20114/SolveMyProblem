import React, { useState, useEffect} from 'react';
import ProblemForm from './ProblemForm';
import Header from './Header';
import '../index.css'; // import the CSS file

function ProblemList() {
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
    const [problems, setProblems] = useState([]); // State to store the list of problems
    const [reloadCounter, setReloadCounter] = useState(0); // State to trigger reload
    

    const openProblemModal = () => {
        setIsProblemModalOpen(true);
    };

    const closeProblemModal = () => {
        setIsProblemModalOpen(false);
        setReloadCounter(prevCount => prevCount + 1); // Increment to trigger reload
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

    // useEffect to fetch problems on mount and on modal close
    useEffect(() => {
        fetchProblems();
    }, [reloadCounter]); // Depend on reloadCounter to trigger effect

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
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>User Name</th>
                <th>Time Submitted</th>
                <th>Time Solved</th>
                <th>Solver</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {problems.map((problem) => (
                <tr key={problem.id}>
                    <td>{problem.name}</td>
                    <td>{problem.userName}</td>
                    <td>{new Date(problem.timeSubmitted).toLocaleString()}</td>
                    <td>{problem.timeSolved ? new Date(problem.timeSolved).toLocaleString() : 'N/A'}</td>
                    <td>{problem.solver}</td>
                    <td>{problem.status}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
        </div>
    );
}

export default ProblemList;