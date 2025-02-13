package main

import (
	"context"
	"encoding/json"
	"os"
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

func (a *App) SaveTodos(todos []models.Todo) error {
	data, err := json.Marshal(todos)
	if err != nil {
		return err
	}
	return os.WriteFile("todos.json", data, 0644)
}

func (a *App) LoadTodos() ([]models.Todo, error) {
	var todos []models.Todo
	data, err := os.ReadFile("todos.json")
	if err != nil {
		if os.IsNotExist(err) {
			return []models.Todo{}, nil
		}
		return nil, err
	}
	err = json.Unmarshal(data, &todos)
	return todos, err
}
