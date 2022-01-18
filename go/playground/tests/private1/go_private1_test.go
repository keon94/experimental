package private1

import (
	"github.com/stretchr/testify/require"
	_ "playground/misc/private1" //necessary
	"testing"
	_ "unsafe" //necessary to import privates
)

//go:linkname remotePrint any.RemotePrint
func remotePrint(string) int

func TestPrivateFnCall_usingLinkage(t *testing.T) {
	msg := "hello!!!"
	size := remotePrint(msg)
	require.Equal(t, len(msg), size)
}
