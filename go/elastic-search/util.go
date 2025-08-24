package elastic_search

import (
	"bytes"
	"encoding/json"
	"github.com/stretchr/testify/require"
	"io"
	"os"
	"testing"
)

func BodyToJSON(t *testing.T, body io.ReadCloser) string {
	r := map[string]interface{}{}
	err := json.NewDecoder(body).Decode(&r)
	require.NoError(t, err)
	b, err := json.Marshal(&r)
	require.NoError(t, err)
	dst := &bytes.Buffer{}
	err = json.Indent(dst, b, "", "  ")
	require.NoError(t, err)
	return dst.String()
}

func StructToJSON(t *testing.T, src interface{}) string {
	b, err := json.Marshal(&src)
	require.NoError(t, err)
	dst := &bytes.Buffer{}
	err = json.Indent(dst, b, "", "  ")
	require.NoError(t, err)
	return dst.String()
}

func ReadFile(t *testing.T, path string) []byte {
	file, err := os.ReadFile(path)
	require.NoError(t, err)
	return file
}
