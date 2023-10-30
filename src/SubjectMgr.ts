import { Subject, Grade } from "./Subject";

export class SubjectMgr {
    private subjects: Subject[];

    constructor() {
        this.subjects = [];
    }
    
    // Getters
    getSubjects(): Subject[] {
        return this.subjects;
    }

    getSubjectById(index: number): Subject | undefined {
        return this.subjects[index];
    }

    getGradeById(subjectindex: number, gradeIndex: number): Grade | undefined {
        return this.subjects[subjectindex].getGrades()[gradeIndex];
    }

    // Getters for statistics
    getAverageBySubjectId(index: number): number {
        return this.subjects[index].getAverage();
    }

    // Manage subjects
    addSubject(name: string) {
        this.subjects.push(new Subject(name));
    }
    
    removeSubject(subject: Subject) {
        const index = this.subjects.indexOf(subject);
        this.removeSubjectById(index);
    }

    removeSubjectById(index: number) {
        this.subjects[index].removeUsedName(this.subjects[index].getName());
        this.subjects.splice(index, 1);
    }

    // Manage grades
    addGradeById(index: number, value: number, weight: number) {
        this.subjects[index].addGrade(value, weight);
    }

    removeGradeById(subjectindex: number, gradeIndex: number) {
        this.subjects[subjectindex].removeGradeById(gradeIndex);
    }

    editGradeById(subjectindex: number, gradeIndex: number, value: number, weight: number) {
        this.subjects[subjectindex].editGradeById(gradeIndex, value, weight);
    }

    // Json management
    toJson(): string {
        return JSON.stringify(this.subjects);
    }

    fromJson(json: string) {
        this.subjects = [];
        const subjectsJson = JSON.parse(json);
        subjectsJson.forEach((subjectJson: any) => {
            const subject = new Subject(subjectJson.name);
            subjectJson.grades.forEach((gradeJson: any) => {
                subject.addGrade(gradeJson.value, gradeJson.weight);
            });
            this.subjects.push(subject);
        });
    }
}