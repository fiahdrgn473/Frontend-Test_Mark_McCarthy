'use client'
import React, { useState, useEffect } from 'react'; //useEffect is necessary for prerendering without browser
import styles from './test.module.css';

// Your Test Starts Here

export default function TaskManager(): JSX.Element {
    type Task = {
    id: number; 
    title: string;
    priority: string; // High, Medium, Low
    completed: boolean; //F: active, T: complete
  };

  const taskDB:Task[] = [] //Starting database for QC
  
  const [Tasks, setTasks] = useState(taskDB)
  useEffect(() => {
    const saved = window.localStorage.getItem('taskDB') || JSON.stringify(taskDB);
    const initial = JSON.parse(saved);
    setTasks(initial);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskDB", JSON.stringify(Tasks));
  }, [Tasks]);

  //Task handling
  const [errorText, setErrorText] = useState('')
  const [NewTitle, setNewTitle] = useState('')
  const [NewPriority, setNewPriority] = useState('High')
  const addTask = (newTitle:string, newPriority:string) => {
    if (newTitle.trim().length === 0){
      setErrorText("Title cannot be empty or only whitespace")
    }
    else {
      setErrorText('')
      const ID = Tasks.reduce((n, c) => (c.id > n ? c.id : n), 0) + 1; //new ID always biggest to show recency
      const copy = [...Tasks, {id:ID, title:newTitle, priority:newPriority, completed:false}]
      setTasks(copy)
    }
  };

  const checkTask = (checked:boolean, ID:number) => {
    const taskIVal = Tasks.findIndex((task:Task)=>{
      if (task.id === ID) {
        return true   
      } else {
        return false
      }
    })
    const copy = [...Tasks]
    copy[taskIVal].completed = checked
    setTasks(copy)
  }

  const deleteTask = (ID:number) => {
    const taskIVal = Tasks.findIndex((task:Task)=>{
      if (task.id === ID) {
        return true   
      } else {
        return false
      }
    })
    const copy = Tasks.filter(task => task.id !== ID);
    setTasks(copy)
}

  //Filters
  const [FilterAll, setFilterAll] = useState(true)
  const [FilterActive, setFilterActive] = useState(false)
  const [FilterCompleted, setFilterCompleted] = useState(false)
  const [Search, setSearch] = useState('')

  const filterAll = () => {
    setFilterAll(true)
    setFilterActive(false)
    setFilterCompleted(false)
  }
  const filterActive = () => {
    setFilterAll(false)
    setFilterActive(true)
    setFilterCompleted(false)
  }
  const filterCompleted = () => {
    setFilterAll(false)
    setFilterActive(false)
    setFilterCompleted(true)
  }

  return (
  <div className={styles.container}>
    <div>
    <h3>New Task</h3>
    <input
      type="text"
      value={NewTitle}
      onChange={event => setNewTitle(event.target.value)}
      onKeyDown={event => {
        if (event.key === 'Enter') {
          addTask(NewTitle, NewPriority)
        }
      }}
      placeholder="Enter new task..."
    />
    <p>Priority:</p>
    <select 
      name="Priority" 
      id="priority" 
      onChange={(event) => setNewPriority(event.target.value)}>
      <option value="High" selected>High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <button onClick={() => addTask(NewTitle, NewPriority)}>Submit</button>
    <text style={{color:"red"}}>{errorText}</text>
    </div>
    <br></br>

    <div>
    <h3>Filters</h3>
    <p>All:
    <input
      id='all'
      type='checkbox'
      checked={FilterAll}
      onClick={() => filterAll()}
    /> </p>
    <p>Active: 
    <input
      id='active'
      type='checkbox'
      checked={FilterActive}
      onClick={() => filterActive()}
    /> </p>
    <p>Completed: 
    <input
      id='completed'
      type='checkbox'
      checked={FilterCompleted}
      onClick={() => filterCompleted()}
    /> </p>
    <br></br>
    <p>Search</p>
    <input
      type="text"
      value={Search}
      onChange={event => setSearch(event.target.value)}
      placeholder="Search for task..."
    />
    </div>
    <br></br>

    <div>
    <h3>Tasks</h3>
    <ol style={{listStyleType:"none"}}>
    {
      (FilterActive || FilterAll) &&
      Tasks
      .toSorted((a, b) => b.id - a.id)
      .map((task:Task)=>{
        if (!task.completed && task.title.includes(Search)) {
        return (
          <li> 
          <input
            type='checkbox'
            checked={task.completed}
            onChange={() => checkTask(!task.completed, task.id)}
          />
          Title: {task.title}. Priority: {task.priority}
          <button 
            onClick={() => deleteTask(task.id)}>
            Delete
          </button>
          </li>
        )}
      })
    }
    {
      (FilterCompleted || FilterAll) &&
      Tasks
      .toSorted((a, b) => b.id - a.id)
      .map((task:Task)=>{
        if (task.completed && task.title.includes(Search)) {
        return (
          <li style={{color:"darkgray"}}> 
          <input
            type='checkbox'
            checked={task.completed}
            onChange={() => checkTask(!task.completed, task.id)}
          />
          Title: {task.title}. Priority: {task.priority} 
          <button 
            onClick={() => deleteTask(task.id)}>
            Delete
          </button>
          </li>
        )}
      })
    }
    </ol>
    </div>
  </div>
  );
};