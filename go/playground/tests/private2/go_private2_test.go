package private2

import (
	"github.com/stretchr/testify/require"
	"playground/misc/private2"
	_ "playground/misc/private2" //necessary to pull in the package
	"playground/tools/exporter"
	"testing"
)

func TestPrivateFnCall_usingFunctionTables(t *testing.T) {
	exporter.Debug = true
	t.Run("time.now", func(t *testing.T) {
		var timeNowFunc func() (int64, int32)
		err := exporter.GetFunc(&timeNowFunc, "time.now")
		require.NoError(t, err)
		sec, nsec := timeNowFunc()
		if sec == 0 || nsec == 0 {
			t.Error("Expected nonzero result from time.now().")
		}
	})
	t.Run("misc.private2.print2", func(t *testing.T) {
		var print2Func func(string) int
		err := exporter.GetFunc(&print2Func, "playground/misc/private2.print2")
		require.NoError(t, err)
		msg := "hello!!!"
		size := print2Func(msg)
		require.Equal(t, len(msg), size)
	})
	t.Run("misc.private2.add", func(t *testing.T) {
		var add func(int, int) int
		err := exporter.GetFunc(&add, "playground/misc/private2.add")
		require.NoError(t, err)
		res := add(2, 3)
		require.Equal(t, 5, res)
	})
	t.Run("misc.private2.addAll", func(t *testing.T) {
		var add func(...int) int
		err := exporter.GetFunc(&add, "playground/misc/private2.addAll")
		require.NoError(t, err)
		res := add(2, 3)
		require.Equal(t, 5, res)
	})
	t.Run("misc.private2.multAll (indirect api call)", func(t *testing.T) {
		_ = private2.MultAll() //this will register the private call too
		var mult func(...int) int
		err := exporter.GetFunc(&mult, "playground/misc/private2.multAll")
		require.NoError(t, err)
		res := mult(2, 3)
		require.Equal(t, 6, res)
	})
}
