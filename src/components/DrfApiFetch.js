import React, {useState, useEffect} from 'react'
import axios from 'axios'

const DrfApiFetch = () => {

    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState([])
    const [editedTask, setEditedTask] = useState({id:'', title:''})
    const [id, setId] = useState(1)

    useEffect(() => {
        axios.get('http://localhost:8000/api/tasks/', {
            headers: {
                'Authorization': 'Token 93e567719f3c5e1504619c052475e06e689866e2'
            }
        })
        .then(res => (setTasks(res.data)))
    }, [])

    const getTask = () => {
        axios.get(`http://localhost:8000/api/tasks/${id}/`, {
            headers: {
                'Authorization': 'Token 93e567719f3c5e1504619c052475e06e689866e2'
            }
        })
        .then(res => setSelectedTask(res.data))
    }

    const createTask = (task) => {
        const data = {
            title: task.title
        }
        axios.post('http://localhost:8000/api/tasks/', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 93e567719f3c5e1504619c052475e06e689866e2'
            }
        })
        .then(res => {
            setTasks([...tasks, res.data])
            setEditedTask({id: '', title: ''})
        })
    }

    const editTask = (task) => {
        axios.put(`http://localhost:8000/api/tasks/${task.id}/`, task, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 93e567719f3c5e1504619c052475e06e689866e2'
            }
        })
        .then(res => {
            setTasks(tasks.map(task => (task.id === editedTask.id ? res.data : task)))
            setEditedTask({id: '', title: ''})
        })
    }

    const deleteTask = (id) => {
        axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
            headers: {
                'Authorization': 'Token 93e567719f3c5e1504619c052475e06e689866e2'
            }
        })
        .then(res => {
            setTasks(tasks.filter(task => task.id !== id))
            setSelectedTask([])
            if (editedTask.id === id) {
                setEditedTask({ id: "", title: "" });
            }
        })
    }

    const handleInputChange = e => {
        const value = e.target.value;
        const name = e.target.name;
        setEditedTask({...editedTask, [name]:value})
    }

    return (
        <div>
            <ul>
                {
                    tasks.map(task => <li key={task.id}> {task.title}  {task.id}
                    <button onClick={() => setEditedTask(task)}>
                        <i className="fas fa-pen"></i>
                    </button>
                    <button onClick={() => deleteTask(task.id)}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                    </li>)
                }
            </ul>

            set id <br/>
            <input type='text' value={id} onChange={e=>setId(e.target.value)} />
            <br/>
            <button type='button' onClick={()=>getTask()}>Get Task</button>
            {/*<button type='button' onClick={()=>deleteTask()}>Delete</button>*/}
            <br />
            <h3>{selectedTask.title} {selectedTask.id}</h3>

            <input type="text" name="title" 
                value={editedTask.title}
                onChange={handleInputChange}
                placeholder="New task ?" required />
            { editedTask.id ?
                <button onClick={()=>{editTask(editedTask)}}>Update</button> :
                <button onClick={()=>{createTask(editedTask)}}>Create</button>
            }
        </div>
    )
}

export default DrfApiFetch