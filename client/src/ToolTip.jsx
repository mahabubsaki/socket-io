import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';

const ToolTip = ({ title, children }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={0} >
                <TooltipTrigger asChild >
                    <div>{children}</div>
                </TooltipTrigger>
                <TooltipContent>
                    {title}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ToolTip;