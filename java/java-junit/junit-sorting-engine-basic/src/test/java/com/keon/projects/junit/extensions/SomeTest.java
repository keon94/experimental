package com.keon.projects.junit.extensions;

import com.keon.projects.junit.annotations.CustomParameterizedTest;

public class SomeTest {

    @CustomParameterizedTest
    public void testFoo() {
        System.out.println("Done!");
    }
}
