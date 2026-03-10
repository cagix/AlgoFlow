package com.algoflow.visualiser;

import org.algorithm_visualizer.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class LocalVariablesVisualizer implements Visualizer {

    private final Array2DTracer _tracer;
    private final Map<String, Object> _variableValues = new LinkedHashMap<>();
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

    public void onVariableUpdate(String variableName, Object value) {
        _variableValues.put(variableName, value);
        updateDisplay(variableName);
    }

    private void updateDisplay(String variableName) {
        String[] names = _variableValues.keySet().toArray(String[]::new);
        Object[][] grid = new Object[names.length][2];
        int patchedRow = -1;

        for (int i = 0; i < names.length; i++) {
            grid[i][0] = names[i];
            grid[i][1] = _variableValues.get(names[i]);
            if (names[i].equals(variableName)) {
                patchedRow = i;
            }
        }

        _tracer.set(grid);
        _tracer.patch(patchedRow, 1);
        Tracer.delay();
        _tracer.depatch(patchedRow, 1);
    }

    @Override
    public Commander getCommander() {
        return _tracer;
    }
}
