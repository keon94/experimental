#include "coroutines.h"

Generator<int> generate_up_to(int n) {
    for (int i = 0; i < n; ++i) {
        co_yield i;
    }
}

