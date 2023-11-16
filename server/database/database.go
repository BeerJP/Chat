package database

import (
	"fmt"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Messages struct {
	Name string
	Time time.Time
	Text string
}

func Database() *gorm.DB {

	db, err := gorm.Open(mysql.Open("root:@(127.0.0.1)/full-stack-chat"), &gorm.Config{})
	if err != nil {
		fmt.Println("failed to connect to database")
	}
	db.AutoMigrate(&Messages{})
	return db

}

func Query(conn *gorm.DB) string {

	word := "Hello"
	return word

}
