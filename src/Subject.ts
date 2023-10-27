export class Subject {
    name: string;
    grades: Grade[];
    static usedNames: string[] = [];

    constructor(name: string) {
        if (Subject.usedNames.includes(name)) {
            throw new Error(`Subject name "${name}" is already used.`);
        }
        this.name = name;
        this.grades = [];
        Subject.usedNames.push(name);
    }

    addGrade(value: number, weight: number) {
        this.grades.push(new Grade(value, weight));
    }

    removeGradeById(index: number) {
        this.grades.splice(index, 1);
    }
}

class Grade {
    value: number;
    weight: number;

    constructor(value: number, weight: number) {
        this.value = value;
        this.weight = weight;
    }
}