class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head):
    # TODO: implement
    pass

head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
reorder_list(head)
while head:
    print(head.val, end=" ")
    head = head.next
