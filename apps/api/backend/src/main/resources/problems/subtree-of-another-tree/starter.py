class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_subtree(root, sub_root):
    # TODO: implement
    return False

root = TreeNode(3, TreeNode(4, TreeNode(1), TreeNode(2)), TreeNode(5))
sub_root = TreeNode(4, TreeNode(1), TreeNode(2))
print(is_subtree(root, sub_root))
