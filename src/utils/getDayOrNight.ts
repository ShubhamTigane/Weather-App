/** @format */

// export function getDayOrNightIcon(
//     iconName:string,
//     dateTimeString : string
// ) : string{
//     const hours = new Date(dateTimeString).getHours();

//     const isDayTime = hours >= 6 && hours < 18;

//     return isDayTime ? iconName.replace(/.$/,"d"):iconName.replace(/.$/,"n");


// }

export function getDayOrNightIcon(iconname: string, dateTimeString: string): string {
    const hours = new Date(dateTimeString).getHours();

    const isDayTime = hours >= 6 && hours < 18;

    // Replace the last character of the icon name with 'd' for day or 'n' for night
    return isDayTime ? `${iconname.slice(0, -1)}d` : `${iconname.slice(0, -1)}n`;
}
