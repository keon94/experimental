package com.keon.projects.math.calculator;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

class Operator implements Comparator<Operator> {
    
    public static final char PLUS = '+';
    public static final char MINUS = '-';

    private static final Map<Character, Function> F_MAP = new HashMap<>();
    private static final Map<Character, OperatorClass> C_MAP = new HashMap<>();
    
    static {
        F_MAP.put(PLUS, (a,b) -> a + b);
        F_MAP.put(MINUS, (a,b) -> a - b);
        F_MAP.put('*', (a,b) -> a * b);
        F_MAP.put('/', (a,b) -> a / b);
        F_MAP.put('^', (a,b) -> Math.pow(a, b));
        F_MAP.put('%', (a,b) -> a % b);
        C_MAP.put(PLUS, new OperatorClass(0, true));
        C_MAP.put(MINUS, new OperatorClass(0, true));
        C_MAP.put('*', new OperatorClass(1, true));
        C_MAP.put('/', new OperatorClass(1, true));
        C_MAP.put('^', new OperatorClass(2, false));
        C_MAP.put('%', new OperatorClass(1, true));
    }
    
    private final char op;
    
    public Operator(final char op) {
        if(F_MAP.get(op) == null) {
            throw new RuntimeException("Bad op: " + op);
        }
        this.op = op;
    }
    
    public boolean isSuperiorTo(final Operator other) {
        return compare(this, other) > 0;
    }
    
    public char getOp() {
        return op;
    }
    
    public boolean isInSameClassAs(final Operator other) {
        return compare(this, other) == 0;
    }
    
    public double apply(final double x, final double y) {
        return F_MAP.get(op).apply(x, y);
    }

    private static interface Function {

        double apply(double x, double y);
    }
    
    public static char[] getOps() {
        char[] ops = new char[F_MAP.size()];
        int i = 0;
        for(final char op : F_MAP.keySet()) {
            ops[i] = op;
            i++;
        }
        return ops;
    }

    @Override
    public int compare(Operator o1, Operator o2) {
        return C_MAP.get(o1.op).compare(C_MAP.get(o2.op));        
    }
    
    private static class OperatorClass {
        final int priority;
        final boolean leftEvaluate;
        
        OperatorClass(final int priority, final boolean leftEvaluate) {
            this.priority = priority;
            this.leftEvaluate = leftEvaluate; //true means that a op b op c -> (a op b) op c ; else a op (b op c)
        }

        public int compare(final OperatorClass other) {
            return priority == other.priority ? (leftEvaluate ? 0 : 1) : (priority > other.priority ? 1 : -1);
        }
        
    }
}
