# AlgoTransformer - Automatic Algorithm Visualization

Zero-learning-curve algorithm visualization using bytecode transformation.

## Build

```bash
mvn clean package
```

## Run

```bash
java -javaagent:target/algo-transformer-1.0-SNAPSHOT.jar \
     -cp target/algo-transformer-1.0-SNAPSHOT.jar \
     --add-opens java.base/java.util=ALL-UNNAMED \
     --add-opens java.base/javax.net.ssl=ALL-UNNAMED \
     com.algoflow.runner.YourExample
```

## The Problem

Existing tools require manual instrumentation:
```java
array.select(i);
Tracer.delay();
array.patch(i, value);
Tracer.delay();
```

## The Solution

Write normal code, visualization happens automatically:
```java
int[] arr = {5, 2, 8, 1};
// Just declare fields — the agent auto-detects and visualizes them

arr[0] = 10;  // Auto-visualized!
```

## Supported Data Structures

| Type | Declaration | Visualization |
|------|-----------|---------------|
| Primitive 1D arrays | `int[] arr`, `boolean[] visited` | Array1DTracer |
| Primitive 2D arrays | `int[][] matrix` | Array2DTracer |
| Graphs | `@Graph int[][] adjMatrix` | GraphTracer (adjacency matrix) |
| Lists | `List<Integer> list` | Array1DTracer |
| 2D Lists | `List<List<Integer>> grid` | Array2DTracer |
| Queues/Deques | `Queue<Integer> q = new LinkedList<>()` | Array1DTracer |
| PriorityQueues | `PriorityQueue<Integer> pq` | Array1DTracer |

### `@Graph` Options

```java
@Graph                          // undirected, unweighted
@Graph(directed = true)         // directed
@Graph(weighted = true)         // weighted
@Graph(directed = true, weighted = true)
```

> **Note:** Only `int[][]` adjacency matrices are supported. Map and List-based adjacency representations are not supported due to JVM bootstrap recursion issues.

## Auto-Tracked Panels

- **CallStack** — method enter/exit tracking for runner classes
- **Locals** — local variable updates within methods
- **Console** — `System.out.println` calls from runner code only

## How It Works

1. **ByteBuddy Agent** — transforms bytecode at class load time
2. **Field Scanning** — `VisualizerInitializer` auto-registers fields as visualizers on construction
3. **Array Interception** — `ArrayAccessWrapper` rewrites `IALOAD`/`IASTORE` etc. to call `VisualizerRegistry`
4. **Collection Interception** — `CollectionInterceptor` / `ListInterceptor` intercept `add`/`remove`/`get`/`set`/`poll`/`offer`/`push`/`pop`/`clear`
5. **Reentrant Guard** — `ThreadLocal<Boolean>` prevents recursive interception from JVM-internal collection usage
6. **Console Filtering** — `StackWalker`-based check ensures only runner `println` calls are logged

## Architecture

```
agent/
├── VisualizerAgent.java          # Premain entry, wires ByteBuddy transforms
├── VisualizerBridge.java         # Bootstrap-loaded bridge (listeners)
├── ArrayAccessWrapper.java       # ASM visitor for array read/write
├── CollectionInterceptor.java    # Advice for add/remove/clear
├── ListInterceptor.java          # Advice for get/set (index-based)
├── PrintStreamInterceptor.java   # Advice for println
├── ConstructorInterceptor.java   # Triggers field auto-scan
├── RecursionInterceptor.java     # Method enter/exit for CallStack
├── LocalVariableTrackerWrapper.java  # Tracks local variable stores
└── StaticInitInterceptor.java    # Static field scanning

annotation/
├── Graph.java                    # @Graph(directed, weighted)
└── ...

visualiser/
├── VisualizerRegistry.java       # Central dispatch for all events
├── VisualizerInitializer.java    # Auto-scans fields, creates visualizers
├── GraphVisualizer.java          # Graph visit/leave with source tracking
├── Array1DVisualiser.java        # List/Collection → Array1DTracer
├── PrimitiveArray1DVisualizer.java   # int[]/boolean[] → Array1DTracer
├── Array2DVisualiser.java        # List<List> → Array2DTracer
├── PrimitiveArray2DVisualizer.java   # int[][] → Array2DTracer
├── CallStackVisualizer.java      # Method call stack
├── LocalVariablesVisualizer.java # Local variable table
└── LogVisualizer.java            # Console output
```

## Limitations

- `@Graph` only supports `int[][]` — intercepting `HashMap`/`Iterator` causes JVM bootstrap recursion
- Collections must be declared as fields — auto-registration of unknown collections is disabled
- `for-each` over collections uses `Iterator` which cannot be safely intercepted — use indexed `for` loops with `get(i)` for visualization
