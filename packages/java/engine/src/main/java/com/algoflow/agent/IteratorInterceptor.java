package com.algoflow.agent;

import net.bytebuddy.asm.Advice;

public class IteratorInterceptor {

    static class NextInterceptor {
        @Advice.OnMethodExit
        static void onNext(@Advice.This Object iterator) {
            if (VisualizerBridge.iteratorNextListener != null)
                VisualizerBridge.iteratorNextListener.accept(iterator);
        }
    }

    static class CreatedInterceptor {
        @Advice.OnMethodExit
        static void onIterator(@Advice.This Object collection, @Advice.Return Object iterator) {
            if (VisualizerBridge.iteratorCreatedListener != null)
                VisualizerBridge.iteratorCreatedListener.accept(collection, iterator);
        }
    }
}
