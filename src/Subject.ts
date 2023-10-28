export class Subject {
    private name: string;
    private grades: Grade[];
    private static usedNames: string[] = [];

    constructor(name: string) {
        if (Subject.usedNames.includes(name)) {
            throw new Error(`Subject name "${name}" is already used.`);
        }
        this.name = name;
        this.grades = [];
        Subject.usedNames.push(name);
    }

    // Getters
    getName(): string {
        return this.name;
    }

    getGrades(): Grade[] {
        return this.grades;
    }

    getGradeById(index: number): Grade | undefined {
        return this.grades[index];
    }

    // Manage grades
    addGrade(value: number, weight: number) {
        this.grades.push(new Grade(value, weight));
    }

    removeGradeById(index: number) {
        this.grades.splice(index, 1);
    }
}

export class Grade {
    value: number;
    weight: number;

    constructor(value: number, weight: number) {
        this.value = value;
        this.weight = weight;
    }
}