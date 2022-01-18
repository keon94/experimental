package exporter

import "unsafe"

//Moduledata a subset of the fields in runtime.firstmoduledata are needed to get this to work... trial and error to figure out which ones
type Moduledata struct {
	pcHeader     *PcHeader
	funcnametab  []byte
	cutab        []uint32
	filetab      []byte
	pctab        []byte
	pclntable    []byte
	ftab         []Functab
	findfunctab  uintptr
	minpc, maxpc uintptr

	text, etext           uintptr
	noptrdata, enoptrdata uintptr
	data, edata           uintptr
	bss, ebss             uintptr
	noptrbss, enoptrbss   uintptr
	end, gcdata, gcbss    uintptr
	types, etypes         uintptr

	textsectmap []textsect
	typelinks   []int32
	itablinks   []*itab

	ptab []ptabEntry

	pluginpath string
	pkghashes  []Modulehash

	modulename   string
	modulehashes []Modulehash

	hasmain uint8

	gcdatamask, gcbssmask Bitvector

	typemap map[int32]*Type
	bad     bool

	next *Moduledata
}

//==============================dependencies==========================================

type ptabEntry struct {
	name int32
	typ  int32
}

type textsect struct {
	vaddr    uintptr
	length   uintptr
	baseaddr uintptr
}

type name struct {
	bytes *byte
}

type imethod struct {
	name int32
	ityp int32
}

type interfacetype struct {
	typ     Type
	pkgpath name
	mhdr    []imethod
}

type itab struct {
	inter *interfacetype
	_type *Type
	hash  uint32
	_     [4]byte
	fun   [1]uintptr
}

type Type struct {
	size       uintptr
	ptrdata    uintptr
	hash       uint32
	tflag      uint8
	align      uint8
	fieldAlign uint8
	kind       uint8
	equal      func(unsafe.Pointer, unsafe.Pointer) bool
	gcdata     *byte
	str        int32
	ptrToThis  int32
}

type Modulehash struct {
	modulename   string
	linktimehash string
	runtimehash  *string
}

type PcHeader struct {
	magic          uint32  // 0xFFFFFFFA
	pad1, pad2     uint8   // 0,0
	minLC          uint8   // min instruction size
	ptrSize        uint8   // size of a ptr in bytes
	nfunc          int     // number of functions in the module
	nfiles         uint    // number of entries in the file tab.
	funcnameOffset uintptr // offset to the funcnametab variable from PcHeader
	cuOffset       uintptr // offset to the cutab variable from PcHeader
	filetabOffset  uintptr // offset to the filetab variable from PcHeader
	pctabOffset    uintptr // offset to the pctab varible from PcHeader
	pclnOffset     uintptr // offset to the pclntab variable from PcHeader
}

type Functab struct {
	entry   uintptr
	funcoff uintptr
}

type Bitvector struct {
	n        int32 // # of bits
	bytedata *uint8
}
