export class Subject {
    private name: string;
    private grades: Grade[];
    private static usedNames: string[] = [];

    constructor(name: string) {
        name = name.trim();
        if (Subject.usedNames.includes(name) || name == "") {
            throw new Error(`Subject name "${name}" is already used.`);
        }
        this.name = name;
        this.grades = [];
        Subject.usedNames.push(name);
    }

    removeUsedName(name: string) { 
        Subject.usedNames.splice(Subject.usedNames.indexOf(name), 1);
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

    // Getters for statistics
    getAverage(): number {
        let average = 0;
        this.grades.forEach(grade => {
            average += grade.getValue() * grade.getWeight();
        });
        let totalWeight = 0;
        this.grades.forEach(grade => {
            totalWeight += grade.getWeight();
        });
        return average / totalWeight;
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
    private value: number;
    private weight: number;

    constructor(value: number, weight: number) {
        this.value = value;
        this.weight = weight;
    }

    // Getters
    getValue(): number {
        return this.value;
    }

    getWeight(): number {
        return this.weight;
    }
}