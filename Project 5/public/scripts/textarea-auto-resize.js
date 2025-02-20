function autoResizeTextArea(textarea) {
    textarea.addEventListener('input', autoResize, false)
}


function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 10 + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach(autoResizeTextArea)
});