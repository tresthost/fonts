const { fonts } = require('./fonts.json');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const fontsDirectory = './fonts';

if (!fs.existsSync(fontsDirectory)) {
    fs.mkdirSync(fontsDirectory);
}

fonts.forEach(async font => {
    const url = `https://fonts.googleapis.com/css?family=${font.family.replace(' ', '+')}`;
    const response = await axios.get(url);
    const fontFile = response.data.match(/url\((.*?)\)/)[1];
    const fontUrl = fontFile.replace(/'|"/g, '');
    const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });

    const fontFileName = `${font.family.replace(' ', '-')}.ttf`;
    const fontFilePath = path.join(fontsDirectory, fontFileName);

    if (fs.existsSync(fontFilePath)) {
        fs.unlinkSync(fontFilePath);
        console.log(`Removed ${fontFileName}`);
    }

    fs.writeFileSync(fontFilePath, fontResponse.data);
    console.log(`Downloaded ${fontFileName}`);
});