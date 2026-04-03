adj_matrix = [
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0]
]

def clone_graph(adj_matrix):
    # TODO: implement using BFS/DFS
    visited = [False] * len(adj_matrix)
    dfs(0, visited, adj_matrix)

def dfs(node, visited, adj_matrix):
    visited[node] = True
    for i in range(len(adj_matrix)):
        if adj_matrix[node][i] == 1 and not visited[i]:
            dfs(i, visited, adj_matrix)

clone_graph(adj_matrix)
