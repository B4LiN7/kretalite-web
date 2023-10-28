import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./style.css";
import { SubjectMgr } from "./SubjectMgr.ts";

const subjects: SubjectMgr = new SubjectMgr();
function selectedSubjectIndex(): number {
    return (document.getElementById("selectSubject") as HTMLSelectElement).selectedIndex;
}

function drawList(): void {
    const listSubjects = document.getElementById("listSubjects") as HTMLElement;
    listSubjects.innerHTML = "";

    subjects.getSubjects().forEach(subject => {
        const card = document.createElement("div");
        card.classList.add("card", "block");

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header", "d-flex", "justify-content-between", "align-items-center");
        cardHeader.innerText = subject.getName();

        const button = document.createElement("button");
        button.classList.add("btn", "btn-danger", "btn-sm");
        button.innerText = "Delete";
        button.addEventListener("click", () => {
            subjects.removeSubjectById(subjects.getSubjects().indexOf(subject));
            drawSelect();
            drawList();
        });

        cardHeader.appendChild(button);
        card.appendChild(cardHeader);

        subject.getGrades().forEach(grade => {
            const listGroup = document.createElement("ul");
            listGroup.classList.add("list-group", "list-group-flush");
    
            const listGroupItem = document.createElement("li");
            listGroupItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listGroupItem.innerText = grade.value + " (" + grade.weight * 100 + "%)";
    
            const button2 = document.createElement("button");
            button2.classList.add("btn", "btn-danger", "btn-sm");
            button2.innerText = "Delete";
            button2.addEventListener("click", () => { 
                subject.removeGradeById(subject.getGrades().indexOf(grade));
                drawList();
            });
    
            listGroupItem.appendChild(button2);
            listGroup.appendChild(listGroupItem);
            card.appendChild(listGroup);
        });

        listSubjects.appendChild(card);
    });
}

function drawSelect(): void {
    const selectSubject = document.getElementById("selectSubject") as HTMLElement;

    selectSubject.innerHTML = "";

    subjects.getSubjects().forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject.getName();
        option.innerText = subject.getName();
        selectSubject.appendChild(option);
    });

    if (subjects.getSubjects().length == 1) { 
        showSelectedSubject();
    }
}

function showSelectedSubject(): void {
    const selectedSubject = (document.getElementById("selectedSubject") as HTMLElement)
    if (subjects.getSubjects().length == 0) {
        selectedSubject.innerText = "";
    }
    else {
        const text: string = "(" + subjects.getSubjects()[selectedSubjectIndex()].getName() + ")";
        selectedSubject.innerText = text;
    }
}

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("addSubjectBtn")?.addEventListener("click", () => {
        const subject = (document.getElementById("addSubjectText") as HTMLInputElement).value.toString();
        subjects.addSubject(subject);
        drawSelect();
        drawList();
    });

    document.getElementById("selectSubject")?.addEventListener("change", () => { 
        showSelectedSubject();
    });

    document.getElementById("addGradeBtn")?.addEventListener("click", () => {
        const value = parseInt((document.getElementById("addGradeValue") as HTMLInputElement).value.toString());
        const weight = parseFloat((document.getElementById("addGradeWeight") as HTMLInputElement).value.toString());
        if (selectedSubjectIndex() != -1) {
            subjects.addGradeById(selectedSubjectIndex(), value, weight);
            drawList();
        }
        else {
            alert("Nincs kiválsztva tantárgy!");
        } 
    });

});