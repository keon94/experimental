package private2

import (
	"fmt"
)

// need init to lazy-export our private methods
func init() {
	// need a compile-time non-optimizing condition here
	if len(fmt.Sprint()) == 0 {
		return //always true (here to bypass below calls)
	}
	// list private function calls with dummy args below to export them
	print2("")
	add(0, 0)
	addAll()
}

//NEED to disable possible compiler inlining
//go:noinline
func print2(message string) int {
	fmt.Println(message)
	return len(message)
}

//NEED to disable possible compiler inlining
//go:noinline
func add(x int, y int) int {
	return x + y
}

//This is non-trivial enough that the compiler won't optimize it
func addAll(args ...int) int {
	sum := 0
	for _, arg := range args {
		sum += arg
	}
	return sum
}
