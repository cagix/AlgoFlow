package com.algoflow.visualiser;

import org.algorithm_visualizer.*;

import java.lang.reflect.Field;
import java.util.*;

public class LinkedListVisualizer implements Visualizer {

    private final Array1DTracer _tracer;
    private final String _valField;
    private final String _nextField;
    private final Class<?> _nodeClass;
    private final Set<Object> _knownNodes = Collections.newSetFromMap(new IdentityHashMap<>());
    private final List<Object> _orderedNodes = new ArrayList<>();
    // Local variables that point to nodes of this list's type
    private final Map<String, Object> _localHeads = new LinkedHashMap<>();
    private Object _rootOwner;
    private String _rootFieldName;
    private Object _head;
    private Object _lastVisited;

    public LinkedListVisualizer(String name, Object head, Class<?> nodeClass) {
        this._nodeClass = nodeClass;

        String nextField = null;
        String valField = null;
        int selfRefCount = 0;
        for (Field f : nodeClass.getDeclaredFields()) {
            if (java.lang.reflect.Modifier.isStatic(f.getModifiers())) continue;
            if (f.getType() == nodeClass) {
                if (nextField == null) nextField = f.getName();
                selfRefCount++;
            } else if (valField == null) {
                valField = f.getName();
            }
        }
        this._nextField = nextField != null ? nextField : "next";
        this._valField = valField != null ? valField : "val";
        this._head = head;

        String dsType = selfRefCount == 1 ? "SinglyLinkedList" : "LinkedList";
        this._tracer = new Array1DTracer(dsType + ": " + name);

        rebuild();
    }

    public void setRootOwner(Object owner, String fieldName) {
        this._rootOwner = owner;
        this._rootFieldName = fieldName;
    }

    /**
     * Called when a local variable is updated with a value matching our node class.
     * Returns true if we consumed it.
     */
    public boolean onLocalUpdate(String varName, Object value) {
        if (value != null && value.getClass() == _nodeClass) {
            _localHeads.put(varName, value);
            return true;
        }
        // If set to null, remove tracking
        if (_localHeads.containsKey(varName)) {
            _localHeads.remove(varName);
            return true;
        }
        return false;
    }

    /** Called when a function returns — clear all local head tracking. */
    public void clearLocals() {
        _localHeads.clear();
    }

    private void rebuild() {
        // Collect all "head" pointers: the main head + any locals pointing to nodes
        List<Object> heads = new ArrayList<>();
        if (_head != null) heads.add(_head);
        for (Object localHead : _localHeads.values()) {
            if (localHead != null) heads.add(localHead);
        }

        // Walk from each head, collecting reachable nodes in order, deduplicating
        Set<Object> seen = Collections.newSetFromMap(new IdentityHashMap<>());
        _orderedNodes.clear();
        for (Object h : heads) {
            Object node = h;
            int limit = 1000;
            while (node != null && limit-- > 0) {
                if (seen.contains(node)) break;
                seen.add(node);
                _knownNodes.add(node);
                _orderedNodes.add(node);
                node = getNext(node);
            }
        }

        List<Object> values = new ArrayList<>();
        for (Object n : _orderedNodes) values.add(getNodeValue(n));
        _tracer.set(values);
        Tracer.delay();
    }

    private int indexOf(Object node) {
        for (int i = 0; i < _orderedNodes.size(); i++) {
            if (_orderedNodes.get(i) == node) return i;
        }
        return -1;
    }

    public void onFieldGet(Object owner, String fieldName) {
        if (!_knownNodes.contains(owner)) return;

        if (fieldName.equals(_nextField)) {
            Object next = getNext(owner);
            if (next != null && _knownNodes.contains(next)) {
                int idx = indexOf(next);
                if (idx >= 0) {
                    leaveLastVisited();
                    _lastVisited = next;
                    _tracer.select(idx);
                    Tracer.delay();
                }
            }
            return;
        }

        int idx = indexOf(owner);
        if (idx >= 0) {
            leaveLastVisited();
            _lastVisited = owner;
            _tracer.select(idx);
            Tracer.delay();
        }
    }

    public void onFieldSet(Object owner, String fieldName) {
        if (owner == _rootOwner && fieldName.equals(_rootFieldName)) {
            _head = getField(_rootOwner, _rootFieldName);
            rebuild();
            return;
        }

        if (!_knownNodes.contains(owner)) return;

        if (fieldName.equals(_valField)) {
            int idx = indexOf(owner);
            if (idx >= 0) {
                _tracer.patch(idx, getNodeValue(owner));
                Tracer.delay();
                _tracer.depatch(idx);
            }
            return;
        }

        if (fieldName.equals(_nextField)) {
            // New node being linked in — add to known
            Object next = getNext(owner);
            if (next != null) _knownNodes.add(next);
            rebuild();
        }
    }

    public boolean isTrackedNode(Object obj) {
        return _knownNodes.contains(obj) || obj == _rootOwner;
    }

    public Class<?> getNodeClass() {
        return _nodeClass;
    }

    private void leaveLastVisited() {
        if (_lastVisited != null) {
            int idx = indexOf(_lastVisited);
            if (idx >= 0) {
                _tracer.deselect(idx);
            }
            _lastVisited = null;
        }
    }

    private Object getNodeValue(Object node) {
        try {
            Field f = node.getClass().getDeclaredField(_valField);
            f.setAccessible(true);
            return f.get(node);
        } catch (Exception e) {
            return 0;
        }
    }

    private Object getNext(Object node) {
        return getField(node, _nextField);
    }

    private Object getField(Object obj, String fieldName) {
        try {
            Field f = obj.getClass().getDeclaredField(fieldName);
            f.setAccessible(true);
            return f.get(obj);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Commander getCommander() {
        return _tracer;
    }
}
