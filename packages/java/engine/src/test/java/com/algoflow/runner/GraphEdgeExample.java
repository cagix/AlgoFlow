package com.algoflow.runner;

import com.algoflow.annotation.Graph;

public class GraphEdgeExample {

    @Graph(directed = true, weighted = true)
    int[][] adjMatrix = {{0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0},};

    void buildAndModify() {
        adjMatrix[0][1] = 5;
        adjMatrix[0][2] = 3;
        adjMatrix[1][3] = 7;
        adjMatrix[2][3] = 2;

        // Update weight
        adjMatrix[0][2] = 1;

        // Remove edge
        adjMatrix[1][3] = 0;
    }

    public static void main(String[] args) {
        new GraphEdgeExample().buildAndModify();
    }
}
