// prototype 설명 1

function Person1() {
    this.kind = "Person1";
    this.sayKind = function () {
        console.log(this.kind);
    };
}

function Student1() {
    Person1.call(this);
    this.name = "kakasoo";
}

console.log("Student1.prototype : ", Student1.prototype);

/**
 * Object.prototype.create
 */
function Person2() {
    this.kind = "Person2";
    this.sayKind = function () {
        console.log(this.kind);
    };
}

function Student2() {
    Person2.call(this);
    this.name = "kakasoo";
}

console.log("1) Student2 : ", Student2.prototype); // {}

Student2.prototype = Object.create(Person2.prototype);
console.log("2) Student2 : ", Student2.prototype);

Student2.prototype.constructor = Student2;
console.log("3) Student2 : ", Student2.prototype);

/**
 * Person3.prototype.sayKind
 */
function Person3() {
    this.kind = "Person3";
    this.sayKind = function () {
        console.log(this.kind);
    };
}

function Student3() {
    Person3.call(this);
    this.name = "kakasoo";
}

Student3.prototype.sayName = function () {
    console.log(this.name);
};

new Student3().sayName();
