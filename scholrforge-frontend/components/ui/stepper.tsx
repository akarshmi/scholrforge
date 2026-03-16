"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepperProps {
    steps: string[]
    currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                    <div
                        className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                            index <= currentStep
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        {index + 1}
                    </div>

                    <span className="text-xs mt-2 text-center">{step}</span>

                    {index !== steps.length - 1 && (
                        <div className="flex-1 h-px bg-border w-full mt-2" />
                    )}
                </div>
            ))}
        </div>
    )
}