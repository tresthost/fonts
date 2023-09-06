const { fonts } = require('./fonts.json');
const fs = require('fs');
const axios = require('axios');

fonts.forEach(async font => {
    if (fs.existsSync(`./fonts/${font.family.replace(' ', '-')}.ttf`)) return;

    const url = `https://fonts.googleapis.com/css?family=${font.family.replace(' ', '+')}`;
    const response = await axios.get(url);
    const fontFile = response.data.match(/url\((.*?)\)/)[1];
    const fontUrl = fontFile.replace(/'|"/g, '');
    const fontResponse = await axios.get(fontUrl, { responseType: 'arraybuffer' });
    
    fs.writeFileSync(`./fonts/${font.family.replace(' ', '-')}.ttf`, fontResponse.data);
});