export class Subject {
    private name: string;
    private grades: Grade[];
    private static usedNames: string[] = [];

    constructor(name: string) {
        name = name.trim();
        if (Subject.usedNames.includes(name)) {
            throw new Error(`A(z) "${name}" tantárgy név már foglalt.`);
        } else if (name == "") {
            throw new Error(`A tantárgy név nem lehet üres.`);
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
        let totalVW = 0;
        this.grades.forEach(grade => {
            totalVW += grade.getValue() * grade.getWeight();
        });
        let totalWeight = 0;
        this.grades.forEach(grade => {
            totalWeight += grade.getWeight();
        });
        return totalVW / totalWeight;
    }

    // Manage grades
    addGrade(value: number, weight: number) {
        this.grades.push(new Grade(value, weight));
    }

    removeGrade(grade: Grade) {
        const index = this.grades.indexOf(grade);
        this.removeGradeById(index);
    }

    removeGradeById(index: number) {
        this.grades.splice(index, 1);
    }

    editGrade(grade: Grade, value: number, weight: number) {
        const index = this.grades.indexOf(grade);
        this.editGradeById(index, value, weight);
    }

    editGradeById(index: number, value: number, weight: number) {
        this.grades[index].editGrade(value, weight);
    }
}

export class Grade {
    private value: number;
    private weight: number;
    private addDate: Date;
    private editDate: Date;

    private static minValue = 1;
    private static maxValue = 5;
    private static minWeight = 0.01;
    private static maxWeight = 10;

    constructor(value: number, weight: number) {
        if (isNaN(value) || isNaN(weight)) {
            throw new Error(`Az értéknek és/vagy a súlynak számnak kell lennie.`);
        }
        else if (value < Grade.minValue || value > Grade.maxValue) {
            throw new Error(`A jegy értéknek ${Grade.minValue} és ${Grade.maxValue} között kell lennie.`);
        }
        else if (weight < Grade.minWeight || weight > Grade.maxWeight) {
            throw new Error(`A jegy súlyának ${Grade.minWeight} és ${Grade.maxWeight} között kell lennie.`);
        }
        this.value = value;
        this.weight = weight;
        this.addDate = new Date();
        this.editDate = new Date();
    }

    // Getters
    getValue(): number {
        return this.value;
    }

    getWeight(): number {
        return this.weight;
    }

    getAddDate(): Date {
        return this.addDate;
    }

    getEditDate(): Date {
        return this.editDate;
    }

    // Edit grade
    editGrade(value: number, weight: number) {
        this.value = value;
        this.weight = weight;
        this.editDate = new Date();
    }
}