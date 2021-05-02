export const slice = Array.prototype.slice;
export const flat = Array.prototype.flat;

let MESSAGE_SEQ = 1;
export const printMessage = (data) => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("ID : ", MESSAGE_SEQ++);
    console.log(data);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
};
