package server

import (
	jwtware "github.com/gofiber/contrib/jwt"
)

func TokenMdw() jwtware.Config {
	return jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte("secret")},
	}
}
