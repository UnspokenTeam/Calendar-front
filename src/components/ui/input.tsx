import * as React from "react"

import {cn} from "@/lib/utils"
import {LucideIcon, LucideProps} from "lucide-react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    startIcon?: LucideIcon;
    endIcon?: LucideIcon;
    iconProps?: LucideProps;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, startIcon, endIcon, iconProps = {}, ...props}, ref) => {

        const StartIcon = startIcon;
        const EndIcon = endIcon;
        const {className: iconClassName, ...iconRest} = iconProps;

        return (
            <div className="w-full relative">
                {StartIcon && (
                    <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
                        <StartIcon
                            size={18}
                            className={cn("text-muted-foreground", iconClassName)}
                            {...iconRest}
                        />
                    </div>
                )}
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    className,
                    startIcon ? "pl-8" : "",
                    endIcon ? "pr-8" : "",
                )}
                ref={ref}
                {...props}
            />
                {EndIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <EndIcon
                            className={cn("text-muted-foreground", iconClassName)}
                            {...iconRest}
                            size={18}
                        />
                    </div>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export {Input}
