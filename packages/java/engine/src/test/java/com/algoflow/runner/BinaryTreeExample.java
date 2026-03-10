package com.algoflow.runner;

import com.algoflow.annotation.Tree;

public class BinaryTreeExample {

    static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode(int val) { this.val = val; }
    }

    @Tree
    TreeNode root;

    void insert(int val) {
        root = insertRec(root, val);
    }

    TreeNode insertRec(TreeNode node, int val) {
        if (node == null) return new TreeNode(val);
        if (val < node.val) {
            node.left = insertRec(node.left, val);
        } else {
            node.right = insertRec(node.right, val);
        }
        return node;
    }

    void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        System.out.println(node.val);
        inorder(node.right);
    }

    public static void main(String[] args) {
        BinaryTreeExample bst = new BinaryTreeExample();
        bst.insert(5);
        bst.insert(3);
        bst.insert(7);
        bst.insert(1);
        bst.insert(4);
        bst.inorder(bst.root);
    }
}
