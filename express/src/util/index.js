export const slice = Array.prototype.slice;

let MESSAGE_SEQ = 1;

export const logerror = (err) => {
    console.log("에러 처리 영역.");
    // if (this.get("env") !== "test") console.error(err.stack || err.toString());
};
