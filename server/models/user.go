package models

type Users struct {
	Name     string `json:"user"`
	Password string `json:"pass"`
	Type     string `json:"type"`
	State    string `json:"state"`
}
