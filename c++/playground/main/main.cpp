#include <iostream>
#include "coroutines.h"

int main() {
    std::cout << "running main\n";
    Generator<int> g = generate_up_to(10);
    while (g.next()) {
        std::cout << g.value() << "\n";
    }
    return 0;
}

