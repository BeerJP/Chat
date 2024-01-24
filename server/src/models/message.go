package models

import "time"

type Messages struct {
	Name   string `json:"name"`
	Text   string `json:"text"`
	Target string `json:"target"`
	Dm     string
	Time   time.Time
}

type MessageResponse struct {
	Name   string `json:"name"`
	Text   string `json:"text"`
	Date   string `json:"date"`
	Time   string `json:"time"`
	Target string `json:"target"`
	Dm     string `json:"dm"`
}
