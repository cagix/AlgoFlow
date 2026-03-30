package com.algoflow.visualiser;

import org.algorithm_visualizer.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class LocalVariablesVisualizer implements Visualizer {

    private final Array2DTracer _tracer;
    private final Deque<Frame> _frames = new ArrayDeque<>();
    private static final Map<String, Map<Integer, String>> slotNameRegistry = new ConcurrentHashMap<>();

    public LocalVariablesVisualizer(String name) {
        this._tracer = new Array2DTracer(name);
    }

    public static void registerSlotName(String methodKey, int slot, String name) {
        slotNameRegistry.computeIfAbsent(methodKey, k -> new ConcurrentHashMap<>()).put(slot, name);
    }

    public static String getSlotName(String methodKey, int slot) {
        return slotNameRegistry.getOrDefault(methodKey, Map.of()).get(slot);
    }

    public void pushFrame(String methodName) {
        _frames.addFirst(new Frame(methodName));
        updateDisplay(null);
    }

    public void popFrame() {
        if (!_frames.isEmpty()) {
            _frames.removeFirst();
            updateDisplay(null);
        }
    }

    public void onVariableUpdate(String variableName, Object value) {
        if (_frames.isEmpty()) return;
        Frame top = _frames.peekFirst();
        top.variables.put(variableName, value);
        updateDisplay(variableName);
    }

    private void updateDisplay(String patchedVariable) {
        List<Object[]> rows = new ArrayList<>();
        int patchedRow = -1;
        int rowIdx = 0;

        for (Frame frame : _frames) {
            // Header row for this frame
            rows.add(new Object[]{"▸ " + frame.methodName, ""});
            rowIdx++;

            for (Map.Entry<String, Object> entry : frame.variables.entrySet()) {
                rows.add(new Object[]{"  " + entry.getKey(), entry.getValue()});
                if (frame == _frames.peekFirst() && entry.getKey().equals(patchedVariable)) {
                    patchedRow = rowIdx;
                }
                rowIdx++;
            }
        }

        _tracer.set(rows.toArray(Object[][]::new));
        if (patchedRow >= 0) {
            _tracer.patch(patchedRow, 1);
            Tracer.delay();
            _tracer.depatch(patchedRow, 1);
        } else {
            Tracer.delay();
        }
    }

    @Override
    public Commander getCommander() {
        return _tracer;
    }

    private static class Frame {
        final String methodName;
        final Map<String, Object> variables = new LinkedHashMap<>();

        Frame(String methodName) {
            this.methodName = methodName;
        }
    }
}
