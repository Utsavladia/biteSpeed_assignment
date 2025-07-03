import React from 'react';
import { FaRobot, FaRegKeyboard, FaRegCalendarAlt, FaRegImage, FaRegCheckCircle, FaRegListAlt, FaSearch } from 'react-icons/fa';
import { MdInput, MdTextFields, MdFunctions, MdToggleOn, MdOutput } from 'react-icons/md';
import { LuFileText, LuFileInput } from "react-icons/lu";


// Map node types to icon components
const iconMap = {
    customInput: LuFileInput,
    llm: FaRobot,
    customOutput: MdOutput,
    text: LuFileText,
    math: MdFunctions,
    image: FaRegImage,
    date: FaRegCalendarAlt,
    toggle: MdToggleOn,
    select: FaRegListAlt,
    search: FaSearch,
};

export const Icon = ({ iconName, size = 24, ...props }) => {
    const IconComponent = iconMap[iconName] || FaRegKeyboard;
    return <IconComponent size={size} {...props} />;
}; 