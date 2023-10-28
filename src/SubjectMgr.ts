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

    // Manage subjects
    addSubject(name: string) {
        this.subjects.push(new Subject(name));
    }

    removeSubjectById(index: number) {
        this.subjects.splice(index, 1);
    }

    // Manage grades
    addGradeById(index: number, value: number, weight: number) {
        this.subjects[index].addGrade(value, weight);
    }

    removeGradeById(subjectindex: number, gradeIndex: number) {
        this.subjects[subjectindex].removeGradeById(gradeIndex);
    }
}