import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./style.css";
import { Subject } from "./Subject.ts";

let subjects: Subject[] = [];
const selectedSubjectIndex = (): number => { 
    return (document.getElementById("selectSubject") as HTMLSelectElement).selectedIndex;
};

function drawList(): void {
    const listSubjects = document.getElementById("listSubjects") as HTMLElement;
    listSubjects.innerHTML = "";

    subjects.forEach(subject => {
        const card = document.createElement("div");
        card.classList.add("card", "block");

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header", "d-flex", "justify-content-between", "align-items-center");
        cardHeader.innerText = subject.name;

        const button = document.createElement("button");
        button.classList.add("btn", "btn-danger", "btn-sm");
        button.innerText = "Delete";
        button.addEventListener("click", () => {
            subjects.splice(subjects.indexOf(subject), 1);
            drawSelect();
            drawList();
        });

        cardHeader.appendChild(button);
        card.appendChild(cardHeader);

        subject.grades.forEach(grade => {
            const listGroup = document.createElement("ul");
            listGroup.classList.add("list-group", "list-group-flush");
    
            const listGroupItem = document.createElement("li");
            listGroupItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listGroupItem.innerText = grade.value + " (" + grade.weight * 100 + "%)";
    
            const button2 = document.createElement("button");
            button2.classList.add("btn", "btn-danger", "btn-sm");
            button2.innerText = "Delete";
            button2.addEventListener("click", () => { 
                subject.removeGradeById(subject.grades.indexOf(grade));
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

    subjects.forEach((subject: Subject) => {
        const option = document.createElement("option");
        option.value = subject.name;
        option.innerText = subject.name;
        selectSubject.appendChild(option);
    });

    if (subjects.length == 1) { 
        showSelectedSubject();
    }
}



function showSelectedSubject(): void {
    const selectedSubject = (document.getElementById("selectedSubject") as HTMLElement)
    if (subjects.length == 0) {
        selectedSubject.innerText = "";
    }
    else {
        const text: string = "(" + subjects[selectedSubjectIndex()].name + ")";
        selectedSubject.innerText = text;
    }
}

document.addEventListener("DOMContentLoaded", () => { 

    document.getElementById("addSubjectBtn")?.addEventListener("click", () => {
        const subject = (document.getElementById("addSubjectText") as HTMLInputElement).value.toString();
        subjects.push(new Subject(subject));
        drawSelect();
    });

    document.getElementById("selectSubject")?.addEventListener("change", () => { 
        showSelectedSubject();
    });

    document.getElementById("addGradeBtn")?.addEventListener("click", () => {
        const value = parseInt((document.getElementById("addGradeValue") as HTMLInputElement).value.toString());
        const weight = parseFloat((document.getElementById("addGradeWeight") as HTMLInputElement).value.toString());
        if (selectedSubjectIndex() != -1) {
            subjects[selectedSubjectIndex()].addGrade(value, weight);
            drawList();
        }
        else {
            alert("Nincs kiválsztva tantárgy!");
        } 
    });

});