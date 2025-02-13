package main

import (
	"context"
	"encoding/json"
	"os"
	"time"
	"todo/backend/models"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetTodos() ([]models.Todo, error) {
	data, err := os.ReadFile("todos.json")
	if err != nil {
		if os.IsNotExist(err) {
			return []models.Todo{}, nil
		}
		return nil, err
	}

	var todos []models.Todo
	err = json.Unmarshal(data, &todos)
	return todos, err
}

func (a *App) SaveTodos(todos []models.Todo) error {
	data, err := json.MarshalIndent(todos, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile("todos.json", data, 0644)
}

func (a *App) AddTodo(text string) (models.Todo, error) {
	todos, err := a.GetTodos()
	if err != nil {
		return models.Todo{}, err
	}

	newTodo := models.Todo{
		ID:        generateID(todos),
		Text:      text,
		Completed: false,
		CreatedAt: time.Now().String(),
	}

	todos = append(todos, newTodo)
	err = a.SaveTodos(todos)
	return newTodo, err
}

func (a *App) ToggleTodo(id int64) error {
	todos, err := a.GetTodos()
	if err != nil {
		return err
	}

	for i := range todos {
		if todos[i].ID == id {
			todos[i].Completed = !todos[i].Completed
			return a.SaveTodos(todos)
		}
	}

	return nil
}

func (a *App) DeleteTodo(id int64) error {
	todos, err := a.GetTodos()
	if err != nil {
		return err
	}

	filtered := make([]models.Todo, 0)
	for _, todo := range todos {
		if todo.ID != id {
			filtered = append(filtered, todo)
		}
	}

	return a.SaveTodos(filtered)
}

func generateID(todos []models.Todo) int64 {
	maxID := int64(0)
	for _, todo := range todos {
		if todo.ID > maxID {
			maxID = todo.ID
		}
	}
	return maxID + 1
}
