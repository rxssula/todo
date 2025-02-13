import React from 'react';
import { models } from '../../wailsjs/go/models';

interface TodoItemProps {
    todo: models.Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
    return (
        <div className="todo-item">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
            </span>
            <button
                className="delete-button"
                onClick={() => onDelete(todo.id)}
            >
                Delete
            </button>
        </div>
    );
};

export default TodoItem;