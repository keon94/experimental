#ifndef PLAYGROUND_COROUTINES_H
#define PLAYGROUND_COROUTINES_H

#pragma message("including PLAYGROUND_COROUTINES_H")

#include <iostream>
#include <coroutine>

template<typename T>
struct Generator {

private:

    struct Promise {
        // current value of suspended coroutine
        T val;

        // called by compiler first thing to get coroutine result
        Generator get_return_object();

        // called by compiler first time co_yield occurs
        std::suspend_always initial_suspend();

        // required for co_yield
        std::suspend_always yield_value(T x);

        // called by compiler for coroutine without return
        void return_void();

        // called by compiler last thing to await final result
        // coroutine cannot be resumed after this is called
        std::suspend_always final_suspend() noexcept;

        // out of necessity
        void unhandled_exception();
    };


public:
    // compiler looks for promise_type
    using promise_type [[maybe_unused]] = Promise;

    std::coroutine_handle<Promise> coro;

    explicit Generator(std::coroutine_handle<Promise> h);

    ~Generator();

    // get current value of coroutine
    T value();

    // advance coroutine past suspension
    bool next();

};

Generator<int> generate_up_to(int n);

#include "../src/coroutines.tpp"

#endif

