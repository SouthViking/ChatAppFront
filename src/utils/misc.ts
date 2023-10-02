
export const getRGBComponents = (color: string) => {
    const r = color.substring(1, 3);
    const g = color.substring(3, 5);
    const b = color.substring(5, 7);
    
    return { R: parseInt(r, 16), G: parseInt(g, 16), B: parseInt(b, 16) };
};

export const getIdealTextColor = (backgroundColor: string) => {
    const nThreshold = 105;
    const components = getRGBComponents(backgroundColor);
    const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
 
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";   
};