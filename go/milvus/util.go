package milvus

import (
	"encoding/csv"
	"os"
	"strconv"
	"strings"
)

type film struct {
	ID     int64
	Title  string
	Year   int32
	Vector [8]float32 // fix length array
}

func loadFilmCSV() ([]film, error) {
	f, err := os.Open("data/films.csv") // assume you are in examples/insert folder, if not, please change the path
	if err != nil {
		return []film{}, err
	}
	r := csv.NewReader(f)
	raw, err := r.ReadAll()
	if err != nil {
		return []film{}, err
	}
	films := make([]film, 0, len(raw))
	for _, line := range raw {
		if len(line) < 4 { // insufficient column
			continue
		}
		fi := film{}
		// ID
		v, err := strconv.ParseInt(line[0], 10, 64)
		if err != nil {
			continue
		}
		fi.ID = v
		// Title
		fi.Title = line[1]
		// Year
		v, err = strconv.ParseInt(line[2], 10, 64)
		if err != nil {
			continue
		}
		fi.Year = int32(v)
		// Vector
		vectorStr := strings.ReplaceAll(line[3], "[", "")
		vectorStr = strings.ReplaceAll(vectorStr, "]", "")
		parts := strings.Split(vectorStr, ",")
		if len(parts) != 8 { // dim must be 8
			continue
		}
		for idx, part := range parts {
			part = strings.TrimSpace(part)
			v, err := strconv.ParseFloat(part, 32)
			if err != nil {
				continue
			}
			fi.Vector[idx] = float32(v)
		}
		films = append(films, fi)
	}
	return films, nil
}
