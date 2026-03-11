# AlgoFlow Backend

Spring Boot REST API that compiles and executes user-submitted Java code with the algoflow engine agent, returning visualization commands.

## Prerequisites

- Java 21
- Maven
- [algoflow engine](../../../packages/java/engine) JAR built (`mvn package` in the engine directory)

## Build & Run

```bash
mvn clean package
mvn spring-boot:run
```

Server starts on `http://localhost:8080`.

## Configuration

| Property | Default | Description |
|---|---|---|
| `engine.jar.path` | `../../../packages/java/engine/target/algo-transformer-1.0-SNAPSHOT.jar` | Path to the algoflow engine JAR |

## API

### POST /execute

Compiles the submitted Java code, runs it with the algoflow engine agent, and returns the generated visualization commands along with the normalized code.

**Request:**
```json
{
  "code": "public class BubbleSort { public static void main(String[] args) { ... } }"
}
```

**Success Response (200):**
```json
{
  "commands": [
    { "key": "arr", "method": "Array1DTracer", "args": ["Array"] },
    { "key": "arr", "method": "set", "args": [[1, 2, 3]] }
  ],
  "code": "package com.algoflow.runner;\n\npublic class BubbleSort { ... }"
}
```

**Error Response (400):**
```json
{
  "error": "Compilation failed: ..."
}
```

## How It Works

1. Extracts the public class name from the submitted code
2. Rewrites the package declaration to `com.algoflow.runner`
3. Writes to a temp file, compiles with `javac`
4. Runs with the algoflow engine agent which instruments the code to emit visualization commands
5. Reads the generated `visualization.json` and returns it alongside the normalized code
6. Cleans up the temp directory
