#include "coroutines.h"
#include <coroutine>

template<typename T>
Generator<T> Generator<T>::Promise::get_return_object() {
    return Generator<T>{std::coroutine_handle<Promise>::from_promise(*this)};
}

template<typename T>
std::suspend_always Generator<T>::Promise::initial_suspend() {
    return {};
}

template<typename T>
std::suspend_always Generator<T>::Promise::yield_value(T x) {
    val = x;
    return {};
}

// called by compiler for coroutine without return
template<typename T>
void Generator<T>::Promise::return_void() {
}

// called by compiler last thing to await final result
// coroutine cannot be resumed after this is called
template<typename T>
std::suspend_always Generator<T>::Promise::final_suspend() noexcept {
    return {};
}

template<typename T>
void Generator<T>::Promise::unhandled_exception() {}

template<typename T>
Generator<T>::Generator(std::coroutine_handle<Promise> h) : coro(h) {}

template<typename T>
Generator<T>::~Generator<T>() {
    if (coro)
        coro.destroy();
}

// get current value of coroutine
template<typename T>
T Generator<T>::value() {
    return coro.promise().val;
}

// advance coroutine past suspension
template<typename T>
bool Generator<T>::next() {
    coro.resume();
    return !coro.done();
}


