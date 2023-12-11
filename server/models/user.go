package models

type Users struct {
	Name     string `json:"user"`
	Password string `json:"pass"`
	State    string `json:"state"`
}
