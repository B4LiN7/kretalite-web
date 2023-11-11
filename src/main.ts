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
        // Card for subject(s)
        const card = document.createElement("div");
        card.classList.add("card", "block");

        // Card header with the subject name
        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header", "d-flex", "justify-content-between", "align-items-center");
        cardHeader.innerText = subject.getName();

        // Card header delete button
        const btnDeleteSubject = document.createElement("button");
        btnDeleteSubject.classList.add("btn", "btn-outline-danger", "btn-sm");
        btnDeleteSubject.innerText = "Törlés";
        btnDeleteSubject.addEventListener("click", () => {
            subjects.removeSubject(subject);
            drawSelect();
            drawList();
            drawSelectedSubject();
            drawStatistics();
        });

        // Append button to header and header to card
        cardHeader.appendChild(btnDeleteSubject);
        card.appendChild(cardHeader);

        // Create list group for grades
        const listGroup = document.createElement("ul");
        listGroup.classList.add("list-group", "list-group-flush");

        subject.getGrades().forEach(grade => {
            // Create list group item for grade
            const listGroupItem = document.createElement("li");
            listGroupItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listGroupItem.innerText = `${grade.getValue()} (${Math.round(grade.getWeight() * 100)}%) [${grade.getEditDateLocale()}]`;
    
            const btnContainer = document.createElement("div");
            btnContainer.classList.add("btn-group");

            // Create delete button for grade
            const btnDeleteGrade = document.createElement("button");
            btnDeleteGrade.classList.add("btn", "btn-outline-danger", "btn-sm");
            btnDeleteGrade.innerText = "Törlés";
            btnDeleteGrade.addEventListener("click", () => { 
                subject.removeGrade(grade);
                drawList();
                drawStatistics();
            });

            // Create edit button for grade
            const btnEditGrade = document.createElement("button");
            btnEditGrade.classList.add("btn", "btn-outline-primary", "btn-sm");
            btnEditGrade.innerText = "Szerkesztés";
            btnEditGrade.addEventListener("click", () => { 
                /*const value = parseInt((document.getElementById("editGradeValue") as HTMLInputElement).value.toString());
                const weight = parseFloat((document.getElementById("editGradeWeight") as HTMLInputElement).value.toString());
                subject.editGrade(grade, value, weight);
                drawList();
                drawStatistics();*/
                alert("Ez a funkció még nem elérhető!");
            });

            btnContainer.appendChild(btnEditGrade);
            btnContainer.appendChild(btnDeleteGrade);
    
            // Append delete button to list group item and item to list group
            listGroupItem.appendChild(btnContainer);
            listGroup.appendChild(listGroupItem);
        });

        // Create list group item for adding grades
        card.appendChild(listGroup);
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
        drawSelectedSubject();
    }
}

function drawSelectedSubject(): void {
    const selectedSubject = (document.getElementById("selectedSubject") as HTMLElement)
    if (subjects.getSubjects().length == 0) {
        selectedSubject.innerText = "";
    }
    else {
        const text: string = "(" + subjects.getSubjects()[selectedSubjectIndex()].getName() + ")";
        selectedSubject.innerText = text;
    }
}

function drawStatistics(): void {
    const listStatistics = (document.getElementById("listStatistics") as HTMLElement)
    listStatistics.innerHTML = "";

    subjects.getSubjects().forEach(subject => {
        listStatistics.innerHTML += `
        <tr>
            <td>${subject.getName()}</td>
            <td>${subject.getAverage()}</td>
        </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("addSubjectBtn")?.addEventListener("click", () => {
        const subject = (document.getElementById("addSubjectText") as HTMLInputElement).value.toString();
        subjects.addSubject(subject);
        drawSelect();
        drawList();
    });

    document.getElementById("selectSubject")?.addEventListener("change", () => { 
        drawSelectedSubject();
    });

    document.getElementById("addGradeBtn")?.addEventListener("click", () => {
        const value = parseInt((document.getElementById("addGradeValue") as HTMLInputElement).value.toString());
        const weight = parseFloat((document.getElementById("addGradeWeight") as HTMLInputElement).value.toString());
        if (selectedSubjectIndex() != -1) {
            subjects.addGradeById(selectedSubjectIndex(), value, weight);
            drawList();
            drawStatistics();
        }
        else {
            alert("Nincs kiválsztva tantárgy!");
        } 
    });

    document.getElementById("downloadJson")?.addEventListener("click", () => { 
        if (subjects.getSubjects().length > 0) { 
            const json = subjects.toJson();
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = Date.now().toString() + ".json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            throw new Error("Nincs tantárgy!");
        }

    });

    document.getElementById("uploadJson")?.addEventListener("click", () => { 
        const file = (document.getElementById("uploadJsonInput") as HTMLInputElement).files?.item(0);
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                subjects.fromJson(reader.result as string);
                drawSelect();
                drawList();
                drawStatistics();
                drawSelectedSubject();
            }
        } else {
            throw new Error("Nincs kiválasztva fájl!");
        }
    });

    document.querySelector('body')?.setAttribute('data-bs-theme', 'dark');

});