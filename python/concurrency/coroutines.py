from typing import Callable, Generator, TypeVar

T = TypeVar('T')


# Generator signature order: [yield-type, send-type, return-type]
def call_generator(g: Generator[T, T, T], first_run: bool, val: T) -> T:
    try:
        return g.send(None if first_run else val)  # this will reassign the yielded variable
    except StopIteration as e:
        return e.value  # this will be the return value


def run_coroutine():
    def num_gen(upper: int, predicate: Callable[[int], bool]) -> Generator[int, int, int]:
        i = 0
        while i < upper:
            if predicate(i):
                i = yield i  # yield i to caller, and reassign i when called resumes via send(x)
            else:
                i = i + 1
        return -1

    even_gen = num_gen(20, lambda i: i % 2 == 0)
    odd_gen = num_gen(20, lambda i: i % 2 == 1)
    a1: int = 0
    a2: int = 0
    idx: int = 0
    while True:
        a1 = call_generator(even_gen, idx == 0, a1 + 1)
        print('even coroutine yielded {}'.format(a1))
        a2 = call_generator(odd_gen, idx == 0, a2 + 1)
        print('odd coroutine yielded {}'.format(a2))
        if a1 == -1 and a2 == -1:
            break
        idx = idx + 1


def main():
    run_coroutine()


if __name__ == "__main__":
    main()
