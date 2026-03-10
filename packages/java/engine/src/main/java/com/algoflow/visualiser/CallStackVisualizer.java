package com.algoflow.visualiser;

import org.algorithm_visualizer.*;
import java.util.*;

public class CallStackVisualizer implements Visualizer {

    private final Array2DTracer _tracer;
    private final Deque<CallEntry> _callStack = new ArrayDeque<>();
    private final Map<String, Integer> _activeMethodCounts = new HashMap<>();

    public CallStackVisualizer(String name) {
        this._tracer = new Array2DTracer(name);
    }

    public void onEnter(String methodName, Object[] args) {
        int count = _activeMethodCounts.getOrDefault(methodName, 0);
        boolean recursive = count > 0;
        _activeMethodCounts.put(methodName, count + 1);

        _callStack.addFirst(new CallEntry(methodName, args, recursive));
        updateDisplay(false);
    }

    public void onExit(String methodName, Object result) {
        if (_callStack.isEmpty())
            return;

        if (result != null) {
            CallEntry top = _callStack.removeFirst();
            _callStack.addFirst(new CallEntry(top.label + " → " + result, top.recursive));
        }
        updateDisplay(true);
        _callStack.removeFirst();

        int count = _activeMethodCounts.getOrDefault(methodName, 1) - 1;
        if (count <= 0) {
            _activeMethodCounts.remove(methodName);
        } else {
            _activeMethodCounts.put(methodName, count);
        }

        updateDisplay(false);
    }

    private void updateDisplay(boolean patchTop) {
        Object[][] grid = new Object[_callStack.size()][2];
        int i = 0;
        for (CallEntry entry : _callStack) {
            grid[i][0] = entry.label;
            grid[i][1] = entry.recursive ? "recursive" : "";
            i++;
        }
        _tracer.set(grid);
        if (!_callStack.isEmpty()) {
            if (patchTop) {
                _tracer.patch(0, 0);
            } else {
                _tracer.select(0, 0);
                if (_callStack.size() > 1) {
                    _tracer.deselect(0, 1);
                }
            }
            Tracer.delay();
        }
    }

    @Override
    public Commander getCommander() {
        return _tracer;
    }

    private record CallEntry(String label, boolean recursive) {
        CallEntry(String methodName, Object[] args, boolean recursive) {
            this(formatCall(methodName, args), recursive);
        }

        private static String formatCall(String methodName, Object[] args) {
            if (args == null || args.length == 0)
                return methodName + "()";
            StringBuilder sb = new StringBuilder(methodName).append("(");
            for (int i = 0; i < args.length; i++) {
                if (i > 0)
                    sb.append(", ");
                sb.append(args[i]);
            }
            return sb.append(")").toString();
        }
    }
}
