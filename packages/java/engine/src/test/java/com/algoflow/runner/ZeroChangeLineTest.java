package com.algoflow.runner;

import java.util.ArrayList;
import java.util.List;

public class ZeroChangeLineTest {

    int[] arr = {1, 2, 3};
    List<Integer> list = new ArrayList<>();

    public static void main(String[] args) {
        ZeroChangeLineTest test = new ZeroChangeLineTest();
        test.run();
    }

    void run() {
        arr[0] = 5;
        arr[1] = 10;
        arr[2] = 15;

        list.add(100);
        list.add(200);
        list.get(0);
        list.set(0, 999);
        list.remove(0);
    }
}