
function("googletest")
    #    FetchContent_Declare(
    #            googletest
    #            URL https://github.com/google/googletest/archive/e2239ee6043f73722e7aa812a459f54a28552929.zip
    #    )
    FetchContent_Declare(
            googletest
            GIT_REPOSITORY https://github.com/google/googletest
            GIT_TAG release-1.11.0
    )
    # For Windows: Prevent overriding the parent project's compiler/linker settings
    set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(googletest)
endfunction()

function(get_dependencies)
    include(FetchContent)
    foreach (dep IN ITEMS ${ARGN})
        message("fetching ${dep}")
        cmake_language(CALL ${dep})
    endforeach ()

endfunction()


cmake_minimum_required(VERSION 3.10)
project(playground)

set(CMAKE_CXX_STANDARD 23)

file(GLOB_RECURSE src_files RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "src/*.cpp")
file(GLOB_RECURSE h_files RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "include/*.h" "include/*.hpp") #no .tpp files for template implementations because their impl needs to be header-scoped (singletons)
include_directories("include")

message("adding sources: ${h_files} ${src_files}")

#set to 0 to run main/main.cpp, set to 1 to run tests/
set(testing 0)

if (testing)
    get_dependencies("googletest")
    file(GLOB test_files RELATIVE ${CMAKE_CURRENT_SOURCE_DIR} "tests/*_test.cpp")
    message("adding test files: ${test_files}")
    add_executable(playground_test ${h_files} ${src_files} ${test_files} tests/init.cpp)
    # Now simply link against gtest or gtest_main as needed. Eg
    target_link_libraries(playground_test gtest)
else ()
    add_executable(playground ${h_files} ${src_files} main/main.cpp src/coroutines.cpp)
endif (testing)

unset(testing)




