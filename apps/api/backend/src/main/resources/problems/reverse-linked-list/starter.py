class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # TODO: implement
    return head

head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
result = reverse_list(head)
while result:
    print(result.val, end=" ")
    result = result.next
