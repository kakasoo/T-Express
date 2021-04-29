// new 연산자

function Person(color) {
    this.race = color;
    this.getRace = function () {
        console.log(this.race);
    };
}

function Student(color, name) {
    Person.call(this, color);
    this.name = name || "kakasoo";
    return 987654321;
}

Student.sayKind2 = function () {
    console.log(this.race);
};

const student2 = new Student("yellow", "kakasoo");
