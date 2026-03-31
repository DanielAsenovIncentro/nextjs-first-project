const defaultColor = "bg-[#4b4b4b]";
export const communityColors: Record<number, string> = {
    0: "bg-[#877510]",
    1: "bg-[#874f10]",
    2: "bg-[#871010]",
    3: "bg-[#87107d]",
    4: "bg-[#6b1087]",
    5: "bg-[#2a1087]",
    6: "bg-[#106b87]",
    7: "bg-[#108781]",
    8: "bg-[#0f742d]",
    9: "bg-[#288710]",
}

export function formatCommunityName(name: string, prefix?: boolean) {
    const formattedName = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
    return ((prefix) ? "s/" : "") + formattedName;
}

export function getCommunityColor(colorID: number|undefined|null): string {
    return ((colorID !== undefined && colorID !== null) && communityColors[colorID]) ? communityColors[colorID] : defaultColor
}