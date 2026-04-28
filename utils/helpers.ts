export const withAlpha = (color: string, alpha: number) => {
    if (color.startsWith("#")) {
        return `${color}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
    }

    const nums = color.match(/\d+/g);
    if (!nums || nums.length < 3) {
        // fallback to black if the color string doesn't contain RGB values
        return `rgba(0, 0, 0, ${alpha})`;
    }

    return `rgba(${nums.slice(0, 3).join(", ")}, ${alpha})`;
};
