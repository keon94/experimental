package private2

//This is non-trivial enough that the compiler won't optimize it
func multAll(args ...int) int {
	prod := 1
	for _, arg := range args {
		prod *= arg
	}
	return prod
}

//go:noinline
func MultAll(args ...int) int {
	return multAll(args...)
}
