class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n):
    # TODO: implement
    return head

head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
result = remove_nth_from_end(head, 2)
while result:
    print(result.val, end=" ")
    result = result.next
