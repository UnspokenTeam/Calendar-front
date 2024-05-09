import {Button} from '@/components/ui/button'
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import {cn} from '@/lib/utils'
import {Paintbrush} from 'lucide-react'
import {ColorMapper, type Colors} from "@/types/Events";
import React from "react";

export function GradientPicker({
                                   value,
                                   onChange,
                                   className,
                                    ref
                               }: {
    value: Colors
    onChange: (background: string) => void
    className?: string
    ref: React.ForwardedRef<HTMLDivElement>
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-[220px] justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <div className="w-full flex items-center gap-2">
                        {value ? (
                            <div
                                className={cn("h-4 w-4 rounded-full !bg-center !bg-cover transition-all", ColorMapper[value])}
                            ></div>
                        ) : (
                            <Paintbrush className="h-4 w-4"/>
                        )}
                        <div className="truncate flex-1">
                            {value}
                        </div>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" ref={ref}>
                <div className="grid grid-cols-5 gap-4 w-full">
                    {Object.entries(ColorMapper).map(([key, value]) => (
                        <TooltipProvider key={key}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div
                                        className={cn("rounded-full h-6 w-6 cursor-pointer active:scale-105", value)}
                                        onClick={() => onChange(key)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {key}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

const GradientButton = ({
                            background,
                            children,
                        }: {
    background: string
    children: React.ReactNode
}) => {
    return (
        <div
            className="p-0.5 rounded-md relative !bg-cover !bg-center transition-all"
            style={{background}}
        >
            <div className="bg-popover/80 rounded-md p-1 text-xs text-center">
                {children}
            </div>
        </div>
    )
}