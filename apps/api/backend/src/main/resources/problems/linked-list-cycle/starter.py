class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head):
    # TODO: implement
    return False

head = ListNode(3, ListNode(2, ListNode(0, ListNode(-4))))
head.next.next.next.next = head.next  # cycle
print(has_cycle(head))
