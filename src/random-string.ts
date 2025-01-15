interface IRandomString {
    tokenLength?: number;
    datePrefix?: boolean;
}

export const randomString = (options: IRandomString = { tokenLength: 32, datePrefix: true }) => {
    if (options.tokenLength % 2 != 0) {
        options.tokenLength = options.tokenLength + 1;
    }

    const possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let text: string = "";
    for (let i = 0; i < options.tokenLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    let formattedText: string = "";
    for (let i = 0; i < text.length; i++) {
        formattedText += text.charAt(i);
        if ((i + 1) % 4 === 0 && i !== text.length - 1) {
            formattedText += '-';
        }
    }

    if (options.datePrefix) return `${Date.now()}-${formattedText}`;
    return formattedText;
}