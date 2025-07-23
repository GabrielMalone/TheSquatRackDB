
//-----------------------------------------------------------------------------
// cursor for adding/removing exercise, attached to another container
//-----------------------------------------------------------------------------
export function createCursor(container){
    const cursor = document.createElement('div'); 
    cursor.classList.add("cursor");
    cursor.setAttribute("id", `cursorFor${container.id}`);
    cursor.innerHTML = '<div class="cursorPlus">+</div>';
    container.append(cursor);
}
