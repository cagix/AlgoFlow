export interface Algorithm {
    name: string;
    category: string;
    code: string;
}

export const ALGORITHMS: Algorithm[] = [
    // Sorting
    {
        name: "Bubble Sort",
        category: "Sorting",
        code: `public class Main {
    private int[] arr = {5, 3, 8, 1, 9, 2, 7};

    public static void main(String[] args) {
        new Main().bubbleSort();
    }

    public void bubbleSort() {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    },
    {
        name: "Selection Sort",
        category: "Sorting",
        code: `public class Main {
    private int[] arr = {5, 3, 8, 1, 9, 2, 7};

    public static void main(String[] args) {
        new Main().selectionSort();
    }

    public void selectionSort() {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
    }
}`,
    },
    {
        name: "Insertion Sort",
        category: "Sorting",
        code: `public class Main {
    private int[] arr = {5, 3, 8, 1, 9, 2, 7};

    public static void main(String[] args) {
        new Main().insertionSort();
    }

    public void insertionSort() {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
    },
    {
        name: "Quick Sort",
        category: "Sorting",
        code: `public class Main {
    private int[] arr = {5, 3, 8, 1, 9, 2, 7};

    public static void main(String[] args) {
        new Main().quickSort();
    }

    public void quickSort() {
        qs(0, arr.length - 1);
    }

    private void qs(int lo, int hi) {
        if (lo < hi) {
            int p = partition(lo, hi);
            qs(lo, p - 1);
            qs(p + 1, hi);
        }
    }

    private int partition(int lo, int hi) {
        int pivot = arr[lo];
        int i = lo + 1, j = hi;
        while (true) {
            while (i <= j && arr[i] <= pivot) i++;
            while (i <= j && arr[j] > pivot) j--;
            if (i >= j) break;
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        int tmp = arr[lo]; arr[lo] = arr[j]; arr[j] = tmp;
        return j;
    }
}`,
    },
    {
        name: "Merge Sort",
        category: "Sorting",
        code: `public class Main {
    private int[] arr = {5, 3, 8, 1, 9, 2, 7};
    private int[] temp = new int[7];

    public static void main(String[] args) {
        new Main().mergeSort();
    }

    public void mergeSort() {
        mergeSortHelper(0, arr.length - 1);
    }

    private void mergeSortHelper(int start, int end) {
        if (start >= end) return;
        int mid = (start + end) / 2;
        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
    }

    private void merge(int start, int mid, int end) {
        int i = start, j = mid + 1, k = start;
        while (i <= mid && j <= end) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= end) temp[k++] = arr[j++];
        for (i = start; i <= end; i++) arr[i] = temp[i];
    }
}`,
    },
    // Searching
    {
        name: "Binary Search",
        category: "Searching",
        code: `public class Main {
    private int[] arr = {1, 3, 5, 7, 9, 11, 13, 15, 17};

    public static void main(String[] args) {
        new Main().binarySearch(7);
    }

    public int binarySearch(int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
}`,
    },
    {
        name: "Linear Search",
        category: "Searching",
        code: `public class Main {
    private int[] arr = {5, 3, 8, 1, 9, 2, 7};

    public static void main(String[] args) {
        new Main().linearSearch(9);
    }

    public int linearSearch(int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`,
    },
    // Graphs
    {
        name: "BFS",
        category: "Graphs",
        code: `import java.util.*;
import com.algoflow.annotation.Graph;

public class Main {
    @Graph
    private int[][] adjMatrix = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 1, 1, 0},
        {1, 0, 0, 0, 1, 0},
        {0, 1, 0, 0, 0, 1},
        {0, 1, 1, 0, 0, 1},
        {0, 0, 0, 1, 1, 0}
    };

    public static void main(String[] args) {
        new Main().bfs(0);
    }

    public void bfs(int start) {
        boolean[] visited = new boolean[adjMatrix.length];
        Queue<Integer> queue = new LinkedList<>();
        visited[start] = true;
        queue.add(start);
        while (!queue.isEmpty()) {
            int current = queue.poll();
            for (int neighbor = 0; neighbor < adjMatrix.length; neighbor++) {
                if (adjMatrix[current][neighbor] == 1 && !visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.add(neighbor);
                }
            }
        }
    }
}`,
    },
    {
        name: "DFS",
        category: "Graphs",
        code: `import com.algoflow.annotation.Graph;

public class Main {
    @Graph
    private int[][] adjMatrix = {
        {0, 1, 1, 0, 0, 0},
        {1, 0, 0, 1, 1, 0},
        {1, 0, 0, 0, 1, 0},
        {0, 1, 0, 0, 0, 1},
        {0, 1, 1, 0, 0, 1},
        {0, 0, 0, 1, 1, 0}
    };
    private boolean[] visited = new boolean[6];

    public static void main(String[] args) {
        new Main().dfs(0);
    }

    public void dfs(int node) {
        visited[node] = true;
        for (int neighbor = 0; neighbor < adjMatrix.length; neighbor++) {
            if (adjMatrix[node][neighbor] == 1 && !visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }
}`,
    },
    // Strings
    {
        name: "KMP String Search",
        category: "Strings",
        code: `public class Main {
    public static void main(String[] args) {
        new Main().kmpSearch("ABABDABACDABABCABAB", "ABABCABAB");
    }

    public void kmpSearch(String text, String pattern) {
        int[] lps = buildLPS(pattern);
        int i = 0, j = 0;
        while (i < text.length()) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
            }
            if (j == pattern.length()) {
                System.out.println("Pattern found at index " + (i - j));
                j = lps[j - 1];
            } else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
                if (j != 0) j = lps[j - 1];
                else i++;
            }
        }
    }

    private int[] buildLPS(String pattern) {
        int[] lps = new int[pattern.length()];
        int len = 0, i = 1;
        while (i < pattern.length()) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                lps[i++] = ++len;
            } else if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
        return lps;
    }
}`,
    },
    // Dynamic Programming
    {
        name: "Fibonacci (Memoized)",
        category: "Dynamic Programming",
        code: `import java.util.*;

public class Main {
    private Map<Integer, Long> memo = new HashMap<>();

    public static void main(String[] args) {
        new Main().fib(10);
    }

    public long fib(int n) {
        if (n <= 1) return n;
        if (memo.containsKey(n)) return memo.get(n);
        long result = fib(n - 1) + fib(n - 2);
        memo.put(n, result);
        return result;
    }
}`,
    },
];

export const CATEGORIES = [...new Set(ALGORITHMS.map(a => a.category))];
