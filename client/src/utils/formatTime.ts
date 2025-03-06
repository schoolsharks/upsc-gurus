export function convertSecondsToTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
  
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
  
  export function convertSecondToTimeDecimalFormat(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
  
    // Convert the remaining seconds into a decimal part
    const decimalPart = remainingSeconds / 60;
  
    // Combine minutes and decimal part into a string with 2 decimal places
    const result = (minutes + decimalPart).toFixed(2);
    return result;
  }
  