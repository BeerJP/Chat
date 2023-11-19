package models

import "time"

type Messages struct {
	Name      string    `json:"name"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"createdAt"`
}

type MessageResponse struct {
	Name string `json:"name"`
	Text string `json:"text"`
	Date string `json:"date"`
	Time string `json:"time"`
}
