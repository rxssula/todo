import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './style.css';
import { models } from '../wailsjs/go/models';
import { GetTodos, AddTodo, ToggleTodo, DeleteTodo } from '../wailsjs/go/main/App'

const App: React.FC = () => {
    const [todos, setTodos] = useState<models.Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadTodos = async () => {
        try {
            const loadedTodos = await GetTodos();
            setTodos(loadedTodos);
        } catch (err) {
            setError('Failed to load todos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!newTodo.trim()) return;

        try {
            const todo = await AddTodo(newTodo);
            setTodos(prevTodos => [...prevTodos, todo]);
            setNewTodo('');
        } catch (err) {
            setError('Failed to add todo');
            console.error(err);
        }
    };

    const handleToggleTodo = async (id: number) => {
        try {
            await ToggleTodo(id);
            setTodos(prevTodos =>
                prevTodos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                )
            );
        } catch (err) {
            setError('Failed to update todo');
            console.error(err);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        try {
            await DeleteTodo(id);
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('Failed to delete todo');
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="todo-container">
            {error && <div className="error-message">{error}</div>}

            <div className="todo-header">
                <h1>models.Todo List</h1>
            </div>

            <div className="todo-input-container">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="Add new todo..."
                    className="todo-input"
                />
                <button onClick={handleAddTodo} className="todo-button">
                    Add models.Todo
                </button>
            </div>

            <TodoList
                todos={todos}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
            />
        </div>
    );
};

export default App;