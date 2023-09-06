const { fonts } = require('./fonts.json');
const fs = require('fs');
const axios = require('axios');

fonts.forEach(async font => {
    const url = `https://fonts.googleapis.com/css?family=${font.family.replace(' ', '+')}`;
    const response = await axios.get(url);
    const fontFile = response.data.match(/url\((.*?)\)/)[1];
    const fontUrl = fontFile.replace(/'|"/g, '');
    const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });
    
    if (fs.existsSync(`./fonts/${font.family.replace(' ', '-')}.ttf`)) {
        fs.unlinkSync(`./fonts/${font.family.replace(' ', '-')}.ttf`);

        console.log(`Removed ${font.family.replace(' ', '-')}.ttf`)
        fs.writeFileSync(`./fonts/${font.family.replace(' ', '-')}.ttf`, fontResponse.data);
        console.log(`Overwrote ${font.family.replace(' ', '-')}.ttf`)
        return;
    } else {
        fs.writeFileSync(`./fonts/${font.family.replace(' ', '-')}.ttf`, fontResponse.data);
        console.log(`Downloaded ${font.family.replace(' ', '-')}.ttf`)
    }
});