#include "gtest/gtest.h"
#include "coroutines.h"

TEST(coroutine_tests, generate_numbers2) {
    std::cout << "generate_numbers test\n";
    Generator<int> g = generate_up_to(10);
    auto i = 0;
    while (g.next()) {
        EXPECT_EQ(i, g.value());
        i++;
    }
}

TEST(coroutine_tests, noop2) {
    std::cout << "noop test\n";
}