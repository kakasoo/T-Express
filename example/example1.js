// function 키워드와 화살표 함수의 차이

function Func() {
    console.log("Func");
}

console.log(Func.prototype.constructor === Func); // true
console.log(Number.prototype.constructor === Number); // true

const arrowFunc = () => {
    this.name = "kakasoo";
    console.log(this.name);
};

arrowFunc(); // kakasoo
console.log(this); // { name : kakasoo }
console.log(arrowFunc.prototype); // undefined
