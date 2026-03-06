package com.algoflow.runner;

import java.util.*;

public class IteratorTestExample {

    List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30, 40, 50));

    void search(int target) {
        System.out.println("Searching for " + target);

        for (int val : numbers) {
            System.out.println("Checking " + val);
            if (val == target) {
                System.out.println("Found " + target + "!");
                return;
            }
        }

        System.out.println(target + " not found");
    }

    public static void main(String[] args) {
        new IteratorTestExample().search(30);
    }
}
