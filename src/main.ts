import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./style.css";
import { SubjectMgr } from "./SubjectMgr.ts";

const subjects: SubjectMgr = new SubjectMgr();
function selectedSubjectIndex(): number {
    return (document.getElementById("selectSubject") as HTMLSelectElement).selectedIndex;
}

function draw(): void {
    /*
    <div class="accordion" id="accordionExample">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Accordion Item #1
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                </div>
            </div>
        </div>
    </div>
    */

    const listSubjects = document.getElementById("listSubjects") as HTMLElement;
    listSubjects.innerHTML = "";

    subjects.getSubjects().forEach(subject => {
        
    });

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
        const button = document.createElement("button");
        button.classList.add("btn", "btn-danger", "btn-sm");
        button.innerText = "Törlés";
        button.addEventListener("click", () => {
            subjects.removeSubject(subject);
            drawSelect();
            drawList();
            drawSelectedSubject();
            drawStatistics();
        });

        // Append button to header and header to card
        cardHeader.appendChild(button);
        card.appendChild(cardHeader);

        // Create list group for grades
        const listGroup = document.createElement("ul");
        listGroup.classList.add("list-group", "list-group-flush");

        subject.getGrades().forEach(grade => {
            // Create list group item for grade
            const listGroupItem = document.createElement("li");
            listGroupItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            listGroupItem.innerText = grade.getValue() + " (" + grade.getWeight() * 100 + "%)";
    
            // Create delete button for grade
            const button2 = document.createElement("button");
            button2.classList.add("btn", "btn-danger", "btn-sm");
            button2.innerText = "Törlés";
            button2.addEventListener("click", () => { 
                subject.removeGrade(grade);
                drawList();
                drawStatistics();
            });
    
            // Append delete button to list group item and item to list group
            listGroupItem.appendChild(button2);
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

/* Old version of drawStatistics(). Keep for reference.
function drawStatistics(): void {
    const listStatistics = (document.getElementById("listStatistics") as HTMLElement)
    listStatistics.innerHTML = "";

    subjects.getSubjects().forEach(subject => {
        const listGroupItem = document.createElement("li");
        listGroupItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        listGroupItem.innerText = subject.getName() + " (" + subject.getAverage() + ")";
        listStatistics.appendChild(listGroupItem);
    });
}
*/

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