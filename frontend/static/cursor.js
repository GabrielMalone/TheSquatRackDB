
//-----------------------------------------------------------------------------
// cursor for adding/removing exercise, attached to another container
//-----------------------------------------------------------------------------
export function createCursor(container){
    const cursor = document.createElement('div'); 
    cursor.classList.add("cursor");
    cursor.setAttribute("id", `cursorFor${container.id}`);
    cursor.innerHTML = '<div class="cursorPlus">+</div>';
    if (container.classList.contains('prDash')){   // attach to outside of dash
        container.insertAdjacentElement("afterend", cursor);
    } else {                                // attach to inside of workout dash
        container.append(cursor);
    }   
}
