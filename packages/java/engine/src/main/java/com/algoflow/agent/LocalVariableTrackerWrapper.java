package com.algoflow.agent;

import net.bytebuddy.asm.AsmVisitorWrapper;
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.field.FieldList;
import net.bytebuddy.description.method.MethodList;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.implementation.Implementation;
import net.bytebuddy.jar.asm.*;
import net.bytebuddy.pool.TypePool;

import java.util.*;

public class LocalVariableTrackerWrapper implements AsmVisitorWrapper {

    @Override
    public int mergeWriter(int flags) {
        return flags | ClassWriter.COMPUTE_FRAMES;
    }

    @Override
    public int mergeReader(int flags) {
        return flags | ClassReader.EXPAND_FRAMES;
    }

    @Override
    public ClassVisitor wrap(TypeDescription instrumentedType, ClassVisitor classVisitor,
            Implementation.Context implementationContext, TypePool typePool,
            FieldList<FieldDescription.InDefinedShape> fields, MethodList<?> methods, int writerFlags,
            int readerFlags) {
        return new LocalVariableClassVisitor(classVisitor, instrumentedType);
    }

    private static class LocalVariableClassVisitor extends ClassVisitor {
        private final TypeDescription instrumentedType;

        public LocalVariableClassVisitor(ClassVisitor cv, TypeDescription instrumentedType) {
            super(Opcodes.ASM9, cv);
            this.instrumentedType = instrumentedType;
        }

        @Override
        public MethodVisitor visitMethod(int access, String name, String descriptor, String signature,
                String[] exceptions) {
            MethodVisitor mv = super.visitMethod(access, name, descriptor, signature, exceptions);
            if (name.equals("<init>") || name.equals("<clinit>"))
                return mv;

            String methodKey = instrumentedType.getName() + "#" + name + descriptor;
            return new LocalVariableMethodVisitor(mv, methodKey);
        }
    }

    private static class LocalVariableMethodVisitor extends MethodVisitor {
        private final String methodKey;

        public LocalVariableMethodVisitor(MethodVisitor mv, String methodKey) {
            super(Opcodes.ASM9, mv);
            this.methodKey = methodKey;
        }

        @Override
        public void visitLocalVariable(String name, String descriptor, String signature, Label start, Label end,
                int index) {
            if (!name.equals("this")) {
                com.algoflow.visualiser.LocalVariablesVisualizer.registerSlotName(methodKey, index, name);
            }
            super.visitLocalVariable(name, descriptor, signature, start, end, index);
        }

        @Override
        public void visitEnd() {
            super.visitEnd();
        }

        @Override
        public void visitVarInsn(int opcode, int varIndex) {
            super.visitVarInsn(opcode, varIndex);

            if (opcode == Opcodes.ISTORE || opcode == Opcodes.LSTORE || opcode == Opcodes.FSTORE
                    || opcode == Opcodes.DSTORE || opcode == Opcodes.ASTORE) {

                injectTrackingCall(opcode, varIndex);
            }
        }

        @Override
        public void visitIincInsn(int varIndex, int increment) {
            super.visitIincInsn(varIndex, increment);
            injectTrackingCall(Opcodes.ISTORE, varIndex);
        }

        private void injectTrackingCall(int storeOpcode, int varIndex) {
            super.visitLdcInsn(methodKey);
            super.visitLdcInsn(varIndex);
            int loadOpcode = getLoadOpcode(storeOpcode);
            super.visitVarInsn(loadOpcode, varIndex);
            boxIfNeeded(storeOpcode);

            super.visitMethodInsn(Opcodes.INVOKESTATIC, "com/algoflow/visualiser/VisualizerRegistry",
                    "onLocalVariableUpdate", "(Ljava/lang/String;ILjava/lang/Object;)V", false);
        }

        private int getLoadOpcode(int storeOpcode) {
            return switch (storeOpcode) {
                case Opcodes.ISTORE -> Opcodes.ILOAD;
                case Opcodes.LSTORE -> Opcodes.LLOAD;
                case Opcodes.FSTORE -> Opcodes.FLOAD;
                case Opcodes.DSTORE -> Opcodes.DLOAD;
                case Opcodes.ASTORE -> Opcodes.ALOAD;
                default -> throw new IllegalArgumentException("Unknown store opcode: " + storeOpcode);
            };
        }

        private void boxIfNeeded(int storeOpcode) {
            switch (storeOpcode) {
                case Opcodes.ISTORE -> super.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Integer", "valueOf",
                        "(I)Ljava/lang/Integer;", false);
                case Opcodes.LSTORE -> super.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Long", "valueOf",
                        "(J)Ljava/lang/Long;", false);
                case Opcodes.FSTORE -> super.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Float", "valueOf",
                        "(F)Ljava/lang/Float;", false);
                case Opcodes.DSTORE -> super.visitMethodInsn(Opcodes.INVOKESTATIC, "java/lang/Double", "valueOf",
                        "(D)Ljava/lang/Double;", false);
                default -> {}
            }
        }
    }
}
