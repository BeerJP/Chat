package models

type User_Req struct {
	Username string `json:"user"`
	Password string `json:"pass"`
}

type User_Res struct {
	Nickname string `json:"name"`
	Username string `json:"user"`
	Password string `json:"pass"`
}

type OnlineUser struct {
	Id   string `json:"user"`
	Name string `json:"name"`
}
