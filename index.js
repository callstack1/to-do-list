"use strict"

const taskContainer = document.querySelector(".task-container");
const enterButton = document.querySelector("#enter");
const input = document.querySelector("input");
const animationStatus = document.querySelector("button");
const tip = document.querySelector(".tip");

let dragged; // task container that is beign moved
let draggedBox; // drop task div that the dragged task is contained
let removeAnimation = 0; // remove animations when tasks are removed set to 0 by default

input.addEventListener("keydown", addTask); // hits enter in input adds a task
enterButton.addEventListener("click", addTask); // clicking the enter button adds a task
animationStatus.addEventListener("click", animationState); // clicking the box in the top of the page remove animation

function startApp(){
    // remove the tip box at the start of the page when the user click the X button in it
    const closeTip = document.querySelector(".xtip");
    closeTip.addEventListener("click", () => {
        tip.parentNode.removeChild(tip);
    })
}

function animationState(event){
    // changes the animation when removing a task
    if (removeAnimation == 0){
        event.target.className = "effectOff";
        removeAnimation = 1;
    } else {
        event.target.className = "effectOn";
        removeAnimation = 0;
    }
}

function addTask(event){
    if (event.key == "Enter" || event.buttons == "0"){
        // creates a new task
        const newTask = document.createElement("div");
        const dropTask = document.createElement("div");
        const removeButton = document.createElement("div");
        const input = document.querySelector("input");
        if (input.value !== ""){
            newTask.className = "newTask";
            newTask.textContent = input.value; 
            newTask.draggable = "true";
            dropTask.className = "dropTask";
            removeButton.className = "removeButton";
            // add a new task in the task container div with its respective remove button
            taskContainer.appendChild(dropTask);
            dropTask.appendChild(newTask);
            newTask.appendChild(removeButton);
            input.value = "";
            removeTask(removeButton);
            // adding the remove functionality to the task
            doneTask(newTask);
            // adding functionality of double clicking to set a task as done
            if (tip !== null){
                tip.parentNode.removeChild(tip);
                // remove the tip box if the first task is added and it wasn't remove clicking the X button
            }
            else if (newTask.clientHeight > 40){
                removeButton.style.top = -newTask.clientHeight + 25 + "px";
                // remove button will be at the top right of every task, no matter how big its input are
            }
        }
    }
}

function dragStart(event){
    // if a drag event is started, the selected task (dragged) will have its opacity changed
    // try statement to get an error when the user tries to drag the to do list logo/banner
    try {
        event.target.style.opacity = "0.5";
        dragged = event.target; // sets the dragged and draggedBox as the event.target
        draggedBox = event.target.parentNode;
    } catch (error) {
        return "";
    }
}

function dragEnd(event){
    // when the drag finishes, opacity geos back to normal, so the background color of the task
    try {
        event.target.style.opacity = "";
        event.target.style.background = "#337ea1";
    } catch (error) {
        if (error == TypeError){
            return "";
        }
    }
}

function orderTask(){
    document.addEventListener("dragstart", dragStart, false);
    document.addEventListener("dragend", dragEnd);

    document.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    document.addEventListener("dragenter", (event) => {
        try {
            if (event.target.className === "newTask" || event.target.className == "dropTask"){
                if (dragged.className == "newTask" || dragged.className == "dropTask"){
                    event.target.style.background = "green";
                    dragged.style.background = "#337ea1"
                    // if the dragged content is going to another dragged box, the color of the chosen
                    // one will change to green
                }
            } else {
                // if not, the dragged will turn the background to red
                dragged.style.background = "red";
            }
        } catch (error) {
            if (error == TypeError){
                return ""
            }
        }
    });

    document.addEventListener("dragleave", (event) => {
        // if the dragged leaves the drop box, then its background will return to its default
        event.target.style.background = "";
    });

    document.addEventListener("drop", (event) => {
        // when the dragged encounter a dragged box, it will change place
        const dropTask = event.target.parentNode;
        if (dropTask.className == "dropTask"){
            draggedBox.removeChild(dragged);
            draggedBox.appendChild(event.target);
            dropTask.appendChild(dragged);
            event.target.style.background = "#337ea1";
        }
        event.preventDefault();
    });
}

function doneTask(tasks){
    tasks.addEventListener("dblclick", (event) => {
        event.preventDefault();
        // double clicking changes the text to line-trough and get its background set to grey
        if (event.target.style.background !== "grey"){
            event.target.style.background = "grey";
            event.target.style.textDecoration = "line-through";
        } else {
            event.target.style.background = "#337ea1";
            event.target.style.textDecoration = "none";
        }
    })
}

function removeTask(remove){
    // when clicking the task X button, the task will be removed
    remove.addEventListener("click", (event) => {
        let eraseTask = event.currentTarget.parentNode;
        while (eraseTask.className !== "dropTask"){
            eraseTask = eraseTask.parentNode;
        }
        if (removeAnimation == 0){
            eraseTask.className = "transitionEffect";
            setTimeout(() => {
                eraseTask.parentNode.removeChild(eraseTask);
                // timeout to wait for the animation to end, it it is set to on
            }, 1100);
        } else {
            eraseTask.parentNode.removeChild(eraseTask);
        }
    })
};

function scrollBannerEffect(){
    // banner effect when scrolling down
    // adds a back to top button in the end of the page
    const banner = document.querySelector(".banner");
    const backToTop = document.querySelector("a");
    document.addEventListener("scroll", () => {
        banner.style.top = -pageYOffset*0.4 + "px";
        if (pageYOffset > 260){
            backToTop.style.display = "block";
            document.body.appendChild(backToTop);
            backToTop.addEventListener("click", (event) => {
                event.target.style.display = "none";
            })
        } else if (pageYOffset < 260) {
            backToTop.style.display = "none";
        }
    });
}

scrollBannerEffect();
orderTask();
startApp();