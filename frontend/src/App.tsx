import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './style.css';
import { models } from '../wailsjs/go/models';
import { LoadTodos, SaveTodos } from '../wailsjs/go/main/App'

const App: React.FC = () => {
    const [todos, setTodos] = useState<models.Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

    useEffect(() => {
        LoadTodos()
            .then(loadedTodos => setTodos(loadedTodos))
            .catch(err => console.error('Error loading todos:', err));
    }, []);

    useEffect(() => {
        SaveTodos(todos)
            .catch(err => console.error('Error saving todos:', err));
    }, [todos]);

    const addTodo = (): void => {
        if (!newTodo.trim()) return;

        const todo: models.Todo = {
            id: Date.now(),
            text: newTodo,
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTodos([...todos, todo]);
        setNewTodo('');
    };

    const toggleTodo = (id: number): void => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: number): void => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            setTodos(todos.filter(todo => todo.id !== id));
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h1>models.Todo List</h1>
            </div>

            <div className="todo-input-container">
                <input
                    type="text"
                    className="todo-input"
                    value={newTodo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo..."
                />
                <button className="todo-button" onClick={addTodo}>
                    Add models.Todo
                </button>
            </div>

            <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
            />
        </div>
    );
};

export default App;