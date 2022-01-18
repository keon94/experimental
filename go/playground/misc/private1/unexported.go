package private1

import (
	"fmt"
	_ "unsafe" //necessary to export privates
)

//go:linkname print1 any.RemotePrint
func print1(message string) int {
	fmt.Println(message)
	return len(message)
}
