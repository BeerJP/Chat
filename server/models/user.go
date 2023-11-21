package models

import "time"

type Users struct {
	Name      string `json:"user"`
	CreatedAt time.Time
}
