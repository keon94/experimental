package exporter

//Ref: https://github.com/alangpierce/go-forceexport
import (
	"fmt"
	"os"
	"reflect"
	"runtime"
	"unsafe"
)

// Everything below is taken from the runtime package, and must stay in sync
// with it.

//go:linkname Firstmoduledata runtime.firstmoduledata
var Firstmoduledata Moduledata

// Debug set to true for verbose logging
var Debug bool

// GetFunc gets the function defined by the given fully-qualified name. The
// outFuncPtr parameter should be a pointer to a function with the appropriate
// type (e.g. the address of a local variable), and is set to a new function
// value that calls the specified function. If the specified function does not
// exist, outFuncPtr is not set and an error is returned.
func GetFunc(outFuncPtr interface{}, name string) error {
	codePtr, err := FindFuncWithName(name)
	if err != nil {
		return err
	}
	CreateFuncForCodePtr(outFuncPtr, codePtr)
	return nil
}

// Func Convenience struct for modifying the underlying code pointer of a function
// value. The actual struct has other values, but always starts with a code
// pointer.
type Func struct {
	codePtr uintptr
}

// CreateFuncForCodePtr is given a code pointer and creates a function value
// that uses that pointer. The outFun argument should be a pointer to a function
// of the proper type (e.g. the address of a local variable), and will be set to
// the result function value.
func CreateFuncForCodePtr(outFuncPtr interface{}, codePtr uintptr) {
	outFuncVal := reflect.ValueOf(outFuncPtr).Elem()
	// Use reflect.MakeFunc to create a well-formed function value that's
	// guaranteed to be of the right type and guaranteed to be on the heap
	// (so that we can modify it). We give a nil delegate function because
	// it will never actually be called.
	newFuncVal := reflect.MakeFunc(outFuncVal.Type(), nil)
	// Use reflection on the reflect.Value (yep!) to grab the underling
	// function value pointer. Trying to call newFuncVal.Pointer() wouldn't
	// work because it gives the code pointer rather than the function value
	// pointer. The function value is a struct that starts with its code
	// pointer, so we can swap out the code pointer with our desired value.
	funcValuePtr := reflect.ValueOf(newFuncVal).FieldByName("ptr").Pointer()
	funcPtr := (*Func)(unsafe.Pointer(funcValuePtr))
	funcPtr.codePtr = codePtr
	outFuncVal.Set(newFuncVal)
}

// FindFuncWithName searches through the moduledata table created by the linker
// and returns the function's code pointer. If the function was not found, it
// returns an error. Since the data structures here are not exported, we copy
// them below (and they need to stay in sync or else things will fail
// catastrophically).
func FindFuncWithName(name string) (uintptr, error) {
	for moduleData := &Firstmoduledata; moduleData != nil; moduleData = moduleData.next {
		for _, ftab := range moduleData.ftab {
			if int(ftab.funcoff) >= len(moduleData.pclntable) {
				fmt.Fprintf(os.Stderr, "out of bounds ftab function found!\n")
				continue
			}
			funcAddr := &moduleData.pclntable[ftab.funcoff]
			funcObj := (*runtime.Func)(unsafe.Pointer(funcAddr))
			if funcObj == nil {
				fmt.Fprintf(os.Stderr, "nil function address at %d!\n", funcAddr)
				continue
			}
			fName := funcObj.Name()
			if Debug {
				fmt.Println("visited function:", fName)
			}
			if fName == name {
				return funcObj.Entry(), nil
			}
		}
	}
	return 0, fmt.Errorf("invalid function name: %s", name)
}
