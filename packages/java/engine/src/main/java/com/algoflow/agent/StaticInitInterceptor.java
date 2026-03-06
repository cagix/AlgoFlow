package com.algoflow.agent;

import com.algoflow.visualiser.VisualizerInitializer;
import net.bytebuddy.asm.Advice;

public class StaticInitInterceptor {
    
    @Advice.OnMethodExit
    public static void onStaticInit(@Advice.Origin Class<?> clazz) {
        VisualizerInitializer.scanStatics(clazz);
    }
}
