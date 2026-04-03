class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # TODO: implement
    return None

l1 = ListNode(1, ListNode(2, ListNode(4)))
l2 = ListNode(1, ListNode(3, ListNode(4)))
result = merge_two_lists(l1, l2)
while result:
    print(result.val, end=" ")
    result = result.next
