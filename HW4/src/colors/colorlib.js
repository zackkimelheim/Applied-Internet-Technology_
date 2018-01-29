class Color{

  constructor(name, hex){
    this.name=name;
    this.hex = hex;

    this.r= parseInt(hex.substring(1,3),16);
    this.g= parseInt(hex.substring(3,5),16);
    this.b= parseInt(hex.substring(5),16);

    this.inverse = this.getInverse(this.hexToRgb(hex).r,this.hexToRgb(hex).g,this.hexToRgb(hex).b);
    //this.inverse = getInverse(255,0,0);
  }

  getHex(red,green,blue){
    let userColortoHex = "#";
    const tempred = red.toString(16);
    if(tempred.length === 1){
      userColortoHex += "0";
    }
    userColortoHex+=tempred;
    const tempgreen = green.toString(16);
    if(tempgreen.length === 1){
      userColortoHex += "0";
    }
    userColortoHex+=tempgreen;
    const tempblue = blue.toString(16);
    if(tempblue.length === 1){
      userColortoHex += "0";
    }
    userColortoHex+=tempblue;
    return userColortoHex;
  }

  getInverse(r,g,b){
    return this.getHex(255-r,255-g,255-b);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
}
module.exports = {
  Color:Color
};
