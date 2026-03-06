package com.algoflow.agent;

import net.bytebuddy.asm.Advice;

public class PrintStreamInterceptor {

    static class PrintlnInterceptor {
        @Advice.OnMethodEnter
        public static void onPrintln(@Advice.Argument(0) Object message) {
            if (VisualizerBridge.printlnListener != null)
                VisualizerBridge.printlnListener.accept(String.valueOf(message));
        }
    }

    static class PrintInterceptor {
        @Advice.OnMethodEnter
        public static void onPrint(@Advice.Argument(0) Object message) {
            if (VisualizerBridge.printListener != null)
                VisualizerBridge.printListener.accept(String.valueOf(message));
        }
    }
}
