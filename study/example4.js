class ClassPerson {
    constructor() {
        this.kind = "ClassPerson";
    }

    sayKind() {
        console.log(this.kind);
    }
}

class ClassStudent extends ClassPerson {
    constructor() {
        super();
        this.name = "kakasoo2";
    }

    sayName() {
        console.log(this.name);
    }
}

const student2 = new ClassStudent();
console.log(student2);
console.log("ClassPerson.prototype : ", ClassPerson.prototype);
console.log("ClassStudent.prototype : ", ClassStudent.prototype);
student2.sayKind();
